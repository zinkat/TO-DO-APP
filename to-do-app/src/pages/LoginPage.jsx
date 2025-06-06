import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { findUserByEmail } from '../api'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const found = await findUserByEmail(email);
    if (found.length > 0) {
        login(found[0]); // on connecte
      navigate('/');
    } else {
      alert('Utilisateur non trouvé. Veuillez vous inscrire.');
      navigate('/register');
    }
  } catch (err) {
    console.error("Erreur login :", err);
  }
};


  return (
      <div className="min-h-screen transition-colors duration-200  bg-white text-black dark:bg-gray-900 dark:text-white md:p-8">
   <div className="mt-8 md:p-4 flex flex-col items-center justify-center">
    <div className='text-start w-2/5'> <h1 className=' text-center md:text-4xl  text-3xl my-9 '>Login</h1></div>
     
      <form className='w-4/5 text-center space-y-4' onSubmit={handleSubmit}> 
        <input type="email" className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500  transition-colors duration-200 dark:bg-gray-800 dark:text-white dark:border-gray-600" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button
         className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 mx-4 rounded-md" type="submit">Login</button>
      </form>
    </div>
    </div>
  );
}

export default LoginPage;