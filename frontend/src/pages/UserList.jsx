import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null); // track editing
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to fetch users');
        }
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      gender: user.gender,
      hobbies: Array.isArray(user.hobbies) ? user.hobbies : [],
      skill_level: user.skill_level,
      bio: user.bio,
    });
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_URL}/api/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">User List</h2>

      {loading && <p className="text-gray-500 text-center">Loading users...</p>}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {!loading && users.length === 0 && (
        <p className="text-gray-600 text-center">No users found.</p>
      )}

      {!loading && users.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 border-b text-left">Name</th>
                <th className="px-6 py-3 border-b text-left">Email</th>
                <th className="px-6 py-3 border-b text-left">Gender</th>
                <th className="px-6 py-3 border-b text-left">Hobbies</th>
                <th className="px-6 py-3 border-b text-left">Skill Level</th>
                <th className="px-6 py-3 border-b text-left">Bio</th>
                <th className="px-6 py-3 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  {editingUser === user.id ? (
                    <>
                      <td className="px-6 py-4 border-b">
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="px-6 py-4 border-b">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="px-6 py-4 border-b">
                        <select
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                          className="border p-1 rounded w-full"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 border-b">
                        <input
                          type="text"
                          value={formData.hobbies}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hobbies: e.target.value.split(','),
                            })
                          }
                          className="border p-1 rounded w-full"
                          placeholder="Comma separated"
                        />
                      </td>
                      <td className="px-6 py-4 border-b">
                        <select
                          value={formData.skill_level}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              skill_level: e.target.value,
                            })
                          }
                          className="border p-1 rounded w-full"
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 border-b">
                        <textarea
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                          }
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="px-6 py-4 border-b space-x-2">
                        <button
                          onClick={() => handleUpdate(user.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 border-b">{user.name}</td>
                      <td className="px-6 py-4 border-b">{user.email}</td>
                      <td className="px-6 py-4 border-b">{user.gender}</td>
                      <td className="px-6 py-4 border-b">
                        {Array.isArray(user.hobbies)
                          ? user.hobbies.join(', ')
                          : user.hobbies || '-'}
                      </td>
                      <td className="px-6 py-4 border-b">{user.skill_level}</td>
                      <td className="px-6 py-4 border-b">{user.bio}</td>
                      <td className="px-6 py-4 border-b space-x-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
