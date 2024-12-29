from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLineEdit, QPushButton, QTextEdit, QLabel,
    QProgressBar, QMessageBox, QGroupBox, QFormLayout,
    QSpinBox, QCheckBox, QScrollArea, QGridLayout, QFrame
)
from PyQt6.QtCore import Qt, QThread, pyqtSignal, QSize
from PyQt6.QtGui import QPixmap
from src.services.openai_service import OpenAIService
from src.scraper import Scraper
import json
import requests
from io import BytesIO


class ScraperWorker(QThread):
    finished = pyqtSignal(str)
    progress = pyqtSignal(int)
    error = pyqtSignal(str)

    def __init__(self, api_key: str, search_term: str):
        super().__init__()
        self.api_key = api_key
        self.search_term = search_term

    def run(self):
        try:
            openai_service = OpenAIService(self.api_key)
            scraper = Scraper(openai_service)
            result = scraper.scrape(self.search_term)
            self.finished.emit(result)
        except Exception as e:
            self.error.emit(str(e))


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("카페 스크래퍼")
        self.setMinimumSize(1000, 800)

        # 메인 위젯 설정
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        layout = QVBoxLayout(main_widget)

        # 좌우 분할을 위한 수평 레이아웃
        split_layout = QHBoxLayout()

        # 왼쪽 영역 (기존 스크래핑 UI)
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)

        # 이미지를 표시할 영역 추가 - 위치 이동
        self.images_group = QGroupBox("카페 사진")
        images_outer_layout = QVBoxLayout()
        self.images_grid = QGridLayout()  # grid layout으로 변경
        images_outer_layout.addLayout(self.images_grid)
        self.images_group.setLayout(images_outer_layout)

        # 스크롤 영역 생성
        scroll = QScrollArea()
        scroll.setWidget(self.images_group)
        scroll.setWidgetResizable(True)
        left_layout.addWidget(scroll)  # left_layout에 추가

        # API 키 입력
        api_key_layout = QHBoxLayout()
        api_key_label = QLabel("OpenAI API 키:")
        self.api_key_input = QLineEdit()
        self.api_key_input.setEchoMode(QLineEdit.EchoMode.Password)
        api_key_layout.addWidget(api_key_label)
        api_key_layout.addWidget(self.api_key_input)
        left_layout.addLayout(api_key_layout)

        # 검색어 입력
        search_layout = QHBoxLayout()
        search_label = QLabel("네이버지도 링크:")
        self.search_input = QLineEdit()
        search_layout.addWidget(search_label)
        search_layout.addWidget(self.search_input)
        left_layout.addLayout(search_layout)

        # 버튼 그룹을 위한 수평 레이아웃
        button_layout = QHBoxLayout()

        # 시작 버튼
        self.start_button = QPushButton("스크래핑 시작")
        self.start_button.clicked.connect(self.start_scraping)
        button_layout.addWidget(self.start_button)

        # 테스트 데이터 버튼 추가
        self.test_button = QPushButton("테스트 데이터 로드")
        self.test_button.clicked.connect(self.load_test_data)
        button_layout.addWidget(self.test_button)

        left_layout.addLayout(button_layout)

        # 진행바
        self.progress_bar = QProgressBar()
        left_layout.addWidget(self.progress_bar)

        # 오른쪽 영역 (데이터 편집 UI)
        right_widget = QWidget()
        right_layout = QVBoxLayout(right_widget)

        # 기본 정보 그룹
        basic_group = QGroupBox("기본 정보")
        basic_layout = QFormLayout()

        # 입력 필드들의 최소 너비 설정
        min_width = 300

        self.name_input = QLineEdit()
        self.name_input.setMinimumWidth(min_width)
        basic_layout.addRow("이름:", self.name_input)

        self.english_name_input = QLineEdit()
        self.english_name_input.setMinimumWidth(min_width)
        basic_layout.addRow("영문 이름:", self.english_name_input)

        self.short_address_input = QLineEdit()
        self.short_address_input.setMinimumWidth(min_width)
        basic_layout.addRow("짧은 주소:", self.short_address_input)

        self.full_address_input = QLineEdit()
        self.full_address_input.setMinimumWidth(min_width)
        basic_layout.addRow("전체 주소:", self.full_address_input)

        self.americano_price_input = QSpinBox()
        self.americano_price_input.setMinimumWidth(min_width)
        self.americano_price_input.setRange(0, 100000)
        self.americano_price_input.setSingleStep(100)
        basic_layout.addRow("아메리카노 가격:", self.americano_price_input)

        # 라벨과 입력 필드 사이의 간격 조정
        basic_layout.setSpacing(10)
        basic_layout.setContentsMargins(10, 10, 10, 10)

        basic_group.setLayout(basic_layout)
        right_layout.addWidget(basic_group)

        # 점수 그룹
        scores_group = QGroupBox("평가 점수")
        scores_layout = QFormLayout()

        self.score_inputs = {}
        for score_name in ["콘센트", "공간", "소음", "음식", "예쁨", "와이파이", "화장실 청결도", "의자", "조명"]:
            score_input = QSpinBox()
            score_input.setRange(1, 5)
            scores_layout.addRow(f"{score_name}:", score_input)
            self.score_inputs[score_name] = score_input

        scores_group.setLayout(scores_layout)
        right_layout.addWidget(scores_group)

        # 추가 정보 그룹
        extra_group = QGroupBox("추가 정보")
        extra_layout = QFormLayout()

        self.has_toilet_check = QCheckBox()
        extra_layout.addRow("화장실 있음:", self.has_toilet_check)

        self.non_coffee_check = QCheckBox()
        extra_layout.addRow("논커피 메뉴:", self.non_coffee_check)

        self.parking_info_input = QTextEdit()
        self.parking_info_input.setMaximumHeight(60)
        extra_layout.addRow("주차 정보:", self.parking_info_input)

        extra_group.setLayout(extra_layout)
        right_layout.addWidget(extra_group)

        # 저장 버튼
        self.save_button = QPushButton("데이터 저장")
        self.save_button.clicked.connect(self.save_data)
        right_layout.addWidget(self.save_button)

        # 기사를 표시할 스크롤 영역 미리 생성
        self.articles_scroll = QScrollArea()
        self.articles_scroll.setWidgetResizable(True)
        self.articles_scroll.setMaximumHeight(200)
        right_layout.insertWidget(
            right_layout.count() - 1, self.articles_scroll)

        # 분할 레이아웃에 위젯 추가
        split_layout.addWidget(left_widget, 1)
        split_layout.addWidget(right_widget, 1)
        layout.addLayout(split_layout)

    def start_scraping(self):
        api_key = self.api_key_input.text()
        naver_map_link = self.search_input.text()

        if not api_key or not naver_map_link:
            QMessageBox.warning(self, "경고", "API 키와 링크를 모두 입력해주세요.")
            return

        self.start_button.setEnabled(False)
        self.progress_bar.setRange(0, 0)  # 불확정 진행바 표시

        self.worker = ScraperWorker(api_key, naver_map_link)
        self.worker.finished.connect(self.on_scraping_finished)
        self.worker.error.connect(self.on_scraping_error)
        self.worker.start()

    def update_articles_section(self, searched_articles):
        """기사 섹션을 업데이트하는 헬퍼 메서드"""
        articles_group = QGroupBox("검색된 기사")
        articles_layout = QVBoxLayout()

        if searched_articles:
            for article in searched_articles:
                article_widget = QWidget()
                article_layout = QVBoxLayout()

                # 기사 제목
                title_label = QLabel(f"제목: {article.get('title', '')}")
                title_label.setWordWrap(True)
                article_layout.addWidget(title_label)

                # 기사 내용
                content_label = QLabel(f"내용: {article.get('desc', '')}")
                content_label.setWordWrap(True)
                article_layout.addWidget(content_label)

                # 기사 URL
                url_label = QLabel()
                url_label.setWordWrap(True)
                url_label.setOpenExternalLinks(True)
                url_label.setText(
                    f"URL: <a href='{article.get('url', '')}'>{article.get('url', '')}</a>")
                article_layout.addWidget(url_label)

                # 구분선 추가
                line = QFrame()
                line.setFrameShape(QFrame.Shape.HLine)
                line.setFrameShadow(QFrame.Shadow.Sunken)

                article_widget.setLayout(article_layout)
                articles_layout.addWidget(article_widget)
                articles_layout.addWidget(line)
        else:
            no_articles_label = QLabel("검색된 기사가 없습니다.")
            articles_layout.addWidget(no_articles_label)

        articles_group.setLayout(articles_layout)
        self.articles_scroll.setWidget(articles_group)

    def on_scraping_finished(self, result):
        try:
            data = json.loads(result)
            self.data = data
            self.start_button.setEnabled(True)
            self.progress_bar.setRange(0, 100)
            self.progress_bar.setValue(100)

            print("Loaded data:", data)  # 디버깅용 출력

            # 기존 이미지 위젯들 제거
            for i in reversed(range(self.images_grid.count())):
                self.images_grid.itemAt(i).widget().setParent(None)

            # 이미지 URL이 있다면 이미지 표시
            photo_urls = data.get("photo_urls", [])[:9]  # 최대 9개까지만 표시
            print("Photo URLs:", photo_urls)  # 디버깅용 출력

            if photo_urls:
                for idx, url in enumerate(photo_urls):
                    try:
                        print(f"Trying to load image from: {url}")
                        response = requests.get(url)
                        if not response.ok:
                            print(
                                f"Failed to fetch image: {response.status_code}")
                            continue

                        image_data = BytesIO(response.content)
                        pixmap = QPixmap()
                        if not pixmap.loadFromData(image_data.getvalue()):
                            print("Failed to create pixmap from image data")
                            continue

                        # 이미지 크기 조정
                        scaled_pixmap = pixmap.scaled(
                            QSize(200, 200),
                            Qt.AspectRatioMode.KeepAspectRatio,
                            Qt.TransformationMode.SmoothTransformation
                        )

                        # 이미지 라벨 생성 및 추가
                        image_label = QLabel()
                        image_label.setPixmap(scaled_pixmap)
                        image_label.setFixedSize(200, 200)
                        image_label.setScaledContents(True)

                        # 그리드에 이미지 추가 (3x3 형태로)
                        row = idx // 3
                        col = idx % 3
                        self.images_grid.addWidget(image_label, row, col)

                        print(f"Successfully added image from {url}")
                    except Exception as e:
                        print(f"이미지 로딩 실패 ({url}): {str(e)}")

            # 기존 폼 데이터 채우기
            self.name_input.setText(data.get("name", ""))
            self.english_name_input.setText(data.get("english_name", ""))
            self.short_address_input.setText(data.get("short_address", ""))
            self.full_address_input.setText(data.get("full_address", ""))
            self.americano_price_input.setValue(
                data.get("americano_price", 0) or 0)

            scores = data.get("scores", {})
            score_mapping = {
                "콘센트": "outlet",
                "공간": "space",
                "소음": "noise",
                "음식": "food",
                "예쁨": "beauty",
                "와이파이": "wifi",
                "화장실 청결도": "toilet_cleanliness",
                "의자": "chair",
                "조명": "lighting"
            }

            for k, v in score_mapping.items():
                self.score_inputs[k].setValue(scores.get(v, 1))

            self.has_toilet_check.setChecked(scores.get("toilet", True))
            self.non_coffee_check.setChecked(
                data.get("has_non_coffee_menu", False))
            self.parking_info_input.setText(data.get("parking_info", ""))

            # 기사 섹션 업데이트
            searched_articles = data.get("searched_articles", [])
            self.update_articles_section(searched_articles)

        except Exception as e:
            QMessageBox.warning(self, "경고", f"데이터 로딩 중 오류 발생: {str(e)}")

    def on_scraping_error(self, error_message):
        QMessageBox.critical(self, "에러", f"스크래핑 중 오류가 발생했습니다: {error_message}")
        self.start_button.setEnabled(True)
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(0)

    def save_data(self):
        try:
            data = {
                "name": self.name_input.text(),
                "english_name": self.english_name_input.text(),
                "short_address": self.short_address_input.text(),
                "full_address": self.full_address_input.text(),
                "americano_price": self.americano_price_input.value(),
                "scores": {
                    "outlet": self.score_inputs["콘센트"].value(),
                    "space": self.score_inputs["공간"].value(),
                    "noise": self.score_inputs["소음"].value(),
                    "food": self.score_inputs["음식"].value(),
                    "beauty": self.score_inputs["예쁨"].value(),
                    "wifi": self.score_inputs["와이파이"].value(),
                    "toilet": self.has_toilet_check.isChecked(),
                    "toilet_cleanliness": self.score_inputs["화장실 청결도"].value(),
                    "chair": self.score_inputs["의자"].value(),
                    "lighting": self.score_inputs["조명"].value()
                },
                "has_non_coffee_menu": self.non_coffee_check.isChecked(),
                "parking_info": self.parking_info_input.toPlainText(),
                "searched_articles": self.data.get("searched_articles", []),
                "photo_urls": self.data.get("photo_urls", [])
            }

            # 파일로 저장
            file_name = f"cafe_data_{data['name']}.json"
            with open(file_name, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            QMessageBox.information(self, "알림", f"데이터가 {file_name}에 저장되었습니다.")

        except Exception as e:
            QMessageBox.critical(self, "에러", f"데이터 저장 중 오류 발생: {str(e)}")

    def load_test_data(self):

        test_data = {"name": "혹스턴", "english_name": None, "short_address": "서울 서대문구 연희동", "full_address": "서울 서대문구 연희로 91 2층", "dong_name": "연희동", "naver_map_url": "https://naver.me/55nbp7H0", "google_map_url": None, "americano_price": 4800, "minimum_charge": None, "minimum_time": None, "has_visited": False, "is_large_franchise": None, "scores": {"outlet": 4, "space": 1, "noise": 1, "food": 1, "beauty": 1, "wifi": 5, "toilet": True, "toilet_cleanliness": 4, "chair": 1, "lighting": 1}, "has_non_coffee_menu": False, "parking_info": "", "closed_days": None, "photo_urls": ["https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220305_193%2F1646410056605EO1Sn_JPEG%2F271467333_629520225025538_5041099427267513676_n_%25281%2529.jpg", "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220305_299%2F1646410098844IfsdH_JPEG%2F271261858_317893876974121_9181655345187820290_n_%25281%2529.jpg", "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220305_135%2F1646410142119EReOy_JPEG%2F271277252_1005554543651575_8181338434355940738_n_%25281%2529.jpg", "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fvideo-phinf.pstatic.net%2F20241211_219%2F1733927745454aMgC0_JPEG%2F2u89JV3bOx_03.jpg",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "https://pup-review-phinf.pstatic.net/MjAyNDEyMTVfMTYg/MDAxNzM0MjM5NzE1MDA4.CTLvgetz1VNwpNFu7JO-kouj7ugioY_kcKArzNv0oiQg.-cmjtJ2MdO9XsyaxZxsVGs1ILdpcQQA0HjmxpXPgzxgg.JPEG/7211D082-4A81-4196-84CA-A496F9F69A22.jpeg?type=w560_sharpen", "https://pup-review-phinf.pstatic.net/MjAyNDEyMTVfMjQ1/MDAxNzM0MjM5NzE0OTIx.MiX_UXFYCQUDAss-vx4O7Ub3eyl0m9_r_8BFjDVLPK4g.bUDk38uyJWlG41Jc21zoxQulOeucFXPQVEgHrNltVsog.JPEG/6C8F8689-1518-4460-991C-86E9F04E1F4E.jpeg?type=w560_sharpen", "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fphinf.pstatic.net%2Ftvcast%2F20240731_1%2FQ2hfo_17224080292852Svms_JPEG%2FPublishThumb_20240731_154020_270.jpg", "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDEyMTdfNjUg%2FMDAxNzM0NDMzNDMxMTU4.QdQThZWfnEvX_csCWGzV1L9-bhPztnP2sXI-dN3vKSIg.9Kc5HZz9AOAF1LDL-iiIlzCBUuza7-qtC2eMKyTaqEog.JPEG%2FIMG_2254.JPG", "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDEyMDNfMjky%2FMDAxNzMzMjI0Mzg2MjI1.o_hDSELxHgYMJwgxTCbVd35wTkX4XagCPsdf8Y5l_nMg.25ISv32pMdMtog-N81fM4RIpYgCzxCgzCgpXtTxv-Y4g.JPEG%2FIMG_3331.JPG", "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MTdfMTUx%2FMDAxNzIzODY1MTk2NTQy.BOLQ6cz9HliBg6j3qapEP6J1kW4wo7-KWLsFaQCtD9cg.L_uR1IEwVxMaF6bAnXMoyKSVPPz8xXK6seMXdCMU0xEg.JPEG%2FIMG_7404.jpg"], "regular_holiday": [], "business_hours": []}

        self.on_scraping_finished(json.dumps(test_data))

    def display_results(self, results):
        for idx, result in enumerate(results):
            # ... 기존 코드 ...

            # photo_urls 표시를 위한 레이블 추가
            if result.get('photo_urls'):
                photo_urls_label = QLabel("사진 URL:")
                photo_urls_text = QTextEdit()
                photo_urls_text.setPlainText('\n'.join(result['photo_urls']))
                photo_urls_text.setReadOnly(True)
                photo_urls_text.setMaximumHeight(60)

                layout.addWidget(photo_urls_label)
                layout.addWidget(photo_urls_text)

            # ... 기존 코드 ...
