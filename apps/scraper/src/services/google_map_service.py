from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import quote
from time import sleep


class GoogleMapService:
    def __init__(self, driver: WebDriver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)

    def find_google_map_url(self, name: str, address: str) -> str:
        search_query = f"{name} {address}"
        url = f"https://www.google.com/maps/search/{quote(search_query)}"

        self.driver.get(url)

        sleep(2)

        if self.driver.current_url.startswith("https://www.google.com/maps/search/"):
            feed_ele = self.driver.find_element(
                By.XPATH, '//div[@role="feed"]'
            )

            card_ele = feed_ele.find_elements(By.TAG_NAME, 'a')

            res = []

            for ele in card_ele:
                url = ele.get_attribute('href')

                if not url.startswith("https://www.google.com/maps/place"):
                    continue

                res.append({
                    "url": ele.get_attribute('href'),
                    "name": ele.get_attribute("aria-label").replace('·방문한 링크', '')
                })

            return res
        else:
            name = self.driver.find_element(
                By.XPATH, '//div[@role="main"]'
            ).get_attribute("aria-label")

            return [{
                "url": self.driver.current_url,
                "name": name
            }]
