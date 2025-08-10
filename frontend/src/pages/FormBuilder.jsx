import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

import CategorizeQuestion from "../components/questions/CategorizeQuestion";
import ClozeQuestion from "../components/questions/ClozeQuestion";
import ComprehensionQuestion from "../components/questions/ComprehensionQuestion";
import ImageUpload from "../components/Image/ImageUpload";  

export default function FormBuilder() {
  const [title, setTitle] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const addQuestion = (type) => {
    const newQuestion = {
      id: uuidv4(),
      type,
      questionText: "",
      imageUrl: "",
      options: [],
      categories: [],
      paragraph: "",
      blanks: [],
      answers: [],
      subQuestions:[],
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const updateQuestion = (id, updated) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
    );
  };

  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSubmit = async () => {
    if (!title || questions.length === 0) {
      alert("Title and at least one question are required.");
      return;
    }

    try {
      const res = await API.post("/", {
        title,
        headerImage,
        questions:questions.map(q=>({
          ...q,
          imageUrl:q.imageUrl || ""
        }))
      });

      navigate(`/form/preview-edit/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save form.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">📝 Custom Form Builder</h1>

      <input
        type="text"
        className="border p-2 w-full mb-2"
        placeholder="Form Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="mb-4">
        <label className="block mb-1 font-medium">Header Image Upload</label>
        <ImageUpload onUpload={(url) => setHeaderImage(url)} />
        {headerImage && (
          <img src={`http://localhost:5000${headerImage}`} alt="Header" className="mb-4 rounded max-h-48 object-contain" />
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => addQuestion("categorize")}
        >
          + Categorize
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => addQuestion("cloze")}
        >
          + Cloze
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={() => addQuestion("comprehension")}
        >
          + Comprehension
        </button>
      </div>

      {questions.map((q, index) => (
        <div key={q.id} className="border p-4 mb-4 rounded bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">
              Q{index + 1} - {q.type.toUpperCase()}
            </h2>
            <button
              onClick={() => deleteQuestion(q.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>

          {q.type === "categorize" && (
            <CategorizeQuestion question={q} onUpdate={updateQuestion} />
          )}
          {q.type === "cloze" && (
            <ClozeQuestion question={q} onUpdate={updateQuestion} />
          )}
          {q.type === "comprehension" && (
            <ComprehensionQuestion question={q} onUpdate={updateQuestion} />
          )}
        </div>
      ))}

      <button
        className="bg-purple-700 text-white px-6 py-3 rounded mt-6 w-full"
        onClick={handleSubmit}
      >
        Save Form
      </button>
    </div>
  );
}
