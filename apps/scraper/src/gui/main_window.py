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
import os
from src.services.google_sheet_service import GoogleSheetService


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

        # 오앙 영역 (데이터 편집 UI)
        center_widget = QWidget()
        center_layout = QVBoxLayout(center_widget)

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
        center_layout.addWidget(basic_group)

        # 점수 그룹
        scores_group = self.create_score_group()
        center_layout.addWidget(scores_group)

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

        # 휴무일 입력칸 추가
        self.closed_days_input = QLineEdit()
        extra_layout.addRow("휴무일:", self.closed_days_input)

        # 비고 입력칸 추가
        self.notes_input = QTextEdit()
        self.notes_input.setMaximumHeight(60)
        extra_layout.addRow("비고:", self.notes_input)

        extra_group.setLayout(extra_layout)
        center_layout.addWidget(extra_group)

        # 저장 버튼들을 위한 수평 레이아웃
        save_buttons_layout = QHBoxLayout()

        # 기존 저장 버튼
        self.save_button = QPushButton("데이터 저장")
        self.save_button.clicked.connect(self.save_data)
        save_buttons_layout.addWidget(self.save_button)

        # 구글 시트 저장 버튼 추가
        self.sheet_save_button = QPushButton("구글시트 저장")
        self.sheet_save_button.clicked.connect(self.save_to_google_sheet)
        save_buttons_layout.addWidget(self.sheet_save_button)

        center_layout.addLayout(save_buttons_layout)

        # 우측 영역 (기사 표시 UI)
        right_widget = QWidget()
        right_layout = QVBoxLayout(right_widget)

        # 기사를 표시할 스크롤 영역
        self.articles_scroll = QScrollArea()
        self.articles_scroll.setWidgetResizable(True)
        right_layout.addWidget(self.articles_scroll)

        # 분할 레이아웃에 위젯 추가 (1:1:1 비율)
        split_layout.addWidget(left_widget, 1)
        split_layout.addWidget(center_widget, 1)
        split_layout.addWidget(right_widget, 1)
        layout.addLayout(split_layout)

        # 우측 영역 최소 너비 설정
        right_widget.setMinimumWidth(400)

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
        articles_layout.setSpacing(15)
        articles_layout.setContentsMargins(10, 10, 10, 10)

        if searched_articles:
            for article in searched_articles:
                article_frame = QFrame()
                article_frame.setFrameStyle(
                    QFrame.Shape.Box | QFrame.Shadow.Raised)
                article_frame.setStyleSheet("""
                    QFrame {
                        background-color: white;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    }
                """)

                article_layout = QVBoxLayout(article_frame)
                article_layout.setSpacing(8)
                article_layout.setContentsMargins(15, 15, 15, 15)

                # 기사 제목
                title_label = QLabel(f"<b>{article.get('title', '')}</b>")
                title_label.setStyleSheet("""
                    QLabel {
                        font-size: 14px;
                        color: #2c3e50;
                    }
                """)
                title_label.setWordWrap(True)
                article_layout.addWidget(title_label)

                # 기사 내용 - 키워드 강조 처리
                content = article.get('desc', '')
                keywords = ['콘센트', '화장실']
                for keyword in keywords:
                    content = content.replace(keyword, f'<b>{keyword}</b>')

                content_label = QLabel(content)
                content_label.setStyleSheet("""
                    QLabel {
                        color: #34495e;
                        padding: 8px 0px;
                        font-size: 12px;
                    }
                """)
                content_label.setWordWrap(True)
                article_layout.addWidget(content_label)

                # 기사 URL
                url_label = QLabel()
                url_label.setOpenExternalLinks(True)
                url_label.setText(
                    f"<a href='{article.get('url', '')}'>{article.get('url', '')}</a>")
                url_label.setStyleSheet("""
                    QLabel {
                        color: #3498db;
                        font-size: 11px;
                    }
                """)
                article_layout.addWidget(url_label)

                articles_layout.addWidget(article_frame)
        else:
            no_articles_label = QLabel("검색된 기사가 없습니다.")
            no_articles_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
            no_articles_label.setStyleSheet("""
                QLabel {
                    color: #7f8c8d;
                    font-size: 14px;
                    padding: 20px;
                }
            """)
            articles_layout.addWidget(no_articles_label)

        articles_group.setLayout(articles_layout)
        articles_group.setStyleSheet("""
            QGroupBox {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                margin-top: 10px;
            }
            QGroupBox::title {
                color: #495057;
                font-size: 14px;
                font-weight: bold;
            }
        """)
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
            self.closed_days_input.setText(data.get("closed_days", ""))
            self.notes_input.setText(data.get("notes", ""))

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
                "dong_name": self.data.get("dong_name", ""),
                "short_address": self.short_address_input.text(),
                "full_address": self.full_address_input.text(),
                "naver_map_url": self.data.get("naver_map_url", ""),
                "google_map_url": self.data.get("google_map_url", ""),
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
                "closed_days": self.closed_days_input.text(),
                "notes": self.notes_input.toPlainText(),
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
        try:
            example_data_path = os.path.join(
                os.path.dirname(__file__), 'example_data.json')
            with open(example_data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.on_scraping_finished(json.dumps(data))
        except Exception as e:
            QMessageBox.critical(
                self, "에러", f"테스트 데이터를 불러오는데 실패했습니다: {str(e)}")

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

    def create_score_group(self):
        score_group = QGroupBox("평가점수")
        layout = QGridLayout()

        # 평가 항목 정의
        self.score_inputs = {}  # 클래스 멤버로 저장
        labels = [
            "콘센트", "공간", "소음", "음식",
            "예쁨", "와이파이", "화장실 청결도", "의자",
            "조명"
        ]

        for i, label in enumerate(labels):
            row = i // 2  # 행 위치 계산
            col = i % 2   # 열 위치 계산

            label_widget = QLabel(f"{label}:")
            spin_box = QSpinBox()
            spin_box.setRange(1, 5)
            spin_box.setValue(3)

            # 각 행의 첫 번째 열에는 라벨을, 두 번째 열에는 스핀박스를 배치
            layout.addWidget(label_widget, row, col * 2)
            layout.addWidget(spin_box, row, col * 2 + 1)

            # score_inputs 딕셔너리에 저장
            self.score_inputs[label] = spin_box

        score_group.setLayout(layout)
        return score_group

    def save_to_google_sheet(self):
        """구글 시트에 데이터 저장"""
        try:
            # 현재 폼의 데이터 수집
            data = {
                "name": self.name_input.text(),
                "english_name": self.english_name_input.text(),
                "short_address": self.short_address_input.text(),
                "full_address": self.full_address_input.text(),
                "naver_map_url": self.data.get("naver_map_url", ""),
                "google_map_url": self.data.get("google_map_url", ""),
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
                "closed_days": self.closed_days_input.text(),
                "notes": self.notes_input.toPlainText(),
            }

            # 구글 시트에 저장
            sheet_service = GoogleSheetService()
            sheet_service.save_cafe_data(data)

            QMessageBox.information(self, "성공", "데이터가 구글 시트에 저장되었습니다.")

        except Exception as e:
            QMessageBox.critical(self, "에러", f"구글 시트 저장 중 오류 발생: {str(e)}")
