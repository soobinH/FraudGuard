// n8nClient.js
export const N8N_ENDPOINT =
  import.meta.env.VITE_N8N_WEBHOOK_URL ||
  // ← 환경변수로 바꾸면 빌드/배포가 편해요
  "https://n8n.vtriadi.site/webhook/b2a306fa-3a35-4c34-8009-1ee5b4130761";

// form-data로 chatinput 하나만 보냄 (POST)
export async function analyzeWithN8N(message, { signal } = {}) {
  const fd = new FormData();
  fd.append("chatinput", message);

  const res = await fetch(N8N_ENDPOINT, {
    method: "POST",
    body: fd,
    signal,
    // 헤더를 명시하지 않음: FormData가 boundary 포함해서 자동 설정됨
  });

  // n8n이 application/json이면 json, 아니면 text로 대비
  const text = await res.text();
  const data = safeJson(text);

  if (!res.ok) {
    throw new Error(
      `n8n ${res.status}: ${data?.error || text || "Unknown error"}`
    );
  }
  return data ?? { output: text };
}

function safeJson(t) {
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}
