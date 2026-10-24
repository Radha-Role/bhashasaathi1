function ActionButtons({ readAloud, translateText, explainText }) {
  return (
    <div className="buttons">
      <button onClick={readAloud}>🔊 Read Aloud</button>

      <button onClick={translateText}>🌐 Translate</button>

      <button onClick={explainText}>💡 Explain</button>
    </div>
  );
}

export default ActionButtons;