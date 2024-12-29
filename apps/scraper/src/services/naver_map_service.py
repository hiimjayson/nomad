from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from typing import Dict, Optional, List
from time import sleep
import re
from src.types.cafe_data import CafeData

iframe_selector = '//*[@id="entryIframe"]'

name_selector = '//*[@id="_title"]/div/span[1]'
address_selector = "//*[@id='app-root']/div/div/div/div[5]/div/div[2]/div[1]/div/div[1]/div/a/span[1]"


class NaverMapService:
    def __init__(self, driver: WebDriver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)

    def scrape_basic_info(self, url: str) -> CafeData:
        self.driver.get(url)

        sleep(2)

        iframe = self.driver.find_element(By.XPATH, iframe_selector)
        self.driver.switch_to.frame(iframe)

        # 기본 정보 추출
        name = self.wait.until(
            EC.presence_of_element_located(
                (By.XPATH, name_selector))
        ).text

        address = self.extract_address()

        business_hours = self.extract_business_hours()

        americano_price = self.extract_americano_price()
        photos = self.extract_photos()

        return CafeData(
            name=name,
            full_address=address['full_address'],
            short_address=address['short_address'],
            dong_name=self.dong_name,
            naver_map_url=url,
            americano_price=americano_price,
            business_hours=business_hours,
            regular_holiday=self.regular_holiday,
            photo_urls=photos
        )

    def extract_address(self) -> str:
        address_element = self.wait.until(
            EC.presence_of_element_located(
                (By.XPATH, address_selector))
        )

        full_address = address_element.text
        address_element.click()
        sleep(0.1)

        jibun_address = self.driver.find_element(
            By.XPATH, '//*[@id="app-root"]/div/div/div/div[5]/div/div[2]/div[1]/div/div[1]/div/div[1]/div[2]').text
        self.dong_name = jibun_address.strip().replace('지번', '').split(' ')[0]

        short_address = f"{full_address.split(' ')[0]} {full_address.split(' ')[1]} {self.dong_name}"

        return {
            'full_address': full_address,
            'short_address': short_address
        }

    def extract_business_hours(self) -> Dict[str, str]:
        raw_business_hours = []

        try:
            self.driver.find_element(
                By.XPATH, '//*[@id="app-root"]/div/div/div/div[5]/div/div[2]/div[1]/div/div[3]/div/a/div[1]/div/div/span/time').click()

            print('영업시간 더보기 버튼 클릭')

            # 영업 시간 더보기 버튼을 누르고 2초 반영시간 기다림
            sleep(0.1)

            parent_element = self.driver.find_element(
                By.XPATH, '//*[@id="app-root"]/div/div/div/div[5]/div/div[2]/div[1]/div/div[3]/div/a')
            child_elements = parent_element.find_elements(
                By.XPATH, '//*[@id="app-root"]/div/div/div/div[5]/div/div[2]/div[1]/div/div[3]/div/a/div/div/span')

            for child in child_elements:
                raw_business_hours.append(child.text)

            return self._parse_business_hours(raw_business_hours)
        except Exception as e:
            print('영업시간 추출 실패', e)
            return []

    def _click_tab_button(self, tab_name: str):
        self.driver.find_element(
            By.XPATH, f'//a[contains(@class,"_tab-menu")]/span[contains(text(),"{tab_name}")]'
        ).click()

    def extract_americano_price(self) -> Optional[int]:
        self._click_tab_button("메뉴")

        sleep(1)

        menus = []

        try:
            list_ele = self.driver.find_element(
                By.XPATH, '//div[@data-nclicks-area-code="bmv"]/div[contains(@class,"place_section")]/div[contains(@class,"place_section_content")]/ul')

            child_eles = list_ele.find_elements(
                By.XPATH, "li/a")

            for child in child_eles:
                title_ele = child.find_element(
                    By.XPATH, 'div[contains(@class,"MXkFw")]/div/div/span')
                price_ele = child.find_element(
                    By.XPATH, 'div[contains(@class,"MXkFw")]/div[contains(@class, "GXS1X")]')

                price_text = re.sub(r'[^0-9]', '', price_ele.text)

                if price_text == '':
                    continue

                menus.append({
                    'title': title_ele.text,
                    # remove all non-numeric characters and convert to int
                    'price': int(price_text)
                })

            print('hi', list_ele, child_eles)
            print(menus)

            # menus중에 '아메리카노' 또는 'americano'가 있으면 가격을 반환
            for menu in menus:
                if menu['title'] and menu['title'].strip().lower() in ['아메리카노', 'americano']:
                    return menu['price']

            return None
        except Exception as e:
            print(e)
            return None

    def extract_photos(self) -> List[str]:
        self._click_tab_button("사진")

        sleep(4)

        photo_urls = []

        try:
            photo_elements = self.driver.find_element(
                By.XPATH, '//div[contains(@class,"place_section_content")]/div[contains(@class,"Nd2nM")]').find_elements(By.TAG_NAME, "img")

            for elem in photo_elements:
                src = elem.get_attribute("src")

                if src is None:
                    continue

                if src.endswith(".gif"):
                    continue

                photo_urls.append(src)

            return photo_urls[:10]
        except Exception as e:
            print(e)
            return []

    def _parse_business_hours(self, raw_business_hours: List[str]) -> List[str]:
        # 영업시간 텍스트 파싱 로직 구현
        business_hours = []
        self.regular_holiday = []

        for raw_business_hour in raw_business_hours:
            splitted = raw_business_hour.split('\n')

            if len(splitted) < 2:
                continue

            yoil = splitted[0]
            time_range = splitted[1]

            # time_range에 '정기휴무'가 포함 되어있으면, '(${})' 형태로 정기휴무 날짜를 추출
            if '정기휴무' in time_range:
                self.regular_holiday.append(
                    time_range.split('(')[1].split(')')[0])

            if not is_yoil_label(yoil):
                continue

            business_hours.append({
                'yoil': get_yoil_value(yoil),
                'time_range': time_range
            })

        business_hours.sort(key=lambda x: x['yoil'])

        return business_hours


yoil_labels = ['월', '화', '수', '목', '금', '토', '일', '매일']
yoil_values = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN', 'ALL']


def is_yoil_label(yoil: str) -> bool:
    return yoil in yoil_labels


def get_yoil_value(yoil: str) -> int:
    index = yoil_labels.index(yoil)

    return yoil_values[index]
