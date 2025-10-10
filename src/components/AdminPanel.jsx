import React, { useState, useEffect } from "react";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://porchelvan-builders-45on.vercel.app/api/admin/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          alert("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error!", error.message);
        alert("An error occurred. Please try again.");
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`https://porchelvan-builders-45on.vercel.app/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted user from the local state
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error!", error.message);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <table>
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
                <button onClick={() => handleDelete(user._id)} className="btn btn-danger">
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
