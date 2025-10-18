export const API_BASE = "https://hunterx-1u94.onrender.com";

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


