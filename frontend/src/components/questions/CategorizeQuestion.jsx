import { useState, useEffect } from "react";
import ImageUpload from "../../components/Image/ImageUpload"; 

export default function CategorizeQuestion({ question, onUpdate }) {
  const [questionText, setQuestionText] = useState(question.questionText || "");
  const [imageUrl, setImageUrl] = useState(question.imageUrl || "");
  const [options, setOptions] = useState(question.options || []);
  const [categories, setCategories] = useState(question.categories || []);

  useEffect(() => {
    onUpdate(question.id, { type: "categorize", questionText, imageUrl, options, categories });
  }, [questionText, imageUrl, options, categories]);

  const addOption = () => {
    const option = prompt("Enter an option");
    if (option) setOptions((prev) => [...prev, option]);
  };

  const addCategory = () => {
    const category = prompt("Enter a category");
    if (category) setCategories((prev) => [...prev, category]);
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Question Text"
        className="border p-2 w-full"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />

      <label className="block font-medium mt-2">Upload Image (optional)</label>
      <ImageUpload onUploadComplete={(url) => setImageUrl(url)} />
      {imageUrl && <img src={`http://localhost:5000${imageUrl}`} alt="Question" className="w-40 h-auto mt-2" />}

      <div>
        <strong>Options:</strong>{" "}
        {options.map((opt, i) => (
          <span key={i} className="inline-block bg-gray-200 px-2 py-1 rounded mr-1">
            {opt}
          </span>
        ))}
        <button onClick={addOption} className="ml-2 text-blue-500 text-sm">
          + Add Option
        </button>
      </div>

      <div>
        <strong>Categories:</strong>{" "}
        {categories.map((cat, i) => (
          <span key={i} className="inline-block bg-green-200 px-2 py-1 rounded mr-1">
            {cat}
          </span>
        ))}
        <button onClick={addCategory} className="ml-2 text-green-500 text-sm">
          + Add Category
        </button>
      </div>
    </div>
  );
}
