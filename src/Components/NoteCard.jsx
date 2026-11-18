import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function NoteCard({ note, onDelete }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const id = note._id || note.id;

      await api.delete(`/notes/${id}`);

      // حذف کارت از صفحه
      onDelete(id);

      // نمایش پیام موفقیت
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.log("DELETE ERROR:", error);

      // نمایش پیام خطا
      toast.error("Failed to delete note!");
    }
  };

  return (
    <div className="note-card">
      <h2>{note.title}</h2>

      <p>{note.description || note.content}</p>

      <div className="note-actions">
        <Link to={`/note/${note._id || note.id}`}>Show and edit</Link>

        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
