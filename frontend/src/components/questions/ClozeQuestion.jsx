import { useEffect, useState } from "react";
import ImageUpload from "../../components/Image/ImageUpload"; 

export default function ClozeQuestion({ question, onUpdate }) {
  const [questionText, setQuestionText] = useState(question.questionText || "");
  const [imageUrl, setImageUrl] = useState(question.imageUrl || "");
  const [blanks, setBlanks] = useState(question.blanks || []);
  const [answers, setAnswers] = useState(question.answers || []);
  const [selectedWord, setSelectedWord] = useState("");

  useEffect(() => {
    onUpdate(question.id, { questionText, imageUrl, blanks, answers });
  }, [questionText, imageUrl, blanks, answers]);

  const handleSelection = () => {
    const selection = window.getSelection();
    const word = selection.toString().trim();
    if (word && questionText.includes(word)) {
      setSelectedWord(word);
    }
  };

  const underlineAndBlank = () => {
    if (!selectedWord) return;

    const blankTag = `____`;

    const updatedText = questionText.replace(
      selectedWord,
      blankTag
    );

    setQuestionText(updatedText);
    setBlanks([...blanks, selectedWord]); // Store the actual word
    setAnswers([...answers, selectedWord]);
    setSelectedWord("");
    window.getSelection().removeAllRanges();
  };

  const updateAnswer = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">Cloze Sentence</label>
      <textarea
        className="border p-2 w-full"
        rows="4"
        placeholder="Type your sentence here..."
        value={questionText}
        onMouseUp={handleSelection}
        onChange={(e) => {
          setQuestionText(e.target.value);
          // Optional: re-extract blanks if manually edited
        }}
      />

      {selectedWord && (
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={underlineAndBlank}
        >
          Underline & Add to Blank
        </button>
      )}

      <label className="block font-medium mt-4">Upload Image (optional)</label>
      <ImageUpload onUpload={(url) => setImageUrl(url)} />
      {imageUrl && <img src={`http://localhost:5000${imageUrl}`} alt="Question" className="w-40 h-auto mt-2" />}

      {blanks.length > 0 && (
        <div>
          <strong>Answers for blanks:</strong>
          {blanks.map((blank, idx) => (
            <div key={idx} className="mb-1">
              <label className="block text-sm">{blank}</label>
              <input
                type="text"
                className="border p-1 w-full"
                value={answers[idx]}
                onChange={(e) => updateAnswer(idx, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
