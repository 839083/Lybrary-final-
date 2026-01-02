import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [assignedBooks, setAssignedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/");
    } else {
      fetchAssignedBooks();
    }
  }, []);

  const fetchAssignedBooks = async () => {
    try {
      const res = await fetch(
        `https://lybrary-final.onrender.com/api/assignments/student/${user.email}`
      );
      const data = await res.json();
      setAssignedBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="student-wrapper">
      <div className="student-dashboard">

        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="profile-left">
            <div className="avatar">🎓</div>
            <div className="profile-info">
              <h1>{user?.name}</h1>
              <p className="role">Student</p>
              <p className="email">{user?.email}</p>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* BOOK SECTION */}
        <div className="section">
          <h2>Assigned Books</h2>

          {loading ? (
            <p className="status-text">Loading assigned books…</p>
          ) : assignedBooks.length === 0 ? (
            <p className="status-text">No books currently assigned.</p>
          ) : (
            <div className="books-grid">
              {assignedBooks.map((a) => (
                <div className="book-card" key={a._id}>
                  <div className="book-header">
                    <div className="book-icon">📘</div>
                    <h4>{a.bookId?.name}</h4>
                  </div>

                  <div className="book-details">
                    <div>
                      <span className="label">Price</span>
                      <span className="value">₹ {a.bookId?.price}</span>
                    </div>

                    <div>
                      <span className="label">Issued On</span>
                      <span className="value">
                        {new Date(a.startDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <span className="label">Due Date</span>
                      <span className="value">
                        {new Date(a.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===================== CSS ===================== */}
      <style>{`
        * {
          box-sizing: border-box;
          font-family: "Inter", "Segoe UI", Arial, sans-serif;
        }

        .student-wrapper {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #1e1f29, #2b2d42);
          padding: 32px;
        }

        .student-dashboard {
          width: 100%;
          max-width: 1100px;
          background: #2f3136;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.45);
          color: #ffffff;
        }

        /* PROFILE HEADER */
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

        .profile-info h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }

        .role {
          font-size: 16px;
          color: #b9bbbe;
          margin-top: 4px;
        }

        .email {
          font-size: 14px;
          color: #8e9297;
          margin-top: 2px;
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

        /* SECTION */
        .section h2 {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .status-text {
          font-size: 16px;
          color: #b9bbbe;
        }

        /* BOOKS GRID */
        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 26px;
        }

        .book-card {
          background: #202225;
          padding: 24px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.45);
        }

        .book-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .book-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #5865f2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }

        .book-card h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .book-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          font-size: 15px;
          color: #b9bbbe;
        }

        .label {
          display: block;
          font-size: 13px;
          color: #8e9297;
          margin-bottom: 6px;
        }

        .value {
          font-size: 16px;
          color: #ffffff;
        }

        @media (max-width: 800px) {
          .book-details {
            grid-template-columns: 1fr;
          }

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

export default StudentDashboard;
