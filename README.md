# FraudGuard 🛡️

> 🏆 **2025 글로벌 창업 디자인씽킹 해커톤 대상 (전체 1위)** — 중앙대학교 주관
> 한국·인도네시아·태국 다국적 팀, 풀스택 개발 전담

**AI 기반 스캠 탐지 챗봇** — 의심스러운 메시지, 전화번호, 링크, 이미지를 실시간으로 분석하여 사기 여부와 수법을 알려줍니다.

🔗 **라이브 데모**: [chatbot-94634.web.app](https://chatbot-94634.web.app) _(현재 AI 백엔드 비활성화 상태)_

---

## 주요 기능

| 분석 유형 | 설명 |
|---|---|
| 시맨틱 분석 | 텍스트·스크린샷에서 사회공학적 패턴과 위험 의도 탐지 |
| 전화번호 조회 | 스캐머 번호 신고 내역 및 빈도 데이터 검색 |
| 계좌번호 검증 | 사기 계좌 데이터베이스와 대조 검증 |
| 피싱 링크 탐지 | 악성 URL·가짜 웹사이트·자격증명 탈취 사이트 탐지 |
| 이미지 분석 | 캡처 이미지를 업로드하면 멀티모달 AI가 분석 |

---

## 기술 스택

| 레이어 | 기술 |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS v4 |
| AI / 자동화 | N8N 워크플로우 (Gemini Fine-tuning + 웹훅) |
| 호스팅 | Firebase Hosting |
| 부가 채널 | WhatsApp Business API |

---

## 아키텍처

```
사용자 입력
   │
   ├── 텍스트 → GET /webhook?chatinput=...  ──┐
   │                                          ├──▶ N8N 워크플로우
   └── 이미지 → POST /webhook (multipart)  ──┘       │
                                                  Gemini (Fine-tuned)
                                                      │
                                               분석 결과 반환
                                                      │
                                             채팅 인터페이스 렌더링
```

텍스트와 이미지를 **다른 엔드포인트와 전송 방식으로 분리**하여 N8N 파이프라인의 안정성을 확보했습니다.

---

## 트러블슈팅

### LLM 응답 지연(Latency) UX 처리
- **문제**: Gemini 응답이 최대 30초 소요되어 사용자가 앱이 멈춘 것으로 오해하는 UX 문제 발생
- **해결**: 메시지 전송 즉시 typing indicator(바운스 애니메이션 3점)를 표시하고, 응답 완료 시 해당 버블을 실제 내용으로 교체하는 Symbol 기반 메시지 ID 패턴 구현
- **결과**: 대기 시간이 길어도 자연스러운 챗봇 경험 유지

```js
// typing 버블을 Symbol ID로 추적 → 응답 도착 시 교체
const typingId = Symbol("typing");
setMessages(prev => [...prev, { role: "assistant", typing: true, id: typingId }]);

const out = await analyzeText(text);
setMessages(prev =>
  prev.map(m => m.id === typingId ? { role: "assistant", content: out } : m)
);
```

### 멀티모달 전송 규격화
- **문제**: 텍스트/이미지를 동일 엔드포인트로 전송 시 N8N 파이프라인에서 파싱 오류 발생
- **해결**: 텍스트는 `GET` + query string, 이미지는 `POST` + `multipart/form-data`로 전송 방식을 분리하여 `n8nClient.js`에 캡슐화
- **결과**: 안정적인 멀티모달 입력 파이프라인 구축

```js
// n8nClient.js — 전송 방식 분리
export async function analyzeText(message) {
  const url = `${N8N_TEXT_URL}?${new URLSearchParams({ chatinput: message })}`;
  const res = await fetch(url, { method: "GET" });
  return parseResponse(res);
}

export async function analyzeImage(imageFile) {
  const fd = new FormData();
  fd.append("image", imageFile, imageFile.name);
  const res = await fetch(N8N_IMAGE_URL, { method: "POST", body: fd, mode: "cors" });
  return parseResponse(res);
}
```

### Object URL 메모리 누수 방지
- **문제**: 이미지 미리보기 생성 시 `URL.createObjectURL()`로 만든 URL이 해제되지 않아 메모리 누수 발생 가능
- **해결**: `useEffect` cleanup 함수로 미리보기 URL을 즉시 해제하고, `useRef`로 채팅 버블에 사용된 URL 목록을 추적하여 컴포넌트 언마운트 시 일괄 해제
- **결과**: 장시간 사용 시에도 메모리 누수 없는 안정적인 이미지 처리

```js
// 미리보기 URL: effect cleanup으로 자동 해제
useEffect(() => {
  if (!file) { setPreviewURL(""); return; }
  const url = URL.createObjectURL(file);
  setPreviewURL(url);
  return () => URL.revokeObjectURL(url);
}, [file]);

// 채팅 버블 URL: ref로 추적 → 언마운트 시 일괄 해제
useEffect(() => {
  return () => createdUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
}, []);
```

---

## 로컬 실행

```bash
# 저장소 클론
git clone https://github.com/soobinH/FraudGuard.git
cd FraudGuard/frontend

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일에 N8N 웹훅 URL 입력

# 개발 서버 실행
npm run dev
# → http://localhost:5173
```

### 환경변수

```
VITE_N8N_WEBHOOK_URL=<N8N 텍스트 웹훅 URL>
VITE_N8N_IMAGE_WEBHOOK_URL=<N8N 이미지 웹훅 URL>
VITE_WA_PHONE=<국가코드 포함 WhatsApp 번호>
```

---

## 팀

| 역할 | 이름 |
|---|---|
| 풀스택 개발 (전체 코드 담당), PM | 황수빈 (Korea) |
| 기획·비즈니스 모델 | 팀원 (Indonesia) |
| 기획·디자인·비즈니스 모델 | 팀원 (Thailand) |
| 기획·디자인 | 팀원 (Korea) |

> 영어로 소통하며 4일간 기획부터 배포까지 완성

---

## 라이선스

해커톤 출품 및 포트폴리오 목적 프로젝트입니다.
