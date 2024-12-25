from openai import OpenAI
from typing import List


class OpenAIService:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    def _evaluate_score(self, prompt: str, data: List[str]) -> int:
        content = prompt + "\n\n" + "\n".join(data)

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[{"role": "user", "content": content}]
        )

        return int(response.choices[0].message.content)

    def evaluate_outlet_score(self, search_results: List[str]) -> int:
        prompt = "다음은 카페의 콘센트 관련 검색 결과입니다. 콘센트 이용 편의성을 평가해주세요. 1이상 5이하의 숫자만 응답하세요:"

        return self._evaluate_score(prompt, search_results)

    def evaluate_toilet_cleanliness(self, search_results: str) -> int:
        prompt = "다음은 카페의 화장실 관련 검색 결과입니다. 화장실 청결도를 평가해주세요. 1이상 5이하의 숫자만 응답하세요:"

        return self._evaluate_score(prompt, search_results)
