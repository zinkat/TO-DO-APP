import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Navbar({ toggleTheme, theme }) {

  const { user, logout } = useAuth();
  console.log("USER DANS NAVBAR:", user);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 px-2 md:px-8 py-4 flex justify-between items-center shadow-sm">
      <div >
        <img src="to-do.png" alt="logo"  className=' ' />
      </div>

      <div className="flex items-center gap-2 md:gap-4 text-sm ">
        {user ? (
          <>
            <span className="text-gray-700 dark:text-gray-300 text-xs md:text-base ">
        Bienvenue, {user?.name || user?.email || 'Utilisateur'}

            </span>
            <button
              onClick={handleLogout}
              className=" transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700 text-white md:px-4 md:py-2 px-2 py-1 rounded-md hover:scale-105 transition"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-indigo-600 dark:text-indigo-300 hover:underline text-base font-medium">
             Connexion
            </Link>
            <Link to="/register" className="text-indigo-600 dark:text-indigo-300 hover:underline text-base font-medium">
             Inscription
            </Link>
          </>
        )}

        <button
          onClick={toggleTheme}
          className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
