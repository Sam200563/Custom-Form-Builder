import { useEffect, useState } from "react";
import ImageUpload from "../Image/ImageUpload";

export default function ComprehensionQuestion({ question, onUpdate }) {
  const [paragraph, setParagraph] = useState(question.paragraph || "");
  const [imageUrl, setImageUrl] = useState(question.imageUrl || "");
  const [subQuestions, setSubQuestions] = useState(question.subQuestions || []);

  useEffect(() => {
    onUpdate(question.id, { type: "comprehension", paragraph, imageUrl, subQuestions });
  }, [paragraph, imageUrl, subQuestions]);

  const addSubQuestion = () => {
    const qText = prompt("Enter question text:");
    const ans = prompt("Enter answer:");
    if (qText && ans) {
      setSubQuestions((prev) => [...prev, { question: qText, answer: ans }]);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        className="border p-2 w-full"
        rows="4"
        placeholder="Enter paragraph..."
        value={paragraph}
        onChange={(e) => setParagraph(e.target.value)}
      />

      <label className="block font-medium mt-2">Upload Image (optional)</label>
      <ImageUpload onUpload={(url) => setImageUrl(url)} />
      {imageUrl && <img src={`http://localhost:5000${imageUrl}`} alt="Question" className="w-40 h-auto mt-2" />}

      <div>
        <strong>Sub-questions:</strong>
        <ul className="list-disc ml-6">
          {subQuestions.map((q, i) => (
            <li key={i}>
              <strong>{q.question}</strong> — {q.answer}
            </li>
          ))}
        </ul>
        <button onClick={addSubQuestion} className="mt-2 text-sm text-purple-600">
          + Add Sub-question
        </button>
      </div>
    </div>
  );
}
