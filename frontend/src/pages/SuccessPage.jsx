import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-green-600">🎉 Form Submitted!</h1>
      <p className="mb-6">Thank you for your response. Your submission has been recorded.</p>
      <Link
        to="/form-builder"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Another Form
      </Link>
    </div>
  );
}
