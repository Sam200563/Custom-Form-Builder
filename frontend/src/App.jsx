import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormBuilder from "./pages/FormBuilder";
import FormPreview from "./pages/FormPreview";
import SuccessPage from "./pages/SuccessPage";
import FormPreviewEditable from "./pages/FormPreviewEditable";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/form-builder" element={<FormBuilder />} />
        <Route path="/form/preview-edit/:id" element={<FormPreviewEditable />} />
        <Route path="/form/:id" element={<FormPreview />} />
        <Route path="/form/submitted" element={<SuccessPage />} />
        <Route path="*" element={<div className="p-4 text-center">404 - Page not found</div>} />
      </Routes>
    </Router>
  );
}
