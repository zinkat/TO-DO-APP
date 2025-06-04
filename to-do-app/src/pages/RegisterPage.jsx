import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; 
import { findUserByEmail, registerUser } from '../api';


function RegisterPage() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');

  

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const existing = await findUserByEmail(email);
    if (existing.length > 0) {
      alert('❌ Cet email est déjà inscrit. Veuillez vous connecter.');
        navigate('/login');
      return;
    }
const user = await registerUser(email, name);
login(user);
    navigate('/');
  } catch (err) {
    console.error("Erreur d'enregistrement :", err);
  }
};


  return (
  <div className="min-h-screen transition-colors duration-200  bg-white text-black dark:bg-gray-900 dark:text-white md:p-8">
    <div className=" mt-8 md:p-4 flex flex-col items-center justify-center">
      <div className='text-start md:w-2/5'><h1 className=' text-center md:text-4xl  text-3xl  my-9 '>Créer un compte</h1></div>
      <form className='w-4/5 text-center space-y-4' onSubmit={handleRegister}>
        <input type="email" placeholder="Email" className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500  transition-colors duration-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 " value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
  type="text"
  placeholder="Nom"
  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 transition-colors duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 mx-4"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
/>
     

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white  px-6 py-2 mx-4 rounded-md" type="submit" title='register'>s'inscrire</button>
       
      </form>
    </div>
  </div>
  );
}

export default RegisterPage;