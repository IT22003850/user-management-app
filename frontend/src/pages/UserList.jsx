import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to fetch users');
        }
        setLoading(false);
      });
  }, [navigate]);

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
                <th className="px-6 py-3 border-b text-left text-gray-700 font-semibold">Name</th>
                <th className="px-6 py-3 border-b text-left text-gray-700 font-semibold">Email</th>
                <th className="px-6 py-3 border-b text-left text-gray-700 font-semibold">Gender</th>
                <th className="px-6 py-3 border-b text-left text-gray-700 font-semibold">Hobbies</th>
                <th className="px-6 py-3 border-b text-left text-gray-700 font-semibold">Skill Level</th>
                <th className="px-6 py-3 border-b text-left text-gray-700 font-semibold">Bio</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id || user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 border-b text-gray-600">{user.name}</td>
                  <td className="px-6 py-4 border-b text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 border-b text-gray-600">{user.gender}</td>
                  <td className="px-6 py-4 border-b text-gray-600">
                    {Array.isArray(user.hobbies) ? user.hobbies.join(', ') : user.hobbies || '-'}
                  </td>
                  <td className="px-6 py-4 border-b text-gray-600">{user.skill_level}</td>
                  <td className="px-6 py-4 border-b text-gray-600">{user.bio}</td>
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
