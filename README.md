# FraudGuard

> AI 기반 사기 탐지 어시스턴트 — 의심스러운 메시지, 전화번호, 링크, 파일을 실시간으로 분석하여 스캠을 식별합니다.

**2025 글로벌 스타트업 디자인 씽킹 해커톤** 출품작입니다.

---

## 주요 기능

FraudGuard는 사용자가 사기 및 스캠을 탐지할 수 있도록 돕는 인터랙티브 웹 애플리케이션입니다. 의심스러운 콘텐츠를 붙여넣거나 업로드하면 즉시 AI 분석 결과를 받아볼 수 있습니다.

**지원하는 분석 유형:**

| 유형 | 설명 |
|------|------|
| 의미론적 분석 | 텍스트 및 스크린샷에서 사회공학적 패턴과 위험 의도 탐지 |
| 전화번호 조회 | 스캐머 번호 신고 내역, 증거, 신고 빈도 데이터 검색 |
| 계좌번호 검증 | 사기 계좌 데이터베이스와 대조하여 검증 |
| 피싱 링크 탐지 | 악성 URL, 가짜 웹사이트, 자격증명 탈취 사이트 탐지 |
| 악성코드 파일 스캐너 | 업로드된 파일(APK 등)에서 악성코드 및 트로이 목마 탐지 |
| 기업용 API | 제품 연동을 위한 안정적인 속도 제한 API 엔드포인트 제공 |

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| 프론트엔드 | React 19, Vite 7 |
| 스타일링 | Tailwind CSS v4 |
| AI / 자동화 | N8N 워크플로우 (웹훅 기반) |
| 호스팅 | Firebase Hosting |
| 메시징 | WhatsApp Business API |

---

## 프로젝트 구조

```
FraudGuard/
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # 랜딩 페이지 — 네비바, 기능 소개, 가격, 푸터
│   │   ├── Hero.jsx         # 사기 분석 핵심 채팅 인터페이스
│   │   ├── main.jsx         # React 진입점
│   │   └── lib/
│   │       └── n8nClient.js # N8N API 헬퍼
│   ├── public/
│   ├── dist/                # 프로덕션 빌드 결과물
│   ├── .env                 # N8N 웹훅 URL 환경변수
│   └── package.json
├── firebase.json            # Firebase 호스팅 설정
└── .firebaserc
```

---

## 시작하기

### 사전 요구사항

- Node.js v16 이상
- npm

### 설치

```bash
# 저장소 클론
git clone https://github.com/soobinH/FraudGuard.git
cd FraudGuard/frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

앱은 `http://localhost:5173` 에서 실행됩니다.

### 환경 변수

`frontend/` 폴더 안에 `.env` 파일을 생성하세요:

```env
VITE_N8N_WEBHOOK_URL=<N8N 텍스트 웹훅 URL>
VITE_N8N_IMAGE_WEBHOOK_URL=<N8N 이미지 웹훅 URL>
VITE_WA_PHONE=<국가코드 포함 WhatsApp 번호>
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# Firebase 배포
firebase deploy
```

---

## 동작 원리

1. 사용자가 분석 유형을 선택하거나 예시 프롬프트를 사용합니다.
2. 메시지를 입력하거나 이미지/파일을 업로드합니다.
3. 프론트엔드가 N8N 웹훅으로 요청을 전송합니다.
   - 텍스트 입력 → `GET /webhook?chatinput=...`
   - 이미지/파일 → `POST /webhook` (`multipart/form-data`)
4. N8N이 AI 워크플로우를 통해 입력을 처리하고 분석 결과를 반환합니다.
5. 결과가 채팅 인터페이스에 표시됩니다.

---

## 팀

- **황수빈** — 풀스택 개발 (전체 코드 담당)
- **인도네시아**, **태국** 팀원들과 협업

---

## 라이선스

이 프로젝트는 교육 및 시연 목적으로 해커톤에 제출된 작품입니다.