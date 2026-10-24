import ExplainPage from "./ExplainPage";
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import "./style.css";
import TranslatorPage from "./TranslatorPage";

function Home() {
  return (
    <main className="page-container home-page">
      <section className="hero">
        <span className="eyebrow">YOUR LANGUAGE COMPANION</span>
        <h1>Welcome to <span>BhashaSaathi</span></h1>
        <p>
          Break language barriers, understand new words, and improve
          your English with the help of your language companion.
        </p>
        <Link className="primary-link" to="/translator">
          Start Translating →
        </Link>
      </section>

      <h2>Explore BhashaSaathi</h2>
      <div className="feature-grid">
        <Link to="/translator" className="feature-card">
          <span className="feature-icon">🌐</span>
          <h3>Language Translator</h3>
          <p>Translate text into Marathi and Hindi.</p>
          <span>Open Translator →</span>
        </Link>

        <Link to="/explain" className="feature-card">
          <span className="feature-icon">💡</span>
          <h3>AI Explain</h3>
          <p>Understand English words and sentences easily.</p>
          <span>Explore Explanation →</span>
        </Link>

        <Link to="/learn" className="feature-card">
          <span className="feature-icon">📚</span>
          <h3>Learn English</h3>
          <p>Practice vocabulary and simple English sentences.</p>
          <span>Start Learning →</span>
        </Link>

        <Link to="/about" className="feature-card">
          <span className="feature-icon">💜</span>
          <h3>About Us</h3>
          <p>Learn about the BhashaSaathi project.</p>
          <span>Know More →</span>
        </Link>
      </div>
    </main>
  );
}

<Route path="/explain" element={<ExplainPage />} />

function LearnPage() {
  const lessons = [
    {
      word: "Learn",
      meaning: "शिकणे",
      example: "I learn English every day.",
    },
    {
      word: "Speak",
      meaning: "बोलणे",
      example: "I speak English with my friends.",
    },
    {
      word: "Understand",
      meaning: "समजणे",
      example: "I understand this sentence.",
    },
    {
      word: "Practice",
      meaning: "सराव करणे",
      example: "I practice English daily.",
    },
  ];

  return (
    <main className="page-container">
      <section className="content-card">
        <h1>Learn English 📚</h1>
        <p>Learn useful words with Marathi meanings and examples.</p>
        <div className="lesson-list">
          {lessons.map((lesson) => (
            <article className="lesson-card" key={lesson.word}>
              <h3>{lesson.word}</h3>
              <p>Meaning: {lesson.meaning}</p>
              <p>{lesson.example}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="page-container">
      <section className="content-card">
        <h1>About BhashaSaathi 💜</h1>
        <p>
          BhashaSaathi is a language learning and translation
          assistant designed to help users understand English
          through Marathi and Hindi.
        </p>
        <h3>Our Features</h3>
        <ul>
          <li>English-to-Marathi and English-to-Hindi translation</li>
          <li>AI-powered text explanation when the AI service is available</li>
          <li>Read aloud, pause, resume, and stop speech</li>
          <li>Copy and clear text</li>
          <li>Beginner-friendly English vocabulary practice</li>
        </ul>
      </section>
    </main>
  );
}

function NotFound() {
  return (
    <main className="page-container">
      <section className="content-card">
        <h1>Page not found</h1>
        <Link to="/">Return Home</Link>
      </section>
    </main>
  );
}

function Layout() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">💜 BhashaSaathi</Link>
        <nav className="site-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/translator">Translator</NavLink>
          <NavLink to="/explain">AI Explain</NavLink>
          <NavLink to="/learn">Learn English</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/translator" element={<TranslatorPage />} />
        <Route path="/explain" element={<ExplainPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} BhashaSaathi · Learn, understand, communicate.</p>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
