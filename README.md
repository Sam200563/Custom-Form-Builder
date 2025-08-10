
# 💼 Custom Form Builder

A React-based custom form builder application with three question types: Categorize, Cloze, and Comprehension.  
Users can create forms with header images and question images, preview them, and collect user responses saved to MongoDB.

---

## 🚀 Live Demo

- **Frontend (React + Vite)**: [https://your-frontend.netlify.app](https://customformapp.netlify.app/)
- **Backend (Node + Express)**: [https://your-backend.onrender.com](https://custom-form-builder-i36u.onrender.com)

---

### How to Test
- Open the app and click on Get Started to begin creating a new form.
- Add questions of different types (Categorize, Cloze, Comprehension) and upload images for the header and individual questions as needed.
- Once all questions are added and images uploaded, save the form.
- If you want to make changes, edit the form, then click Save and Publish to update it.
- After publishing, use the provided link to fill out the form as a user.
- Submit your responses.

---

## 🧰 Tech Stack

### 🖥 Frontend:
- React.js
- Tailwind CSS
- React Router DOM
- Axios

### 🔧 Backend:
- Node.js
- Express.js
- MongoDB (via Mongoose)
- Multer
- dotenv, cors

---

### Features
- Add/edit form title and header image (uploaded and stored locally).
- Add questions of three types:
- Categorize: Drag and drop options into categories.
-Cloze: Fill-in-the-blanks with automatic blank creation.
-Comprehension: Paragraph with sub-questions.
- Upload images for questions and form header.
- Preview form before saving.
- Submit responses to saved forms.
- All data stored in MongoDB.
- Backend serves uploaded images from local storage.

---
