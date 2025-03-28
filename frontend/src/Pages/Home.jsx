import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null); // Track the user being edited
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://reqres.in/api/users?page=${currentPage}`);
        const fetchedUsers = response.data.data || [];
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter(user =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/');
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      const response = await axios.put(`https://reqres.in/api/users/${editingUser.id}`, {
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        email: editingUser.email,
      });

      alert(`User updated: ${response.data.first_name} ${response.data.last_name}`);

      // Update user list locally (since ReqRes doesn't persist data)
      setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
      setFilteredUsers(filteredUsers.map(user => (user.id === editingUser.id ? editingUser : user)));
      setEditingUser(null); // Exit edit mode
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${userId}`);
      alert('User deleted successfully');

      // Remove user from UI (ReqRes doesn't actually delete the user)
      setUsers(users.filter(user => user.id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="homepage-container">
      <button onClick={handleLogout} className="logout-btn">Logout</button>

      <div className="column all-users">
        <h2>All Users</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
        {filteredUsers.length > 0 ? (
          <ul>
            {filteredUsers.map((user) => (
              <li key={user.id}>
                <img src={user.avatar} alt={user.first_name} className="user-avatar" />

                {/* Edit Mode */}
                {editingUser && editingUser.id === user.id ? (
                  <div>
                    <input
                      type="text"
                      value={editingUser.first_name}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, first_name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      value={editingUser.last_name}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, last_name: e.target.value })
                      }
                    />
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, email: e.target.value })
                      }
                    />
                    <button className='sev' onClick={handleSaveUser}>Save</button>
                    <button className='cencel' onClick={() => setEditingUser(null)}>Cancel</button>
                  </div>
                ) : (
                  // Display Mode
                  <div>
                    <h3>{user.first_name} {user.last_name}</h3>
                    <p>{user.email}</p>
                    <button className='edyt' onClick={() => handleEditUser(user)}>Edit</button>
                    <button className='delyt' onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}

        {/* Pagination Controls */}
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
