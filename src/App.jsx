import React, { useState } from 'react';
import "./App.css";
import Navbar from './components/Navbar';
import { MdOutlineArrowUpward } from "react-icons/md";
import { ImNewTab, ImMobile2 } from "react-icons/im";
import { IoMdDownload, IoMdClose } from "react-icons/io";
import { BiSolidShow } from "react-icons/bi";
import { FaEyeSlash } from "react-icons/fa";
import Editor from '@monaco-editor/react';
import { RiComputerLine } from "react-icons/ri";
import { FaTabletAlt } from "react-icons/fa";
import { GoogleGenAI } from "@google/genai";
import { API_KEY } from './helper';
import { toast } from 'react-toastify';
import { FadeLoader } from 'react-spinners';

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [isShowCode, setIsShowCode] = useState(false);
  const [isInNewTab, setIsInNewTab] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-[10px]">
  <h1 class="text-[30px] font-[700]">Welcome to WebBuilder</h1>
</body>
</html>
`);

  const [theme, setTheme] = useState("dark");
  const [device, setDevice] = useState("desktop");

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const downloadCode = () => {
    const filename = "webBuilderCode.html";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  async function getResponse() {
    if (!prompt) {
      toast.error("Please enter a prompt!");
      return;
    }

    setLoading(true);

    const text_prompt = `You are an expert frontend developer and UI/UX designer. Generate a fully working website as a single HTML file. Use Tailwind CSS through CDN only.

Strict:
- Return only one code block.
- No explanation.

User prompt: ${prompt}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: text_prompt,
      });
      setCode(extractCode(response.text));
    } catch (err) {
      toast.error("Failed to generate website. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className={theme === "dark" ? "dark-mode" : "light-mode"}>
      <Navbar />

      <div className="container">
        <h3 className='text-[30px] font-[700]'>
          Create beautiful websites with <span className='bg-gradient-to-br from-violet-400  to-purple-600 bg-clip-text text-transparent'>CodeGenie</span>
        </h3>
        <p className='mt-2 text-[16px] text-[#b3b3b3]'>Describe your website and AI will code for you.</p>

        <div className="inputBox">
          <textarea
            placeholder="Describe your website in detail."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          {prompt && (
            <i
              onClick={getResponse}
              className='sendIcon text-[20px] w-[30px] h-[30px] flex items-center justify-center bg-[#9933ff] rounded-[50%] transition-all duration-300 hover:opacity-[.8]'
            >
              <MdOutlineArrowUpward />
            </i>
          )}
        </div>

        <p className='text-[20px] font-[700] mt-[10vh]'>Your AI-Generated Website will appear here.</p>

        <div className="preview">
          <div className="header w-full h-[70px] flex justify-between items-center">
            <h3 className='font-bold text-[16px]'>Live Preview</h3>
            <div className="icons flex items-center gap-[15px]">

              <div onClick={() => setIsInNewTab(true)} className="icon !w-[auto] !p-[12px] flex items-center gap-[10px] cursor-pointer">Open in new tab <ImNewTab /></div>
              <div onClick={downloadCode} className="icon !w-[auto] !p-[12px] flex items-center gap-[10px] cursor-pointer">Download <IoMdDownload /></div>
              <div onClick={() => setIsShowCode(!isShowCode)} className="icon !w-[auto] !p-[12px] flex items-center gap-[10px] cursor-pointer">
                {isShowCode ? "Hide Code" : "Show Code"} {isShowCode ? <FaEyeSlash /> : <BiSolidShow />}
              </div>

              {/* Dark/Light Theme Toggle */}
              <div
                className="icon !w-[auto] !p-[12px] flex items-center gap-[10px] relative group cursor-pointer"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? "🌞" : "🌙"}
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[12px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Mode: {theme === "dark" ? "Light" : "Dark"}
                </span>
              </div>

            </div>
          </div>

          {isShowCode ? (
            <Editor
              height="500px"
              theme={theme === "dark" ? "vs-dark" : "light"}
              defaultLanguage="html"
              value={code}
              onChange={(newCode) => setCode(newCode)}
            />
          ) : loading ? (
            <div className='w-full h-full flex items-center justify-center flex-col'>
              <FadeLoader color='#9933ff' />
              <h3 className='text-[23px] mt-4 font-semibold'>
                <span className='bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent'>Generating</span> your website...
              </h3>
            </div>
          ) : (
            <iframe
              srcDoc={code}
              className='w-full bg-[white] h-[500px]'
              style={{
                backgroundColor: theme === "dark" ? "#121212" : "#ffffff",
              }}
            ></iframe>
          )}
        </div>
      </div>

      {isInNewTab && (
        <div className="modelCon">
          <div className="modelBox text-black">

            <div className="header w-full px-[50px] h-[70px] flex items-center justify-between">
              <h3 className='font-[700]'>Preview</h3>

              <div className="icons flex items-center gap-[15px]">
                <div onClick={() => setDevice("desktop")} className={`icon cursor-pointer ${device === "desktop" ? "font-bold text-[#9933ff]" : ""}`}>
                  <RiComputerLine />
                </div>

                <div onClick={() => setDevice("tablet")} className={`icon cursor-pointer ${device === "tablet" ? "font-bold text-[#9933ff]" : ""}`}>
                  <FaTabletAlt />
                </div>

                <div onClick={() => setDevice("mobile")} className={`icon cursor-pointer ${device === "mobile" ? "font-bold text-[#9933ff]" : ""}`}>
                  <ImMobile2 />
                </div>
              </div>

              <div className="icons">
                <div className="icon cursor-pointer" onClick={() => setIsInNewTab(false)}>
                  <IoMdClose />
                </div>
              </div>

            </div>

            <iframe
              srcDoc={code}
              className="w-full newTabIframe"
              style={{
                width: device === "desktop" ? "100%" : device === "tablet" ? "768px" : "375px",
                height: "600px",
                border: "1px solid #ccc",
                backgroundColor: theme === "dark" ? "#121212" : "#ffffff",
              }}
            />

          </div>
        </div>
      )}
    </div>
  );
};

export default App;