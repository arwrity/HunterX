"use client";
import { useState } from "react";
import { generateImage, generateVideo, generateStory } from "../api";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = async () => {
    setLoading(true);
    const data = await generateImage(prompt);
    setImageUrl(data.image_url);
    setLoading(false);
  };

  const handleVideo = async () => {
    if (!imageUrl) return alert("Сначала сгенерируй изображение!");
    setLoading(true);
    const data = await generateVideo(imageUrl, prompt);
    setVideoUrl(data.video_url);
    setLoading(false);
  };

  const handleStory = async () => {
    setLoading(true);
    const data = await generateStory(prompt);
    setVideoUrl(data.video_url);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-mono relative overflow-hidden">
      {/* === НЕОНОВЫЙ ФОН === */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,100,0.15),_transparent_60%)]"></div>
       <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-fuchsia-600 blur-[160px] opacity-40 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-green-400 blur-[160px] opacity-40 animate-pulse"></div>
       
      {/* === ЗАГОЛОВОК === */}
      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,0,255,0.7)] animate-pulse">
        HunterX AI 
      </h1>

      {/* === INPUT === */}
      <div className="relative w-[400px] mb-6">
        <input
          className="w-full bg-[#0a0a15]  border border-fuchsia-600 text-left text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500 shadow-[0_0_20px_rgba(128,0,255,0.5)]"
          placeholder=" Describe an object"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="absolute inset-0 rounded-xl border border-transparent animate-[neonGlow_2s_linear_infinite] pointer-events-none" />
      </div>

      {/* === КНОПКИ === */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleImage}
          className="relative overflow-hidden py-2 px-5 rounded-xl font-semibold text-black bg-gradient-to-r from-green-400 to-lime-600 hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_#00ff99]"
        >
          <span className="relative z-10">Generate an Image</span>
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,255,100,0.6)_90deg,transparent_180deg)] animate-[rotate_3s_linear_infinite]"></div>
        </button>

        <button
          onClick={handleVideo}
          className="relative overflow-hidden py-2 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-purple-700 hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_#bb00ff]"
        >
          <span className="relative z-10"> Animate an Image</span>
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,0,255,0.4)_90deg,transparent_180deg)] animate-[rotate_3s_linear_infinite]"></div>
        </button>

        <button
          onClick={handleStory}
          className="relative overflow-hidden py-2 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-green-300 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_#a0ffb0]"
        >
          <span className="relative z-10"> Generate a Story</span>
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(150,255,255,0.5)_90deg,transparent_180deg)] animate-[rotate_3s_linear_infinite]"></div>
        </button>
      </div>

      {/* === СТАТУС И РЕЗУЛЬТАТ === */}
      {loading && <p className="text-gray-400 animate-pulse text-lg"> Generating ...</p>}

      {imageUrl && (
        <div className="mt-8 flex flex-col items-center">
          <img src={imageUrl} alt="Generated" className="rounded-2xl shadow-[0_0_40px_#7d00ff] border-2 border-fuchsia-700 w-[480px] animate-[fadeIn_1s_ease-in]" />
           <a href={imageUrl} download="hunterx_image.png" className="mt-4 inline-block bg-gradient-to-r from-fuchsia-500 to-green-400 text-black font-semibold py-2 px-6 rounded-xl hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_#bb00ff]">
      Download Image
    </a>
        </div>
      )}

      {videoUrl && (
        <div className="mt-8 flex flex-col items-center">
          <video src={videoUrl} controls autoPlay loop className="rounded-2xl border-2 border-green-400 shadow-[0_0_40px_#00ff99] w-[480px] animate-[fadeIn_1s_ease-in]" />
          <a
  href={videoUrl}
  download="hunterx_video.mp4"
  className="mt-4 inline-block bg-gradient-to-r from-green-400 to-purple-600 text-black font-semibold py-2 px-6 rounded-xl hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_#00ff99]"
>
  Download Video
</a>

        </div>
      )}

      <footer className="mt-12 text-sm text-gray-500 z-10">
         Powered by <span className="text-green-400">Higgsfield API</span>
      </footer>

      {/* === АНИМАЦИИ === */}
      <style jsx global>{`
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes neonGlow {
          0%, 100% { box-shadow: 0 0 10px #00ff99, 0 0 20px #bb00ff, 0 0 40px #00ff99; }
          50% { box-shadow: 0 0 20px #bb00ff, 0 0 40px #00ff99, 0 0 80px #bb00ff; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
}
