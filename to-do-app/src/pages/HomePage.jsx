import { useAuth } from '../auth/AuthContext';
//import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTasks, addTask, updateTask, deleteTask as deleteTaskAPI } from '../api';

function HomePage() {
  const { user } = useAuth();
  //const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  //const [isLoaded, setIsLoaded] = useState(false);
  const [priority, setPriority] = useState('moyenne');
  const [dueDate, setDueDate] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'priority' ou 'date'
  const [searchTerm, setSearchTerm] = useState('');
  //const [theme, setTheme] = useState('light');
  const [editingId, setEditingId] = useState(null); // id de la tâche qu'on édite
  const [editValues, setEditValues] = useState({ text: '', priority: '', dueDate: '' });




/*useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  }
}, []);
  const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
};*/



  /*const handleLogout = () => {
    logout();
    navigate('/login');
  };*/

// Charger les tâches une fois que user.email est prêt
useEffect(() => {
  if (user && user.email) {
    getTasks()
      .then((data) => {
        const userTasks = data.filter(t => t.email === user.email);
        setTasks(userTasks);
        //setIsLoaded(true);
      })
      .catch((err) => console.error("Erreur chargement des tâches :", err));
  }
}, [user]);


  //  Sauvegarder les tâches à chaque changement
{/*useEffect(() => {
  if (user && user.email && isLoaded) {
    localStorage.setItem(`tasks-${user.email}`, JSON.stringify(tasks));
  }
}, [tasks, user, isLoaded]);*/}

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (newTask.trim() === '') return;

  const task = {

    text: newTask,
    done: false,
    priority: priority,
    dueDate: dueDate,
    email: user.email, // pour filtrer par utilisateur
  };

  try {
    const createdTask = await addTask(task);
    setTasks([...tasks, createdTask]);
    setNewTask('');
  } catch (error) {
    console.error("Erreur ajout tâche :", error);
  }
};

  const toggleTask = (id) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updated);
  };

const handleDelete = async (id) => {
  try {
    await deleteTaskAPI(id);
    const updated = tasks.filter(task => task.id !== id);
    setTasks(updated);
  } catch (error) {
    console.error("Erreur suppression tâche :", error);
  }
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

const saveEdit = async () => {
  try {
    const editedTask = {
      id: editingId,
      ...editValues,
      email: user.email,
    };
    await updateTask(editedTask);
    const updated = tasks.map((task) =>
      task.id === editingId ? editedTask : task
    );
    setTasks(updated);
    setEditingId(null);
  } catch (err) {
    console.error("Erreur édition :", err);
  }
};
/*const saveEdit = () => {
  const updated = tasks.map((task) =>
    task.id === editingId
      ? { ...task, ...editValues }
      : task
  );
  setTasks(updated);
  setEditingId(null);
};*/

const cancelEdit = () => {
  setEditingId(null);
};


  return (
 
<div >
  <div className="min-h-screen transition-colors duration-200 md:mt-8 bg-white text-black dark:bg-gray-900 dark:text-white p-6 md:p-8">
       <div className="max-w-6xl mx-auto">
  { /* <div className='flex flex-row space-x-4 space-x-2 justify-between items-center mb-8'>*/}
 {/* <button
  onClick={toggleTheme}
  className="transition-colors duration-200  px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:scale-105 transition "
>
  {theme === 'light' ? '🌙 Mode sombre' : '☀️ Mode clair'}
  </button>*/}

{  /*<button
    className=" transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md hover:scale-105 transition" onClick={handleLogout}>Déconnexion
  </button>*/}
  {/*</div>*/}
    <div>
      <h1 className='text-center text-xl md:text-3xl mb-8'> Bonjour, {user.name || user.email} 👋 !</h1>


<form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 md:gap-4 mt-4 ">
  <input
    type="text"
    placeholder="Ajouter une tâche"
    value={newTask}
    onChange={(e) => setNewTask(e.target.value)}
    className="transition-colors duration-200 px-4 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 w-3/4"
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
<div className="mt-5">
  <label style={{ marginRight: '10px' }}>Trier par :</label>
  <select  className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
 value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
    <option value="date">Date limite</option>
    <option value="priority">Priorité</option>
  </select>
</div>
<div className="mt-5">
  
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
   {tasks.length === 0 && (<h3 className="dark:text-gray-200 italic text-black text-lg font-medium text-center">Aucune tâche enregistrée 📝</h3> )}
<ul className="mt-2 space-y-3">
  {sortTasks(tasks).map(task => (
    
    <li
  key={task.id}
  className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-md shadow-sm border-l-4
    ${task.priority === 'haute' ? 'border-red-500' :
      task.priority === 'moyenne' ? 'border-yellow-400' :
      'border-green-500'}
    ${isOverdue(task) ? ' bg-red-50 dark:bg-red-300/30' : 'bg-indigo-100 dark:bg-gray-800'}
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
      <div className="flex gap-2  justify-center">
        <button onClick={saveEdit} className="bg-indigo-300 text-white px-2 py-1 rounded-md"><img src="enregistre.png" alt="" /></button>
        <button onClick={cancelEdit} className="bg-indigo-300 text-white px-2 py-1 rounded-md"> <img src="annuler.png" alt="" /></button>
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
            <span className="text-red-500 font-semibold animate-pulse"> En retard</span>
          )}
        </p>
      </div>
      <div className="flex m-auto  gap-2 md:ml-4">
        <button onClick={() => startEditing(task)} className="text-blue-500 bg-indigo-300 text-white px-2 py-1 rounded-md  hover:text-blue-700"> <img src="crayon.png" alt="Modifier" /></button>
        <button onClick={() => handleDelete(task.id)} className="text-red-500 bg-indigo-300 text-white px-2 py-1 rounded-md hover:text-red-700"> <img src="poubelle.png" alt="Supprimer" /></button>
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
