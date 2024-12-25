from src.scraper import CafeScraper
import json


def test_scrape_cafe():
    scraper = CafeScraper()
    result = scraper.scrape("https://naver.me/55nbp7H0")

    print(result)

    # create json file. result is pydantic model
    with open("result.json", "w") as f:
        f.write(result.model_dump_json())

    print('completed ✨')


if __name__ == "__main__":
    test_scrape_cafe()
