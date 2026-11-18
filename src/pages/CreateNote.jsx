import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function CreateNote() {
  // نگهداری عنوان و توضیحات یادداشت
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // وضعیت ارسال اطلاعات
  const [loading, setLoading] = useState(false);

  // نمایش خطا
  const [error, setError] = useState("");

  // برای انتقال به صفحه دیگر
  const navigate = useNavigate();

  // ارسال اطلاعات به سرور
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.post("/notes", {
        title: title,
        content: description,
      });

      // نمایش پیام موفقیت
      toast.success("Note created successfully!");

      // بازگشت به صفحه اصلی
      navigate("/");
    } catch (error) {
      console.log("POST ERROR:", error);

      setError("مشکلی در ایجاد یادداشت پیش آمده است.");

      // نمایش پیام خطا
      toast.error("Failed to create note!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <h1>Create New Note</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter note description"
            rows="6"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Note"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="cancel-btn"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default CreateNote;
