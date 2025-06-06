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
    const [tag, setTag] = useState('perso');
  const [editValues, setEditValues] = useState({ text: '', priority: '', dueDate: '', tag: ''});
  const [filterTag, setFilterTag] = useState(''); // pour filtrer par tag
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDone, setFilterDone] = useState('all'); // 'all', 'done', 'todo'
  


useEffect(() => {
  setCurrentPage(1); // 🔁 quand on change la recherche
}, [searchTerm]);

useEffect(() => {
  setCurrentPage(1); // 🔁 quand on change le tri
}, [sortBy]);

useEffect(() => {
  setCurrentPage(1); // 🔁 quand on change le filtre par tag
}, [filterTag]);

useEffect(() => {
  setCurrentPage(1); // 🔁 quand on change le filtre par etat
}, [filterDone]);

// Charger les tâches une fois que user.email est prêt
useEffect(() => {
  if (user && user.email) {
    getTasks()
      .then((data) => {
        const userTasks = data.filter(t => t.email === user.email);
        setTasks(userTasks);
        console.log(userTasks, "Tâches de l'utilisateur :", user.email,  "Nombre tâches :", userTasks.length);
      
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

const toggleTask = async (id) => {
  const taskToToggle = tasks.find(task => task.id === id);
  if (!taskToToggle) return;

  const updatedTask = {
    ...taskToToggle,
    done: !taskToToggle.done,
  };

  try {
    await updateTask(updatedTask); 
    const updatedTasks = tasks.map(task =>
      task.id === id ? updatedTask : task
    );
    setTasks(updatedTasks);
  } catch (error) {
    console.error("Erreur mise à jour done :", error);
  }
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
  // 🔍 Filtrage par statut
if (filterDone === 'done') {
  filtered = filtered.filter(task => task.done);
} else if (filterDone === 'todo') {
  filtered = filtered.filter(task => !task.done);
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

const tasksPerPage = 5; 

const paginatedTasks = () => {
  const sorted = sortTasks(tasks);
  const start = (currentPage - 1) * tasksPerPage;
  const end = start + tasksPerPage;
  return sorted.slice(start, end);
};

const totalPages = Math.ceil(sortTasks(tasks).length / tasksPerPage);


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
    tag: task.tag || 'perso', // Assurez-vous que le tag est défini
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
      <div className='flex flex-row mb-8 justify-center space-x-4 space-y-2' ><img src="he.png" alt="bonjour" /><h1 className=' text-xl md:text-3xl '> {user.name || user.email} !</h1></div> 


<form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 md:gap-4 mt-4">
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
  className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none">
  <option value="perso">Perso</option>
  <option value="travail">Travail</option>
  <option value="urgent">Urgent</option>
</select>

  <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none">
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
    className="transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"  >
    Ajouter
  </button>
</form>

<div className="mt-5 ">
  <div className="flex flex-col md:flex-row items-center justify-center">
      <img src="tache.png" alt="liste des taches" />
      <h2 className="m-4 py-2 text-indigo-600 dark:text-indigo-200 font-font-semibold text-2xl ">Votre liste de tâches </h2> 
  </div>


  <input
    type="text"
     className="transition-colors duration-200 px-4 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 max-w-2xl"
    placeholder="Rechercher une tâche..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ width: '100%', padding: '8px' }}
  />
</div>
<div className='mb-8 mt-5 flex flex-col md:flex-row  gap-4 items-start md:items-center'>
<div className="mt-5">
   <label style={{ marginRight: '10px' }}>Afficher par :</label>
  <select
  value={filterTag}
  onChange={(e) => setFilterTag(e.target.value)}
  className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
>
  <option value="">Toutes les catégories</option>
  <option value="perso">Perso</option>
  <option value="travail">Travail</option>
  <option value="urgent">Urgent</option>
</select>

</div>
<div className="mt-5">
  <label style={{ marginRight: '10px' }}>Trier par :</label>
  <select  className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
 value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
    <option value="date">Date limite</option>
    <option value="priority">Priorité</option>
  </select>
</div>
<div className="mt-5">
  <label className="mr-2">État :</label>
  <select
    value={filterDone}
    onChange={(e) => setFilterDone(e.target.value)}
    className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
  >
    <option value="all">Toutes</option>
    <option value="done">Terminées</option>
    <option value="todo">À faire</option>
  </select>
</div>
</div>
   {tasks.length === 0 && (<h3 className="dark:text-gray-200 italic text-black text-lg font-medium text-center">Aucune tâche enregistrée 📝</h3> )}
<ul className="mt-2 space-y-3">
  {sortTasks(tasks).length === 0 && (
  <p className="text-center text-gray-500 dark:text-gray-200 italic text-lg font-medium mt-8 py-8">
    Aucune tâche ne correspond à vos filtres 🧐
  </p>
)}

{paginatedTasks().map(task => (
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

      <select
        value={editValues.tag}
        onChange={(e) => setEditValues({ ...editValues, tag: e.target.value })}
        className="px-3 py-2 rounded-md border bg-white text-black dark:bg-gray-800 dark:text-white"
      >
        <option value="perso">Perso</option>
        <option value="travail">Travail</option>
        <option value="urgent">Urgent</option>
      </select>

      <input
        type="date"
        value={editValues.dueDate}
        onChange={(e) => setEditValues({ ...editValues, dueDate: e.target.value })}
        className="px-3 py-2 rounded-md border bg-white text-black dark:bg-gray-800 dark:text-white"
      />
      
      <div className="flex gap-2  justify-center">
        <button onClick={saveEdit} className="bg-indigo-300 text-white px-2 py-1 rounded-md"><img src="enregistre.png" alt="chek" title='enregistrer'/></button>
        <button onClick={cancelEdit} className="bg-indigo-300 text-white px-2 py-1 rounded-md"> <img src="annuler.png" alt="annuler" title='annuler' /></button>
      </div>
    </div>
  ) : (
    <>
       <div className="flex-1">
  <p className={`font-medium ${task.done ? 'line-through text-gray-400' : ''}`}>
    {task.text}
  </p>
  <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded-full  ${task.tag === 'perso' ? 'bg-pink-500' :
      task.tag === 'travail' ? 'bg-blue-500' : task.tag === 'urgent' ? 'bg-red-500' : 'bg-gray-500'}`}>
  {task.tag}
</span>

  <p className="text-sm italic text-gray-500 dark:text-gray-400 flex items-center gap-2">
    ({task.priority}) – {task.dueDate}
    {task.done && <span className="text-indigo-500 dark:text-indigo-300 text-xs font-semibold"> ✓ Terminée</span>}
    {isOverdue(task) && !task.done && (
      <span className="text-red-500 font-semibold animate-pulse">En retard</span>
    )}
  </p>
</div>
      <div className="flex m-auto  gap-2 md:ml-4">
        <button onClick={() => toggleTask(task.id)} className={`px-0.5 py-0.5 rounded-md text-xs font-medium ${task.done ? 'bg-sky-600 text-indigo-200' : 'bg-pink-800 text-indigo-200' }`}>  {task.done ? 'Done' : 'Todo'}</button>
        <button onClick={() => startEditing(task)} className="text-blue-500 bg-indigo-300 text-white px-0.5 py-0.5 rounded-md  hover:text-blue-700"> <img src="crayon.png" title='Modifier' alt="Modifier" /></button>
        <button onClick={() => handleDelete(task.id)} className="text-red-500 bg-indigo-300 text-white px-0.5 py-0.5 rounded-md hover:text-red-700"> <img src="poubelle.png" title='Supprimer' alt="Supprimer" /></button>

      </div>
    </>
  )}
</li>
  ))}
</ul>
 <div className="flex justify-center mt-6 gap-2">
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
    <button
      key={num}
      onClick={() => setCurrentPage(num)}
      className={`px-3 py-1 rounded-md ${
        currentPage === num
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
      }`}
    >
      {num}
    </button>
  ))}
</div>

    </div>
   </div>
     </div>
     </div>
     
  );
  
}

export default HomePage;

