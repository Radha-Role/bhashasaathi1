
import { useState } from "react";
import "./style.css";

import Header from "./Header.jsx";
import TextInput from "./TextInput.jsx";
import ActionButtons from "./ActionButtons.jsx";

function App() {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [language, setLanguage] = useState("Marathi");
  const [backendMessage, setBackendMessage] = useState("");
  const [speed, setSpeed] = useState(0.9);

  // Read text aloud
 

const readAloud = () => {
  const textToRead = translation || text;

  if (!textToRead.trim()) {
    alert("Please enter some text first.");
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(textToRead);

  // Read the translated result in its selected language.
  // If there is no result yet, read the original English text.
  speech.lang = translation
    ? language === "Marathi"
      ? "mr-IN"
      : "hi-IN"
    : "en-US";

  speech.rate = Number(speed);

  window.speechSynthesis.speak(speech);
};




const pauseReading = () => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
};

const resumeReading = () => {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
};

const stopReading = () => {
  window.speechSynthesis.cancel();
};


  // Translate English text using backend API
  const translateText = async () => {
    if (!text.trim()) {
      alert("Please enter some text first.");
      return;
    }

    try {
      setTranslation("Translating...");

      const response = await fetch(
        "http://localhost:5000/api/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            language: language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Translation failed.");
      }

      setTranslation(data.translation);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslation(
        "Translation failed. Please check your backend and internet connection."
      );
    }
  };

  // Explain text in simple English (demo responses)
  

const explainText = async () => {
  if (!text.trim()) {
    setTranslation("Please enter a word or sentence.");
    return;
  }

  setTranslation("Preparing explanation...");

  try {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const response = await fetch(
        "http://localhost:5000/api/explain",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
         body: JSON.stringify({
           text: text,
           language: language,
           sourceLanguage: "English",
          }),
          signal: controller.signal,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Explanation failed.");
      }

      setTranslation(data.explanation);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("Explanation error:", error);

    setTranslation(
      error.name === "AbortError"
        ? "The AI service is taking too long. Please try again."
        : error.message || "Unable to generate explanation."
    );
  }
};



  // Copy translated text
  
    const copyTranslation = async () => {
  const textToCopy = translation;

  if (!textToCopy) {
    alert("Nothing to copy!");
    return;
  }

  try {
    await navigator.clipboard.writeText(textToCopy);
    alert("Copied successfully! Now paste using Ctrl + V.");
  } catch (error) {
    console.error("Copy error:", error);
    alert("Copy failed. Please allow clipboard access.");
  }
};
  // Clear input and result
  const clearText = () => {
    setText("");
    setTranslation("");
  };


  // Test backend connection
  const testBackend = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/test");

      if (!response.ok) {
        throw new Error("Backend request failed.");
      }

      const data = await response.json();
      setBackendMessage(data.message);
    } catch (error) {
      console.error("Backend error:", error);
      setBackendMessage(
        "Backend not connected. Please start the backend server."
      );
    }
  };

  return (
    <div className="app">
      <Header />

      <TextInput text={text} setText={setText} />

      <div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="Marathi">मराठी</option>
          <option value="Hindi">हिंदी</option>
        </select>
      </div>

      <ActionButtons
        readAloud={readAloud}
        translateText={translateText}
        explainText={explainText}
       />
       
  <div className="extra-buttons">
    <button onClick={copyTranslation}>
      📋 Copy Translation
    </button>

    <button onClick={clearText}>
      🗑️ Clear Text
    </button>
  </div>

<div className="speech-controls">
  <h3>🔊 Reading Controls</h3>

  <label htmlFor="speech-speed">
    Reading Speed: {Number(speed).toFixed(1)}x
  </label>

  <input
    id="speech-speed"
    type="range"
    min="0.5"
    max="2"
    step="0.1"
    value={speed}
    onChange={(e) => setSpeed(e.target.value)}
  />

  <div className="speech-buttons">
    <button onClick={pauseReading}>⏸ Pause</button>
    <button onClick={resumeReading}>▶ Resume</button>
    <button onClick={stopReading}>⏹ Stop</button>
  </div>
</div>
 
      

      {translation && (
        <div className="translation">
          <h3>Result:</h3>
          <p>{translation}</p>
        </div>
      )}

      <div className="translation">
        <h3>Backend Connection</h3>
        <button onClick={testBackend}>🔗 Test Backend</button>
        {backendMessage && <p>{backendMessage}</p>}
      </div>
    </div>
  );
}

export default App;