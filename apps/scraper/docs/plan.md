# 스크래퍼 구현 계획

## 1. 프로젝트 구조

src/
├── types/ # 타입 정의
├── services/ # 핵심 서비스 로직
│ ├── naver/ # 네이버 관련 서비스
│ ├── google/ # 구글 관련 서비스
│ └── openai/ # OpenAI 관련 서비스
├── utils/ # 유틸리티 함수
└── index.ts # 메인 진입점

## 2. 핵심 클래스 및 인터페이스

### 2.1 데이터 타입

```typescript
interface CafeData {
  name: string;
  englishName?: string;
  shortAddress: string;
  fullAddress: string;
  naverMapUrl: string;
  googleMapUrl?: string;
  americanoPrice?: number;
  minimumCharge?: number;
  minimumTime?: number;
  hasVisited: boolean;
  isLargeFranchise?: boolean;
  scores: {
    outlet: number;
    space: number;
    noise: number;
    food: number;
    beauty: number;
    wifi: number;
    toilet: boolean;
    toiletCleanliness: number;
    chair: number;
    lighting: number;
  };
  hasNonCoffeeMenu: boolean;
  parkingInfo: string;
  closedDays?: string;
  businessHours: {
    [key: string]: string;
  };
}
```

## 3. 구현 단계

### 3.1 네이버 지도 크롤링 (NaverMapService)

- Playwright를 사용하여 네이버 지도 페이지 접근
- 기본 정보 추출 (이름, 주소, 영업시간 등)
- 메뉴 정보 추출 (아메리카노 가격)
- 사진 10장 추출

### 3.2 구글 지도 크롤링 (GoogleMapService)

- 네이버에서 얻은 이름과 주소로 구글 지도 검색
- 일치하는 장소 찾아서 링크 추출

### 3.3 네이버 검색 및 GPT 평가 (NaverSearchService, OpenAIService)

- 네이버 검색 수행
  - "(카페이름) 콘센트"
  - "(카페이름) 화장실"
  - "(카페이름) 주차"
  - "(카페이름) 메뉴" (논커피 메뉴 확인용)
- 검색 결과를 OpenAI API로 전송하여 평가

### 3.4 이미지 평가

추출된 사진을 통해 사용자가 직접 평가하는 항목:

- 넓은 자리 점수
- 소음 정도 점수
- 예쁨 점수
- 편한 의자 점수
- 조도 점수

## 4. 구현 우선순위

1. 네이버 지도 크롤링 구현
2. 구글 지도 링크 추출 구현
3. 네이버 검색 및 GPT 평가 구현
4. 데이터 통합 및 출력 구현

## 5. 에러 처리

- 크롤링 실패 시 재시도 로직
- 데이터 누락 시 기본값 처리
- API 호출 실패 시 대체 로직

## 6. 성능 최적화

- 병렬 처리 가능한 작업 식별 및 구현
- 캐싱 전략 수립
- API 호출 최소화

## 7. 테스트 계획

### 7.1 단위 테스트

- 각 서비스 클래스의 메소드 테스트
- 데이터 파싱 로직 테스트
- 유틸리티 함수 테스트

### 7.2 통합 테스트

- 전체 크롤링 프로세스 테스트
- 에러 처리 테스트
- 실제 데이터로 E2E 테스트

## 8. 모니터링 및 로깅

- 크롤링 성공/실패 로그
- API 호출 로그
- 성능 메트릭 수집
