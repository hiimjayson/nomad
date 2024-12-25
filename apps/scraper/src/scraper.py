import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from dotenv import load_dotenv
from .services.naver_map_service import NaverMapService
from .services.google_map_service import GoogleMapService
from .services.openai_service import OpenAIService
from .types.cafe_data import CafeData
from .services.naver_search_service import NaverSearchService


class CafeScraper:
    def __init__(self):
        load_dotenv()

        # Selenium 설정
        service = Service(ChromeDriverManager().install())

        options = webdriver.ChromeOptions()
        options.add_argument(
            'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3')
        options.add_argument('window-size=1380,900')

        self.driver = webdriver.Chrome(service=service, options=options)

        # 서비스 초기화
        self.naver_service = NaverMapService(self.driver)
        self.google_service = GoogleMapService(self.driver)
        self.openai_service = OpenAIService(os.getenv('OPENAI_API_KEY'))
        self.naver_search_service = NaverSearchService(self.driver)

    def scrape(self, naver_map_url: str) -> CafeData:
        # 1. 네이버 지도 정보 수집
        basic_info = self.naver_service.scrape_basic_info(naver_map_url)

        print(basic_info)

        # 2. 구글 지도 링크 찾기
        google_map_urls = self.google_service.find_google_map_url(
            basic_info.name,
            basic_info.full_address
        )

        print(google_map_urls)

        # 3. 네이버 검색 결과로 OpenAI 평가
        keyword = f"{basic_info.dong_name} {basic_info.name} 콘센트"
        naver_search_results = self.naver_search_service.scrap_blog(keyword)
        outlet_score = self.openai_service.evaluate_outlet_score(
            naver_search_results)

        keyword = f"{basic_info.dong_name} {basic_info.name} 화장실"
        naver_search_results = self.naver_search_service.scrap_blog(keyword)
        toilet_score = self.openai_service.evaluate_toilet_cleanliness(
            naver_search_results)

        # 결과 통합
        basic_info.scores.outlet = outlet_score
        basic_info.scores.toilet_cleanliness = toilet_score

        return basic_info

    def __del__(self):
        self.driver.quit()
