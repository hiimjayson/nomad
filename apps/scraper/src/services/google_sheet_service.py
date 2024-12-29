from google.oauth2 import service_account
from googleapiclient.discovery import build
import os


class GoogleSheetService:
    def __init__(self):
        self.email = os.getenv('GOOGLE_SERVICE_ACCOUNT_EMAIL')
        self.private_key = os.getenv('GOOGLE_PRIVATE_KEY').replace('\\n', '\n')
        self.sheet_id = os.getenv('GOOGLE_SHEET_ID')

        credentials = service_account.Credentials.from_service_account_info({
            "type": "service_account",
            "project_id": "cafe-scraper",
            "private_key": self.private_key,
            "client_email": self.email,
            "token_uri": "https://oauth2.googleapis.com/token",
        })

        self.service = build('sheets', 'v4', credentials=credentials)

    def save_cafe_data(self, data):
        """카페 데이터를 구글 시트에 저장"""
        sheet = self.service.spreadsheets()

        # 데이터 포맷팅
        row_data = [
            "",  # 빈칸
            data.get("name", ""),
            data.get("english_name", ""),
            data.get("short_address", ""),
            data.get("full_address", ""),
            "카페",  # 분류
            data.get("naver_map_url", ""),
            data.get("google_map_url", ""),
            str(data.get("americano_price", "")),
            "",  # 최소입장시간
            "",  # 가봤는가
            "",  # 대형프차인가
            "",  # 빈칸
            str(data.get("scores", {}).get("outlet", "")),  # 콘센트
            str(data.get("scores", {}).get("space", "")),  # 공간
            str(data.get("scores", {}).get("noise", "")),  # 소음
            str(data.get("scores", {}).get("food", "")),  # 음식
            str(data.get("scores", {}).get("beauty", "")),  # 뷰
            str(data.get("scores", {}).get("wifi", "")),  # 와이파이
            "Y" if data.get("scores", {}).get("toilet", False) else "N",  # 화장실
            str(data.get("scores", {}).get("toilet_cleanliness", "")),  # 화장실 청결도
            str(data.get("scores", {}).get("chair", "")),  # 의자
            str(data.get("scores", {}).get("lighting", "")),  # 조명
            "Y" if data.get("has_non_coffee_menu",
                            False) else "N",  # 카페 메뉴 존재 여부
            data.get("parking_info", ""),  # 주차 정보
            data.get("notes", ""),  # 비고
            data.get("closed_days", ""),  # 비고
        ]

        # 새로운 행 추가
        result = sheet.values().append(
            spreadsheetId=self.sheet_id,
            range='A1',
            valueInputOption='RAW',
            insertDataOption='INSERT_ROWS',
            body={'values': [row_data]}
        ).execute()

        return result


def parse_opening_hours_data(self, data):
    """영업시간 데이터를 파싱"""
    return data.get("opening_hours", "")
