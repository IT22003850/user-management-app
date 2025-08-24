import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [hobbies, setHobbies] = useState([]);
  const [skillLevel, setSkillLevel] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleHobbyChange = (e) => {
    const value = e.target.value;
    setHobbies((prev) => prev.includes(value) ? prev.filter(h => h !== value) : [...prev, value]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', {
        name, email, password, gender, hobbies, skill_level: skillLevel, bio
      });
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-128px)] bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          
          <div>
            <label className="font-semibold text-gray-700">Gender:</label>
            <div className="flex gap-4 mt-2">
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} className="flex items-center gap-1 text-gray-600">
                  <input 
                    type="radio" 
                    value={g} 
                    checked={gender === g} 
                    onChange={(e) => setGender(e.target.value)} 
                    className="text-blue-600 focus:ring-blue-500" 
                  /> {g}
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Hobbies:</label>
            <select 
              multiple 
              value={hobbies} 
              onChange={handleHobbyChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            >
              <option value="Reading">Reading</option>
              <option value="Sports">Sports</option>
              <option value="Music">Music</option>
              <option value="Travel">Travel</option>
              <option value="Gaming">Gaming</option>
            </select>
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Skill Level:</label>
            <select 
              value={skillLevel} 
              onChange={(e) => setSkillLevel(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            >
              <option value="">Select</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Short Bio:</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              rows="4"
            />
          </div>
          
          <button 
            type="submit" 
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Register
          </button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;