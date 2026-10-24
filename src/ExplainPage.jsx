
import { useState } from "react";

export default function ExplainPage() {
  const [text, setText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const explainText = async () => {
    if (!text.trim()) {
      setExplanation("Please enter a word or sentence first.");
      return;
    }

    setLoading(true);
    setExplanation("");

    try {
      const response = await fetch("http://localhost:5000/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Explanation failed.");
      }

      setExplanation(data.explanation || "No explanation returned.");
    } catch (error) {
      setExplanation(error.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText("");
    setExplanation("");
  };

  const copyExplanation = async () => {
    if (!explanation) return;

    try {
      await navigator.clipboard.writeText(explanation);
    } catch {
      setExplanation((current) => current + "\n\nCopy failed. Please select and copy the text manually.");
    }
  };

  return (
    <main className="page-container">
      <section className="content-card explain-tool">
        <span className="feature-icon">💡</span>
        <h1>AI Text Explanation</h1>
        <p>
          Understand English words and sentences with simple English
          meanings, Marathi explanations, and examples.
        </p>

        <label htmlFor="explain-input">Enter an English word or sentence</label>
        <textarea
          id="explain-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Example: Practice makes a person perfect."
          rows={5}
        />

        <div className="explain-actions">
          <button
            className="primary-link explain-button"
            onClick={explainText}
            disabled={loading}
          >
            {loading ? "Generating explanation..." : "✨ Explain Text"}
          </button>

          <button className="secondary-button" onClick={clearAll}>
            Clear
          </button>
        </div>

        {loading && <p role="status">Please wait while AI prepares your explanation...</p>}

        {explanation && (
          <section className="explanation-result" aria-live="polite">
            <h2>Explanation Result</h2>
            <p>{explanation}</p>
            <button className="secondary-button" onClick={copyExplanation}>
              📋 Copy Explanation
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
