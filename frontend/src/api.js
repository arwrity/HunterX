export const API_BASE = "http://127.0.0.1:8080";

export async function generateImage(prompt) {
  const res = await fetch(`${API_BASE}/generate_image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}

export async function generateVideo(imageUrl, prompt) {
  const res = await fetch(`${API_BASE}/generate_video_minimax`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl, prompt }),
  });
  return res.json();
}

export async function generateStory(prompt) {
  const res = await fetch(`${API_BASE}/generate_story`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}
