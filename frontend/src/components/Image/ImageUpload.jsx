import { useState } from "react";
import API from "../../api/apiUploads"; 

export default function ImageUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setError("");
    try {
      const response = await API.post("/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.imageUrl) {
        onUpload(response.data.imageUrl);
        setFile(null);
        setPreview(null);
      } else {
        setError("Upload failed: No file path returned");
      }
    } catch (err) {
      setError("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="my-2">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="max-h-40 mt-2 rounded border object-contain"
        />
      )}
      <div className="mt-2">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>
      {error && <p className="text-red-600 mt-1">{error}</p>}
    </div>
  );
}
