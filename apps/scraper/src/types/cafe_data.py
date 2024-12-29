from typing import Optional, List, Dict
from pydantic import BaseModel


class SearchedArticle(BaseModel):
    title: str
    desc: str
    url: str


class CafeScores(BaseModel):
    outlet: int = 1
    space: int = 1
    noise: int = 1
    food: int = 1
    beauty: int = 1
    wifi: int = 5
    toilet: bool = True
    toilet_cleanliness: int = 1
    chair: int = 1
    lighting: int = 1


class BusinessHour(BaseModel):
    yoil: str
    time_range: str


class CafeData(BaseModel):
    name: str
    english_name: Optional[str] = None
    short_address: str
    full_address: str
    dong_name: str
    naver_map_url: str
    google_map_url: Optional[str] = None
    americano_price: Optional[int] = None
    minimum_charge: Optional[int] = None
    minimum_time: Optional[int] = None
    has_visited: bool = False
    is_large_franchise: Optional[bool] = None
    scores: CafeScores = CafeScores()
    has_non_coffee_menu: bool = False
    parking_info: str = ""
    closed_days: Optional[str] = None

    photo_urls: List[str] = []

    regular_holiday: List[str] = []
    business_hours: List[BusinessHour] = []

    searched_articles: List[SearchedArticle] = []
