import { useState, useEffect } from "react";
import api from "../services/api";
import NoteCard from "../Components/NoteCard";
import { Link } from "react-router-dom";

function Home() {
  // ذخیره یادداشت ها
  const [notes, setNotes] = useState([]);

  // متن جست و جو
  const [search, setSearch] = useState("");

  // وضعیت مرتب سازی
  const [sortOrder, setSortOrder] = useState("newest");

  // شماره صفحه فعلی
  const [currentPage, setCurrentPage] = useState(1);

  // تعداد یادداشت در هر صفحه
  const notesPerPage = 6;

  // وضعیت لودینگ
  const [loading, setLoading] = useState(true);

  // وضعیت خطا
  const [error, setError] = useState("");

  // دریافت یادداشت ها از سرور
  useEffect(() => {
    const getNotes = async () => {
      try {
        const response = await api.get("/notes");

        setNotes(response.data.response);
      } catch (error) {
        setError("مشکلی در دریافت یادداشت ها پیش آمده است.");
      } finally {
        setLoading(false);
      }
    };

    getNotes();
  }, []);

  // حذف یادداشت از لیست صفحه
  const handleDelete = (deletedId) => {
    setNotes((previousNotes) =>
      previousNotes.filter((note) => (note._id || note.id) !== deletedId),
    );
  };

  // جست و جو بر اساس عنوان
  const filteredNotes = notes.filter((note) => {
    const title = note.title || "";

    return title.toLowerCase().includes(search.trim().toLowerCase());
  });

  // مرتب سازی یادداشت ها
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (sortOrder === "newest") {
      return dateB - dateA;
    }

    return dateA - dateB;
  });

  // محاسبه تعداد صفحات
  const totalPages = Math.ceil(sortedNotes.length / notesPerPage);

  // جلوگیری از قرار گرفتن در صفحه نامعتبر
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  // محاسبه محدوده یادداشت های هر صفحه
  const startIndex = (safeCurrentPage - 1) * notesPerPage;
  const endIndex = startIndex + notesPerPage;

  // یادداشت های صفحه فعلی
  const currentNotes = sortedNotes.slice(startIndex, endIndex);

  // نمایش لودینگ
  if (loading) {
    return (
      <div className="home-container">
        <h1>Think Board</h1>

        <div className="notes-container">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="skeleton-card" key={item}>
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-button"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // نمایش خطا
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Think Board</h1>

        <Link to="/create" className="add-note-btn">
          + Add New Note
        </Link>
      </header>

      {/* قسمت جست و جو */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* قسمت مرتب سازی */}
      <div className="sort-container">
        <label htmlFor="sort">Sort by:</label>

        <select
          id="sort"
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* نمایش یادداشت ها */}
      {sortedNotes.length === 0 ? (
        <p>No notes found!</p>
      ) : (
        <>
          <div className="notes-container">
            {currentNotes.map((note) => (
              <NoteCard
                key={note._id || note.id}
                note={note}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* دکمه های صفحه بندی */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
              >
                Previous
              </button>

              <span>
                Page {safeCurrentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
