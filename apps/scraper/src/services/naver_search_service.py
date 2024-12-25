from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from typing import Dict, Optional, List
from ..types.cafe_data import CafeData
from time import sleep
from urllib.parse import quote


class NaverSearchService:
    def __init__(self, driver: WebDriver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)

    def scrap_blog(self, keyword: str) -> List[str]:
        url = f"https://search.naver.com/search.naver?ssc=tab.blog.all&sm=tab_jum&query={quote(keyword.replace(' ', '+'))}"

        self.driver.get(url)

        sleep(1)

        list_ele = self.driver.find_element(
            By.CSS_SELECTOR, 'div.api_subject_bx')

        child_eles = list_ele.find_elements(By.CSS_SELECTOR, 'a.dsc_link')

        res = []
        for ele in child_eles:
            res.append(ele.text)

        return res
