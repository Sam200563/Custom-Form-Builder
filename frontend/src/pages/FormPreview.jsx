import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function FormPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await API.get(`/${id}`);
        if (res.data && Array.isArray(res.data.questions)) {
          setForm(res.data);
          setAnswers(
            res.data.questions.map((q) => ({
              questionId: q._id,
              answer:
                q.type === "categorize" ||
                q.type === "cloze" ||
                q.type === "comprehension"
                  ? {}
                  : "",
            }))
          );
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

  // Initialize unassigned options for categorize questions on first load
  useEffect(() => {
    if (!form) return;

    setAnswers((prev) => {
      const updated = prev.map((a, i) => {
        if (form.questions[i].type === "categorize") {
          if (!a.answer || !a.answer.options) {
            return {
              ...a,
              answer: { options: [...(form.questions[i].options || [])] },
            };
          }
        }
        return a;
      });
      return updated;
    });
  }, [form]);

  // Handle drag and drop for categorize questions
  const handleDragEnd = (qIdx, result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    setAnswers((prev) => {
      const newAnswers = [...prev];
      const assigned = newAnswers[qIdx].answer || {};

      // Helpers
      const removeFromList = (list = [], item) =>
        list.filter((i) => i !== item);
      const addToList = (list = [], item) => [...list, item];

      let updatedAssigned = { ...assigned };

      if (source.droppableId === "options") {
        // Drag from unassigned options to a category
        updatedAssigned.options = removeFromList(updatedAssigned.options, draggableId);
        updatedAssigned[destination.droppableId] = addToList(
          updatedAssigned[destination.droppableId],
          draggableId
        );
      } else if (destination.droppableId === "options") {
        // Drag from category back to unassigned options
        updatedAssigned[source.droppableId] = removeFromList(
          updatedAssigned[source.droppableId],
          draggableId
        );
        updatedAssigned.options = addToList(updatedAssigned.options, draggableId);
      } else if (source.droppableId !== destination.droppableId) {
        // Drag from one category to another
        updatedAssigned[source.droppableId] = removeFromList(
          updatedAssigned[source.droppableId],
          draggableId
        );
        updatedAssigned[destination.droppableId] = addToList(
          updatedAssigned[destination.droppableId],
          draggableId
        );
      }

      // If options key missing, initialize it
      if (!updatedAssigned.options) {
        updatedAssigned.options = form.questions[qIdx].options || [];
      }

      newAnswers[qIdx] = { ...newAnswers[qIdx], answer: updatedAssigned };
      return newAnswers;
    });
  };

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!form) return <div className="p-4">Loading form...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/${id}/submit`, { answers });
      navigate("/form/submitted");
    } catch (err) {
      console.error("Submit error", err);
      alert("Submit failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Form title */}
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>

      {/* Header image */}
      {form.headerImage && (
        <img
          src={`http://localhost:5000${form.headerImage}`}
          alt="Header"
          className="mb-6 rounded h-80 w-200"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.questions.map((q, idx) => (
          <div key={q._id} className="p-4 border rounded bg-gray-50">
            {/* Question title */}
            <p className="font-semibold mb-3">
              Q{idx + 1}: {q.questionText || q.type.toUpperCase()}
            </p>

            {/* Question image */}
            {q.imageUrl && (
              <img
                src={`http://localhost:5000${q.imageUrl}`}
                alt="Question"
                className="mb-4 rounded h-100 w-300"
              />
            )}

            {/* Categorize question with drag and drop */}
            {q.type === "categorize" && (
              <DragDropContext onDragEnd={(result) => handleDragEnd(idx, result)}>
                {/* Unassigned options */}
                <Droppable droppableId="options" direction="horizontal">
                  {(provided, snapshot) => {
                    const unassignedOptions = answers[idx]?.answer?.options || [];
                    return (
                      <div
                        className={`flex gap-3 p-3 rounded border mb-6 overflow-auto ${
                          snapshot.isDraggingOver ? "bg-indigo-100" : "bg-indigo-50"
                        }`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {unassignedOptions.map((opt, i) => (
                          <Draggable key={opt} draggableId={opt} index={i}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={provided.draggableProps.style}
                                className={`px-4 py-2 bg-white border rounded shadow cursor-move select-none ${
                                  snapshot.isDragging ? "shadow-lg scale-105" : ""
                                }`}
                              >
                                {opt}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>

                {/* Category buckets */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {q.categories?.map((cat) => (
                    <Droppable droppableId={cat} key={cat}>
                      {(provided, snapshot) => {
                        const assignedOptions = answers[idx]?.answer?.[cat] || [];
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[80px] p-3 rounded border border-dashed flex flex-col ${
                              snapshot.isDraggingOver ? "bg-indigo-200" : "bg-indigo-100"
                            }`}
                          >
                            <h3 className="font-semibold mb-2 text-indigo-700">{cat}</h3>
                            {assignedOptions.map((opt, i) => (
                              <Draggable key={opt} draggableId={opt} index={i}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={provided.draggableProps.style}
                                    className={`px-3 py-1 mb-1 bg-white border rounded shadow cursor-move select-none ${
                                      snapshot.isDragging ? "shadow-lg scale-105" : ""
                                    }`}
                                  >
                                    {opt}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  ))}
                </div>
              </DragDropContext>
            )}

            {/* Cloze question */}
            {q.type === "cloze" && (
              <>
                {q.blanks?.map((blank, bIdx) => (
                  <input
                    key={bIdx}
                    placeholder={`Enter Answer`}
                    className="border p-2 w-full my-2"
                    onChange={(e) =>
                      setAnswers((prev) => {
                        const updated = {
                          ...prev[idx].answer,
                          [blank]: e.target.value,
                        };
                        return prev.map((a, i) =>
                          i === idx ? { ...a, answer: updated } : a
                        );
                      })
                    }
                  />
                ))}
              </>
            )}

            {/* Comprehension question */}
            {q.type === "comprehension" && (
              <>
                <p className="mb-3 whitespace-pre-wrap">{q.paragraph}</p>
                {(q.subQuestions || q.questions || []).map((sub, sIdx) => (
                  <div key={sIdx} className="mb-2">
                    <label className="block font-medium mb-1">{sub.question}</label>
                    <input
                      type="text"
                      placeholder="Answer"
                      className="border p-2 w-full"
                      onChange={(e) =>
                        setAnswers((prev) => {
                          const updated = {
                            ...prev[idx].answer,
                            [sub.question]: e.target.value,
                          };
                          return prev.map((a, i) =>
                            i === idx ? { ...a, answer: updated } : a
                          );
                        })
                      }
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded"
        >
          Submit Response
        </button>
      </form>
    </div>
  );
}
