// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
    navigate('/');
  };

  return (
   <div className="min-h-screen  bg-gray-800 text-white p-4 flex flex-col items-center justify-center">
    <div className='text-start w-2/5'> <h1 className='text-white text-center text-4xl my-9 '>Login</h1></div>
     
      <form className='w-2/5 text-center' onSubmit={handleSubmit}> 
        <input type="email" className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none   " placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button
         className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 mx-4 rounded-md" type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;