#!/bin/bash

# 종료 시 오류 발생하도록 설정
set -e

# 필요한 디렉토리 생성
mkdir -p build/pkg
mkdir -p build/scripts

# 환경 설정
APP_NAME="CafeScraper"
APP_VERSION="1.0.0"
IDENTIFIER="com.nomad.cafe-scraper"

# 현재 작업 디렉토리 출력 (디버깅용)
echo "Current working directory: $(pwd)"

# Python 의존성 설치
pip install -r requirements.txt
pip install py2app

# 기존 빌드 정리
rm -rf build dist

# py2app으로 앱 빌드
python setup.py py2app

# 빌드 결과 확인
if [ ! -d "dist/$APP_NAME.app" ]; then
    echo "Error: App build failed - dist/$APP_NAME.app not found"
    exit 1
fi

# 설치 후 스크립트 생성
cat > build/scripts/postinstall << EOF
#!/bin/bash
# 앱을 Applications 폴더로 복사
cp -R "/tmp/$APP_NAME.app" "/Applications/"
EOF

# 스크립트에 실행 권한 부여
chmod +x build/scripts/postinstall

# distribution.xml 생성 전 디렉토리 확인
echo "Creating distribution.xml in: $(pwd)/build/pkg"

# distribution.xml 생성
cat > "build/pkg/distribution.xml" << EOF
<?xml version="1.0" encoding="utf-8"?>
<installer-gui-script minSpecVersion="1">
    <title>$APP_NAME</title>
    <organization>$IDENTIFIER</organization>
    <domains enable_localSystem="true"/>
    <options customize="never" require-scripts="true" rootVolumeOnly="true" />
    <volume-check>
        <allowed-os-versions>
            <os-version min="10.10"/>
        </allowed-os-versions>
    </volume-check>
    <pkg-ref id="$IDENTIFIER"/>
    <choices-outline>
        <line choice="default">
            <line choice="$IDENTIFIER"/>
        </line>
    </choices-outline>
    <choice id="default"/>
    <choice id="$IDENTIFIER" visible="false">
        <pkg-ref id="$IDENTIFIER"/>
    </choice>
    <pkg-ref id="$IDENTIFIER" version="$APP_VERSION" onConclusion="none">$APP_NAME-component.pkg</pkg-ref>
</installer-gui-script>
EOF

# distribution.xml 파일 존재 확인
if [ ! -f "build/pkg/distribution.xml" ]; then
    echo "Error: distribution.xml was not created"
    exit 1
fi

echo "distribution.xml contents:"
cat "build/pkg/distribution.xml"

# component pkg 생성
echo "Creating component package..."
pkgbuild \
    --root "dist/$APP_NAME.app" \
    --install-location "/tmp/$APP_NAME.app" \
    --scripts build/scripts \
    --identifier "$IDENTIFIER" \
    --version "$APP_VERSION" \
    "build/pkg/$APP_NAME-component.pkg"

# component pkg 파일 존재 확인
if [ ! -f "build/pkg/$APP_NAME-component.pkg" ]; then
    echo "Error: Component package was not created"
    exit 1
fi

# 최종 pkg 생성
echo "Creating final package..."
productbuild \
    --distribution "build/pkg/distribution.xml" \
    --package-path "build/pkg" \
    --version "$APP_VERSION" \
    "dist/$APP_NAME-$APP_VERSION.pkg"

echo "Build completed: dist/$APP_NAME-$APP_VERSION.pkg" 