import pytest
from src.scraper import CafeScraper


def test_scrape_cafe():
    scraper = CafeScraper()
    result = scraper.scrape("https://naver.me/55nbp7H0")

    assert result.name
    assert result.full_address
    assert result.short_address
    assert result.naver_map_url
