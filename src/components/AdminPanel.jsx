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
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
