function TextInput({ text, setText }) {
  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Enter or paste English text here..."
    />
  );
}

export default TextInput;