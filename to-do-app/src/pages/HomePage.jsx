import { useAuth } from '../auth/AuthContext';
import { useState, useEffect } from 'react';
import { getTasks, addTask, updateTask, deleteTask as deleteTaskAPI } from '../api';

function HomePage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('moyenne');
  const [dueDate, setDueDate] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'priority' ou 'date'
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null); // id de la tâche qu'on édite
  const [editValues, setEditValues] = useState({ text: '', priority: '', dueDate: '' });
  const [tag, setTag] = useState('perso');
  const [filterTag, setFilterTag] = useState(''); // pour filtrer par tag


// Charger les tâches une fois que user.email est prêt
useEffect(() => {
  if (user && user.email) {
    getTasks()
      .then((data) => {
        const userTasks = data.filter(t => t.email === user.email);
        setTasks(userTasks);
      })
      .catch((err) => console.error("Erreur chargement des tâches :", err));
  }
}, [user]);


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (newTask.trim() === '') return;

  const task = {

    text: newTask,
    done: false,
    priority: priority,
    dueDate: dueDate,
    tag, // pour filtrer par tag
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

  // ✅ Appliquer le filtre de tag avant tri
  if (filterTag) {
    filtered = filtered.filter(task => task.tag === filterTag);
  }

  // ✅ Trier selon la sélection
  if (sortBy === 'priority') {
    filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  } else if (sortBy === 'date') {
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

const cancelEdit = () => {
  setEditingId(null);
};


  return (
 
<div >
  <div className="min-h-screen transition-colors duration-200 md:mt-8 bg-white text-black dark:bg-gray-900 dark:text-white p-6 md:p-8">
       <div className="max-w-6xl mx-auto">

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
  value={tag}
  onChange={(e) => setTag(e.target.value)}
  className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
>
  <option value="perso">Perso</option>
  <option value="travail">Travail</option>
  <option value="urgent">Urgent</option>
</select>

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
<div>
  <select
  value={filterTag}
  onChange={(e) => setFilterTag(e.target.value)}
  className="mt-4 px-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white"
>
  <option value="">Toutes les catégories</option>
  <option value="perso">Perso</option>
  <option value="travail">Travail</option>
  <option value="urgent">Urgent</option>
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
        <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded-full  ${task.tag === 'perso' ? 'bg-pink-500' :
      task.tag === 'travail' ? 'bg-blue-500' : task.tag === 'urgent' ? 'bg-red-500' : 'bg-gray-500'}`}>
  {task.tag}
</span>
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
