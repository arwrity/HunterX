"use client";
import { useState } from "react";
import { generateImage, generateVideo, generateStory } from "../api";

export default function Home() {
  const [mode, setMode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState(null); 

  
  const applyStyle = (text, styleMode) => {
    if (!styleMode) return text;
    
    switch (styleMode) {
      case "creative":
        return `highly stylized neon vaporwave art of ${text}, vibrant colors, glowing lights, surreal composition`;
      case "realistic":
        return `ultra realistic 8K DSLR photo of ${text}, professional lighting, shallow depth of field`;
      case "anime":
        return `beautiful anime illustration of ${text}, Studio Ghibli style, soft shading, vivid colors`;
      case "cyberpunk":
        return `cyberpunk futuristic ${text}, neon lights, rainy streets of Tokyo, dystopian atmosphere, sci-fi details`;
      default:
        return text;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return alert("Write the description!");
    setLoading(true);
    setResultUrl("");

    try {
      let finalPrompt = prompt;
      
    
      if (mode === "text2img" || mode === "text2video") {
        finalPrompt = applyStyle(prompt, style);
      }

      if (mode === "text2img") {
        const data = await generateImage(finalPrompt);
        setResultUrl(data.image_url);
      } else if (mode === "text2video") {
        const data = await generateStory(finalPrompt);
        setResultUrl(data.video_url);
      } else if (mode === "img2video") {
        const image = uploadedImage || imageUrl;
        if (!image) {
          alert("Upload the URL");
          setLoading(false);
          return;
        }
        const data = await generateVideo(image, prompt);
        setResultUrl(data.video_url);
      }
    } catch (err) {
      alert("ERROR" + err.message);
    }

    setLoading(false);
  };


  const handleDownload = async () => {
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const fileName =
        mode === "text2img"
          ? "generated_image.png"
          : mode === "text2video"
          ? "generated_video.mp4"
          : "animated_video.mp4";

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      alert("ERROR " + error.message);
    }
  };

  // Функция для копирования ссылки
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(resultUrl);
      alert("Ссылка скопирована в буфер обмена!");
    } catch (err) {
      alert("Не удалось скопировать ссылку: " + err.message);
    }
  };

  
  const handleSetMode = (newMode) => {
    setMode(newMode);
    setPrompt("");
    setResultUrl("");
    setStyle(null); 
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-mono relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(0,255,100,0.15),_transparent_60%)]"></div>
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-fuchsia-600 blur-[160px] opacity-40 animate-pulse pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-green-400 blur-[160px] opacity-40 animate-pulse pointer-events-none"></div>

      
      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,0,255,0.7)] animate-pulse">
        HunterX AI
      </h1>

      
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleSetMode("text2img")}
          className={`py-2 px-5 rounded-xl font-semibold transition-all duration-300 ${
            mode === "text2img"
              ? "bg-green-500 text-black shadow-[0_0_20px_#00ff99]"
              : "bg-gray-800 text-gray-400 hover:shadow-[0_0_10px_#00ff99]"
          }`}
        >
          Text → Image
        </button>

        <button
          onClick={() => handleSetMode("text2video")}
          className={`py-2 px-5 rounded-xl font-semibold transition-all duration-300 ${
            mode === "text2video"
              ? "bg-purple-600 text-white shadow-[0_0_20px_#bb00ff]"
              : "bg-gray-800 text-gray-400 hover:shadow-[0_0_10px_#bb00ff]"
          }`}
        >
          Text → Video
        </button>

        <button
          onClick={() => handleSetMode("img2video")}
          className={`py-2 px-5 rounded-xl font-semibold transition-all duration-300 ${
            mode === "img2video"
              ? "bg-lime-500 text-black shadow-[0_0_20px_#00ff99]"
              : "bg-gray-800 text-gray-400 hover:shadow-[0_0_10px_#00ff99]"
          }`}
        >
          Image → Video
        </button>
      </div>

      
      {(mode === "text2img" || mode === "text2video") && (
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="flex gap-3">
            {[
              { id: "creative", label: " Creative" },
              { id: "realistic", label: "Realistic" },
              { id: "anime", label: "Anime" },
              { id: "cyberpunk", label: " Cyberpunk" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setStyle(opt.id)}
                className={`py-2 px-4 rounded-lg border transition-all duration-300 ${
                  style === opt.id
                    ? "bg-fuchsia-600 text-white border-fuchsia-400 scale-105"
                    : "bg-[#111] text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            {style ? `Style is chosen: ${style}` : "Style is not chosen"}
          </p>
        </div>
      )}

      
      {mode && (
        <div className="relative w-[400px] mb-6">
          <input
            className="w-full bg-[#0a0a15] border border-fuchsia-600 text-center text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500 shadow-[0_0_20px_rgba(128,0,255,0.5)]"
            placeholder={
              mode === "img2video" 
                ? "Describe an object" 
                : "Describe an object"
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      )}

      
      {mode === "img2video" && (
        <div className="flex flex-col items-center gap-4 mb-6 w-[400px]">
          <input
            className="bg-[#0a0a15] border border-green-500 text-center text-white py-2 px-3 rounded-xl w-full placeholder-gray-500"
            placeholder="Paste the URL of the image"
            value={imageUrl}
            onChange={(e) => {
              setUploadedImage("");
              setImageUrl(e.target.value);
            }}
          />



          {uploadedImage && (
            <div className="mt-3">
              <img
                src={uploadedImage}
                alt="Preview"
                className="rounded-xl border border-fuchsia-600 shadow-[0_0_20px_#bb00ff] w-[300px]"
              />
            </div>
          )}
        </div>
      )}

      
      {mode && (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="relative overflow-hidden py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-green-400 to-fuchsia-600 hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_#00ff99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating ..." : " Generate"}
        </button>
      )}

      
      {!loading && resultUrl && (
        <div className="flex flex-col items-center mt-8 gap-4">
          {mode === "text2img" && (
            <img
              src={resultUrl}
              alt="Generated"
              className="rounded-2xl border-2 border-fuchsia-600 shadow-[0_0_40px_#bb00ff] w-[480px]"
            />
          )}
          {(mode === "text2video" || mode === "img2video") && (
            <video
              src={resultUrl}
              controls
              autoPlay
              loop
              className="rounded-2xl border-2 border-green-400 shadow-[0_0_40px_#00ff99] w-[480px]"
            />
          )} 
              
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDownload}
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-green-400 to-fuchsia-500 text-black font-semibold hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_#00ff99]"
            >
              Download
            </button>
            <button
              onClick={handleCopyLink}
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-green-400 text-black font-semibold hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_#bb00ff]"
            >
              Copy URL
            </button>
          </div> 
        </div>
      )} 
      

      <footer className="mt-12 text-sm text-gray-500">
        Powered by <span className="text-green-400">Higgsfield API</span> 
      </footer>
    </main>
  );
}
