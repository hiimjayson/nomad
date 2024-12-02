# Nomad 프롬프트

프로젝트 제작에 사용된 프롬프트들입니다.

기획은 GPT를, 이외 작업은 Cursor를 사용했습니다.

## 기획

> ChatGPT 4o 사용

티키타카한 내용은 포함하지 않았습니다.<br/>
원치않는 기능을 포함했거나 답변을 요구하는 경우 적절히 지시해주셔야합니다.

1. [PRD 작성](./0_planning/0_prd.md)
2. [스크린 구상 및 IA 작성](./0_planning/1_ia.md)

## 개발

> Cursor with Claude 3.5 sonnet 사용

플러터/VercelFunctions 스캐폴딩은 수동으로 진행했습니다.<br/>
티키타카한 내용도 모두 포함했습니다. (근데 거의 티키타카하지 않았습니다.)

1. [플러터 - 시작화면 구현](./1_development/0_flutter_add_initial_screen.md)
2. [VercelFunctions - 인증번호발송/검증 API 구현](./1_development/1_vercel_add_auth_apis.md)
3. [플러터 - 인증번호발송/검증 API 연결](./1_development/2_attach_auth_apis.md)
4. [Express로 백엔드 스택 수정](./1_development/3_switch_to_express.md)
5. [플러터 - 인증화면 디자인 개선](./1_development/4_update_phone_auth_screen_design.md)
