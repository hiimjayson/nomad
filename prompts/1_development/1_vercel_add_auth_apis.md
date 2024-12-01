apps/backend에 인증번호발송 API 구현해줘. 인증번호는 6자리 숫자고 3분동안 유효할거야.

- SMS발송: @https://github.com/greatSumini/sens 의 라이브러리 사용해서 구현
- 발송된 인증번호 캐싱: Upstash 이용
  시크릿 정보는 .env 파일을 생성한 후 저장해

---

아래 기준에 따라 리팩터링해줘
/api: presentation layer 로직 작성
/features: 도메인별 business 로직 및 데이터베이스 접근 작성
/features/auth/auth.service.ts
/features/auth/auth.dto.ts: request 타입정보
/features/auth/types.ts: request와 무관한 타입정보
/features/auth/util.ts

---

이건 서버리스 백엔드라 AuthService를 클래스로 정의하면 자원낭비일거라 생각해.
각각의 function을 묶은 object로 수정해줘
