import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function FormPreviewEditable() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await API.get(`/${id}`);
        if (res.data && Array.isArray(res.data.questions)) {
          // Ensure subQuestions exists for comprehension questions
          const updated = {
            ...res.data,
            questions: res.data.questions.map((q) =>
              q.type === "comprehension"
                ? { ...q, subQuestions: q.subQuestions || [] }
                : q
            ),
          };
          setForm(updated);
        } else {
          setError("Form data is invalid.");
        }
      } catch (err) {
        console.error("Error fetching form:", err);
        setError("Failed to load form");
      }
    };
    fetchForm();
  }, [id]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const srcParts = source.droppableId.split("__");
    const destParts = destination.droppableId.split("__");
    if (srcParts.length < 3 || destParts.length < 3) return;

    const qIdx = Number(srcParts[1]);
    const srcField = srcParts[2];
    const destField = destParts[2];
    if (srcField !== destField) return;

    setForm((prev) => {
      const newQuestions = prev.questions.map((q) => ({ ...q }));
      const list = Array.isArray(newQuestions[qIdx][srcField])
        ? [...newQuestions[qIdx][srcField]]
        : [];
      const [moved] = list.splice(source.index, 1);
      list.splice(destination.index, 0, moved);
      newQuestions[qIdx] = { ...newQuestions[qIdx], [srcField]: list };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleSave = async () => {
    try {
      await API.put(`/${id}`, form);
      alert("Changes saved.");
      navigate(`/form/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    }
  };

  const handleInputChange = (
    qIdx,
    field,
    value,
    subIdx = null,
    subField = null
  ) => {
    setForm((prev) => {
      const updatedQuestions = [...prev.questions];
      if (subIdx !== null && subField) {
        updatedQuestions[qIdx][field][subIdx][subField] = value;
      } else {
        updatedQuestions[qIdx][field][subIdx ?? 0] = value;
      }
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleAddSubQuestion = (qIdx) => {
  setForm((prev) => {
    const updatedQuestions = [...prev.questions];
    if (!Array.isArray(updatedQuestions[qIdx].subQuestions)) {
      updatedQuestions[qIdx].subQuestions = [];
    }

    // Check if any sub-question is empty
    const hasEmpty = updatedQuestions[qIdx].subQuestions.some(
      (sq) => sq.question.trim() === "" && sq.answer.trim() === ""
    );

    if (!hasEmpty) {
      updatedQuestions[qIdx].subQuestions.push({ question: "", answer: "" });
    }
    // else do nothing, because an empty sub-question is already there

    return { ...prev, questions: updatedQuestions };
  });
};

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!form) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Preview & Edit: {form.title}</h1>

      {form.headerImage && (
        <img
          src={`http://localhost:5000${form.headerImage}`}
          alt="Header"
          className="mb-6 rounded h-80 w-200"
        />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        {form.questions.map((q, idx) => {
          const fieldForType =
            q.type === "categorize"
              ? "options"
              : q.type === "cloze"
              ? "blanks"
              : "subQuestions"; // always subQuestions for comprehension

          return (
            <div
              key={q._id || idx}
              className="p-4 border rounded bg-gray-50 mb-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    Q{idx + 1}: {q.questionText || q.type.toUpperCase()}
                  </p>
                  {q.imageUrl && (
                    <img
                      src={`http://localhost:5000${q.imageUrl}`}
                      alt="Question"
                      className="my-3 rounded h-100 w-300"
                    />
                  )}
                </div>
                
              </div>

              {q.type === "comprehension" && q.paragraph && (
                <p className="mb-3 whitespace-pre-wrap">{q.paragraph}</p>
              )}

              <Droppable droppableId={`q__${idx}__${fieldForType}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 ${
                      snapshot.isDraggingOver ? "bg-blue-50 p-2 rounded" : ""
                    }`}
                  >
                    {(Array.isArray(q[fieldForType])
                      ? q[fieldForType]
                      : []
                    ).map((it, i) => {
                      const draggableId = `${
                        q._id || idx
                      }__${fieldForType}__${i}`;
                      return (
                        <Draggable
                          key={draggableId}
                          draggableId={draggableId}
                          index={i}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`p-3 bg-white border rounded ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              }`}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="mb-2 cursor-grab"
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M10 6h4M10 12h4M10 18h4"
                                    stroke="#555"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </div>

                              {q.type === "categorize" && (
                                <input
                                  type="text"
                                  value={it}
                                  onChange={(e) =>
                                    handleInputChange(
                                      idx,
                                      "options",
                                      e.target.value,
                                      i
                                    )
                                  }
                                  className="border p-2 w-full"
                                />
                              )}

                              {q.type === "cloze" && (
                                <div className="space-y-2">
                                  
                                  <input
                                    type="text"
                                    placeholder="Answer"
                                    value={q.answers?.[i] || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        idx,
                                        "answers",
                                        e.target.value,
                                        i
                                      )
                                    }
                                    className="border p-2 w-full"
                                  />
                                </div>
                              )}

                              {q.type === "comprehension" && (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    placeholder="Sub-question"
                                    value={it.question || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        idx,
                                        "subQuestions",
                                        e.target.value,
                                        i,
                                        "question"
                                      )
                                    }
                                    className="border p-2 w-full"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Answer"
                                    value={it.answer || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        idx,
                                        "subQuestions",
                                        e.target.value,
                                        i,
                                        "answer"
                                      )
                                    }
                                    className="border p-2 w-full"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {q.type === "comprehension" && (
                <button
                  onClick={() => handleAddSubQuestion(idx)}
                  className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded"
                >
                  + Add Sub-question
                </button>
              )}
            </div>
          );
        })}
      </DragDropContext>

      <div className="flex gap-2 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded"
        >
          Back to Builder
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Save changes & Publish
        </button>
      </div>
    </div>
  );
}
