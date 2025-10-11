import React, { useState, useEffect } from "react";
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setError("");
      try {
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          const data = await response.json();
          setError(data.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Error!", error.message);
        setError("An error occurred while fetching users. Please try again.");
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted user from the local state
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error!", error.message);
      setError("An error occurred while deleting the user. Please try again.");
    }
  };

  return (
    <div className="admin-panel-container">
      <h2>Admin Panel</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>
                <button onClick={() => handleDelete(user._id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
