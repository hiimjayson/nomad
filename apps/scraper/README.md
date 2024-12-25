## 환경 설정

```sh
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 또는
.\venv\Scripts\activate  # Windows
```

## 패키지 설치

```sh
# 기본 패키지 설치
pip install -e .

# 개발 환경 설치 (테스트 등 개발 도구 포함)
pip install -e ".[dev]"

# selenium webdriver 설치
pip install selenium

# 의존성 업데이트
pip freeze > requirements.txt
```

## 테스트 실행

```sh
python3 src/main.py
```

## 비활성화

```sh
deactivate
```
