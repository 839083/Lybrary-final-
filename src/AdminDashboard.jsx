import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [bookData, setBookData] = useState({ name: "", price: "" });

  const [assignData, setAssignData] = useState({
    bookId: "",
    studentEmail: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
    fetchBooks();
    fetchStudents();
    fetchAssignments();
  }, []);

  /* ===== FETCH DATA ===== */
  const fetchBooks = async () => {
    const res = await fetch("https://lybrary-final.onrender.com/api/books");
    setBooks(await res.json());
  };

  const fetchStudents = async () => {
    const res = await fetch("https://lybrary-final.onrender.com/api/auth/students");
    setStudents(await res.json());
  };

  const fetchAssignments = async () => {
    const res = await fetch("https://lybrary-final.onrender.com/api/assignments");
    setAssignments(await res.json());
  };

  /* ===== ADD BOOK ===== */
  const addBook = async () => {
    if (!bookData.name || !bookData.price) return alert("Fill all fields");

    await fetch("https://lybrary-final.onrender.com/api/books/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });

    setBookData({ name: "", price: "" });
    fetchBooks();
  };

  /* ===== ASSIGN BOOK ===== */
  const assignBook = async () => {
    if (!assignData.bookId || !assignData.studentEmail)
      return alert("Select book & student");

    await fetch("https://lybrary-final.onrender.com/api/assignments/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignData),
    });

    fetchAssignments();
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-dashboard">

        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="profile-left">
            <div className="avatar">🛡️</div>
            <div>
              <h1>{user?.name}</h1>
              <p className="role">Administrator</p>
              <p className="email">{user?.email}</p>
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>

        {/* ADD BOOK */}
        <div className="section">
          <h2>Add New Book</h2>
          <div className="form-grid">
            <input
              placeholder="Book Name"
              value={bookData.name}
              onChange={(e) =>
                setBookData({ ...bookData, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              value={bookData.price}
              onChange={(e) =>
                setBookData({ ...bookData, price: e.target.value })
              }
            />
          </div>
          <button className="primary-btn" onClick={addBook}>
            Add Book
          </button>
        </div>

        {/* ASSIGN BOOK */}
        <div className="section">
          <h2>Assign Book to Student</h2>

          <div className="form-grid">
            <select
              onChange={(e) =>
                setAssignData({ ...assignData, bookId: e.target.value })
              }
            >
              <option value="">Select Book</option>
              {books.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setAssignData({
                  ...assignData,
                  studentEmail: e.target.value,
                })
              }
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s._id} value={s.email}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              onChange={(e) =>
                setAssignData({ ...assignData, startDate: e.target.value })
              }
            />
            <input
              type="date"
              onChange={(e) =>
                setAssignData({ ...assignData, endDate: e.target.value })
              }
            />
          </div>

          <button className="primary-btn" onClick={assignBook}>
            Assign Book
          </button>
        </div>

        {/* ASSIGNMENTS */}
        <div className="section">
          <h2>Current Assignments</h2>

          <div className="assignment-grid">
            {assignments.map((a) => (
              <div className="assignment-card" key={a._id}>
                <div className="assignment-book">
                  📘 {a.bookId?.name}
                </div>
                <div className="assignment-student">
                  {a.studentEmail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== CSS ===================== */}
      <style>{`
        * {
          box-sizing: border-box;
          font-family: "Inter", "Segoe UI", Arial, sans-serif;
        }

        .admin-wrapper {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #1e1f29, #2b2d42);
          padding: 32px;
        }

        .admin-dashboard {
          width: 100%;
          max-width: 1200px;
          background: #2f3136;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.45);
          color: #ffffff;
        }

        /* PROFILE */
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 28px;
          border-bottom: 1px solid #3a3d42;
          margin-bottom: 36px;
        }

        .profile-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .avatar {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          background: #5865f2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
        }

        .profile-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }

        .role {
          font-size: 16px;
          color: #b9bbbe;
        }

        .email {
          font-size: 14px;
          color: #8e9297;
        }

        .logout-btn {
          background: #ed4245;
          border: none;
          color: white;
          padding: 12px 22px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
        }

        .logout-btn:hover {
          background: #f04747;
        }

        /* SECTIONS */
        .section {
          margin-top: 36px;
        }

        .section h2 {
          font-size: 22px;
          margin-bottom: 18px;
          font-weight: 600;
        }

        /* FORMS */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        input, select {
          padding: 14px;
          border-radius: 12px;
          border: none;
          font-size: 15px;
          background: #202225;
          color: #ffffff;
        }

        input::placeholder {
          color: #8e9297;
        }

        .primary-btn {
          background: #5865f2;
          border: none;
          color: white;
          padding: 14px 26px;
          border-radius: 14px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
        }

        .primary-btn:hover {
          background: #6d79f6;
        }

        /* ASSIGNMENTS */
        .assignment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 18px;
        }

        .assignment-card {
          background: #202225;
          padding: 18px;
          border-radius: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
        }

        .assignment-book {
          font-weight: 600;
        }

        .assignment-student {
          color: #b9bbbe;
          font-size: 14px;
        }

        @media (max-width: 900px) {
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .logout-btn {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
