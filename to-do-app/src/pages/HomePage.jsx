import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [priority, setPriority] = useState('moyenne');
  const [dueDate, setDueDate] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'priority' ou 'date'
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('light');
  const [editingId, setEditingId] = useState(null); // id de la tâche qu'on édite
  const [editValues, setEditValues] = useState({ text: '', priority: '', dueDate: '' });




useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  }
}, []);
  const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
};



  const handleLogout = () => {
    logout();
    navigate('/login');
  };

// 🟡 1. Charger les tâches une fois que user.email est prêt
useEffect(() => {
  if (user && user.email) {
    const stored = localStorage.getItem(`tasks-${user.email}`);
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setTasks(parsed);
      }
    } catch (err) {
      console.error('Erreur lecture des tâches :', err);
    }
    setIsLoaded(true); // ✅ Fin du chargement initial
  }
}, [user]);


  // 🟢 2. Sauvegarder les tâches à chaque changement
useEffect(() => {
  if (user && user.email && isLoaded) {
    localStorage.setItem(`tasks-${user.email}`, JSON.stringify(tasks));
  }
}, [tasks, user, isLoaded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;

    const task = {
      id: Date.now(),
      text: newTask,
      done: false,
      priority: priority,
      dueDate: dueDate,
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updated);
  };

  const handleDelete = (id) => {
  const updatedTasks = tasks.filter(task => task.id !== id);
  setTasks(updatedTasks);
};

const sortTasks = (tasks) => {
  const priorityOrder = { haute: 3, moyenne: 2, basse: 1 };

  let filtered = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortBy === 'priority') {
    filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }

  if (sortBy === 'date') {
    filtered.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }


  return filtered;
};

const isOverdue = (task) => {
  if (!task.dueDate || task.done) return false;
  return new Date(task.dueDate) < new Date();
};

const startEditing = (task) => {
  setEditingId(task.id);
  setEditValues({
    text: task.text,
    priority: task.priority,
    dueDate: task.dueDate,
  });
};

const saveEdit = () => {
  const updated = tasks.map((task) =>
    task.id === editingId
      ? { ...task, ...editValues }
      : task
  );
  setTasks(updated);
  setEditingId(null);
};

const cancelEdit = () => {
  setEditingId(null);
};


  return (
 
<div className={`${theme === 'dark' ? 'dark' : ''}`}>
  <div className="min-h-screen transition-colors duration-200  bg-white text-black dark:bg-gray-900 dark:text-white p-8">
       <div className="max-w-6xl mx-auto">
    <div className='flex flex-row space-x-4 space-x-2 justify-between items-center mb-8'>
  <button
  onClick={toggleTheme}
  className="transition-colors duration-200  px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:scale-105 transition "
>
  {theme === 'light' ? '🌙 Mode sombre' : '☀️ Mode clair'}
  </button>
  <button
    className=" transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md hover:scale-105 transition" onClick={handleLogout}>Déconnexion
  </button>
  </div>
    <div>
      <h1 className='text-center text-3xl mb-8'>Bienvenue, {user.email} !</h1>

<form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 md:gap-4 mt-4 ">
  <input
    type="text"
    placeholder="Ajouter une tâche"
    value={newTask}
    onChange={(e) => setNewTask(e.target.value)}
    className="transition-colors duration-200 px-4 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-3/4"
    required
  />

  <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
  >
    <option value="basse">Basse</option>
    <option value="moyenne">Moyenne</option>
    <option value="haute">Haute</option>
  </select>

  <input
    type="date"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
    className="transition-colors duration-200 px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
  />

  <button
    type="submit"
    className="transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
  >
    Ajouter
  </button>
</form>
<div style={{ marginTop: '20px' }}>
  <label style={{ marginRight: '10px' }}>Trier par :</label>
  <select  className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
 value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
    <option value="date">Date limite</option>
    <option value="priority">Priorité</option>
  </select>
</div>
<div style={{ marginTop: '20px'}}>
  
  <input
    type="text"
     className="transition-colors duration-200 px-4 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
    placeholder="Rechercher une tâche..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ width: '100%', padding: '8px' }}
  />
</div>
<h2 className="py-6  text-gray-500 dark:text-gray-400">Voici votre liste de tâches : </h2>
<ul className="mt-2 space-y-3">
  {sortTasks(tasks).map(task => (
    <li
  key={task.id}
  className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-md shadow-sm border-l-4
    ${task.priority === 'haute' ? 'border-red-500' :
      task.priority === 'moyenne' ? 'border-yellow-400' :
      'border-green-500'}
    ${isOverdue(task) ? ' bg-red-50 dark:bg-red-400/30' : 'bg-indigo-100 dark:bg-gray-800'}
  `}
>
  {editingId === task.id ? (
    <div className="flex flex-col md:flex-row gap-2 w-full">
      <input
        type="text"
        value={editValues.text}
        onChange={(e) => setEditValues({ ...editValues, text: e.target.value })}
        className="flex-1 px-3 py-2 rounded-md border bg-white text-black dark:bg-gray-800 dark:text-white"
      />
      <select
        value={editValues.priority}
        onChange={(e) => setEditValues({ ...editValues, priority: e.target.value })}
        className="px-3 py-2 rounded-md border bg-white text-black dark:bg-gray-800 dark:text-white"
      >
        <option value="basse">Basse</option>
        <option value="moyenne">Moyenne</option>
        <option value="haute">Haute</option>
      </select>
      <input
        type="date"
        value={editValues.dueDate}
        onChange={(e) => setEditValues({ ...editValues, dueDate: e.target.value })}
        className="px-3 py-2 rounded-md border bg-white text-black dark:bg-gray-800 dark:text-white"
      />
      <div className="flex gap-2">
        <button onClick={saveEdit} className="bg-indigo-400 text-white px-3 py-2 rounded-md">💾</button>
        <button onClick={cancelEdit} className="bg-gray-400 text-white px-3 py-2 rounded-md">❌</button>
      </div>
    </div>
  ) : (
    <>
      <div
        onClick={() => toggleTask(task.id)}
        className={`cursor-pointer flex-1 ${task.done ? 'line-through text-gray-400' : ''}`}
      >
        <p className="font-medium">{task.text}</p>
        <p className="text-sm italic text-gray-500 dark:text-gray-400 flex items-center gap-2">
          ({task.priority}) – {task.dueDate}
          {isOverdue(task) && (
            <span className="text-red-500 font-semibold animate-pulse">⚠️ En retard</span>
          )}
        </p>
      </div>
      <div className="flex gap-2 ml-4">
        <button onClick={() => startEditing(task)} className="text-blue-500 hover:text-blue-700">✏️</button>
        <button onClick={() => handleDelete(task.id)} className="text-red-500 hover:text-red-700">🗑</button>
      </div>
    </>
  )}
</li>
  ))}
</ul>

    </div>
   </div>
     </div>
     </div>
  );
}

export default HomePage;
