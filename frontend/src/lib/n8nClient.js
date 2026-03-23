export const N8N_TEXT_URL =
  import.meta.env.VITE_N8N_WEBHOOK_URL ||
  "https://n8n.vtriadi.site/webhook/b2a306fa-3a35-4c34-8009-1ee5b4130761";

export const N8N_IMAGE_URL =
  import.meta.env.VITE_N8N_IMAGE_WEBHOOK_URL ||
  "https://n8n.vtriadi.site/webhook/b4cba643-d1b2-46dd-a467-e08b19eb0b5e";

async function parseResponse(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}${txt ? ` • ${txt}` : ""}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await res.json().catch(() => ({}));
    if (typeof data?.reply === "string" && data.reply.trim()) return data.reply;
    if (typeof data?.output === "string" && data.output.trim()) return data.output;
    return JSON.stringify(data, null, 2);
  }
  return res.text();
}

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
