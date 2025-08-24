import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Register = () => {
         const [email, setEmail] = useState('');
         const [username, setUsername] = useState('');
         const [password, setPassword] = useState('');
         const [role, setRole] = useState('user');
         const [error, setError] = useState(null);
         const navigate = useNavigate();

         const handleSubmit = async (e) => {
             e.preventDefault();
             try {
                 const response = await axios.post('http://localhost:8000/api/accounts/register/', {
                     email,
                     username,
                     password,
                     role,
                 }, {
                     headers: {
                         'Content-Type': 'application/json',
                     },
                 });
                 console.log('Registration successful:', response.data);
                 navigate('/login'); // Redirect to login page after successful registration
             } catch (error) {
                 console.error('Registration error:', error.response?.data || error.message);
                 setError(error.response?.data?.detail || 'Registration failed. Please try again.');
             }
         };

         return (
             <div>
                 <h2>Register</h2>
                 {error && <p style={{ color: 'red' }}>{error}</p>}
                 <form onSubmit={handleSubmit}>
                     <div>
                         <label>Email:</label>
                         <input
                             type="email"
                             value={email}
                             onChange={(e) => setEmail(e.target.value)}
                             required
                         />
                     </div>
                     <div>
                         <label>Username:</label>
                         <input
                             type="text"
                             value={username}
                             onChange={(e) => setUsername(e.target.value)}
                             required
                         />
                     </div>
                     <div>
                         <label>Password:</label>
                         <input
                             type="password"
                             value={password}
                             onChange={(e) => setPassword(e.target.value)}
                             required
                         />
                     </div>
                     <div>
                         <label>Role:</label>
                         <select value={role} onChange={(e) => setRole(e.target.value)}>
                             <option value="user">User</option>
                             <option value="admin">Admin</option>
                         </select>
                     </div>
                     <button type="submit">Register</button>
                 </form>
             </div>
         );
     };

     export default Register;
    