import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function NoteDetails() {
  // دریافت id یادداشت از آدرس
  const { id } = useParams();

  // انتقال به صفحه دیگر
  const navigate = useNavigate();

  // اطلاعات یادداشت
  const [note, setNote] = useState(null);

  // مقادیر فرم ویرایش
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // وضعیت ها
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // دریافت اطلاعات یادداشت
  useEffect(() => {
    const getNote = async () => {
      try {
        const response = await api.get(`/notes/${id}`);

        const noteData = response.data.response;

        setNote(noteData);
        setTitle(noteData.title);
        setContent(noteData.content);
      } catch (error) {
        setError("مشکلی در دریافت یادداشت پیش آمده است.");
      } finally {
        setLoading(false);
      }
    };

    getNote();
  }, [id]);

  // ارسال تغییرات به سرور
  const handleUpdate = async (e) => {
    e.preventDefault();

    setUpdating(true);
    setError("");

    try {
      await api.put(`/notes/${id}`, {
        title: title,
        content: content,
      });
      toast.success("Note updated successfully!");
      // بازگشت به صفحه اصلی
      navigate("/");
    } catch (error) {
      console.log("UPDATE ERROR:", error);
      console.log("ERROR RESPONSE:", error.response?.data);
      toast.error("Failed to update note!");

      setError("مشکلی در ویرایش یادداشت پیش آمده است.");
    } finally {
      setUpdating(false);
    }
  };

  // نمایش لودینگ
  if (loading) {
    return <h2>Loading...</h2>;
  }

  // نمایش خطا
  if (error && !note) {
    return <p>{error}</p>;
  }

  return (
    <div className="create-container">
      <h1>Note Details</h1>

      {note && (
        <>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="6"
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" disabled={updating}>
              {updating ? "Updating..." : "Update Note"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default NoteDetails;
