import { useAuth } from '../auth/AuthContext';
import { useState, useEffect } from 'react';
import { getTasks, addTask, updateTask, deleteTask as deleteTaskAPI } from '../api';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import Pagination from '../components/Pagination';
import TaskItem from '../components/TaskItem';

function HomePage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('moyenne');
  const [dueDate, setDueDate] = useState('');
  const [tag, setTag] = useState('perso');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterDone, setFilterDone] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ text: '', priority: '', dueDate: '', tag: '' });
  const [error, setError] = useState('');


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, filterTag, filterDone]);

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
  console.log('Form submitted'); 

  // Validation stricte AVANT d'aller plus loin
  const isTextValid = newTask.trim() !== '';
  const isDateValid = dueDate !== '';

  if (!isTextValid || !isDateValid) {
    setError("⚠️ Le champ texte *et* la date limite sont obligatoires.");
    return; // STOP ici
  }
  setError('');

  const task = {
    text: newTask,
    done: false,
    priority,
    dueDate,
    tag,
    email: user.email,
  };
  await addTask(task);
  try {
    const createdTask = await addTask(task);
    setTasks([...tasks, createdTask]);
    setNewTask('');
    setDueDate('');
    setPriority('moyenne');
    setTag('perso');
  } catch (error) {
    console.error("Erreur ajout tâche :", error);
    setError("Erreur lors de l'ajout de la tâche.");
  }
};



  const toggleTask = async (id) => {
    const taskToToggle = tasks.find(task => task.id === id);
    if (!taskToToggle) return;
    const updatedTask = { ...taskToToggle, done: !taskToToggle.done };
    try {
      await updateTask(updatedTask);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (error) {
      console.error("Erreur mise à jour done :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTaskAPI(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Erreur suppression tâche :", error);
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditValues({
      text: task.text,
      priority: task.priority,
      dueDate: task.dueDate,
      tag: task.tag || 'perso',
    });
  };

  const saveEdit = async () => {
    try {
      const editedTask = { id: editingId, ...editValues, email: user.email };
      await updateTask(editedTask);
      setTasks(tasks.map(task => task.id === editingId ? editedTask : task));
      setEditingId(null);
    } catch (err) {
      console.error("Erreur édition :", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.done) return false;
    return new Date(task.dueDate) < new Date();
  };

  const sortTasks = (tasks) => {
    const priorityOrder = { haute: 3, moyenne: 2, basse: 1 };
    let filtered = tasks.filter(task =>
      task.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterTag) filtered = filtered.filter(task => task.tag === filterTag);
    if (filterDone === 'done') filtered = filtered.filter(task => task.done);
    else if (filterDone === 'todo') filtered = filtered.filter(task => !task.done);
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

  const paginatedTasks = () => {
    const sorted = sortTasks(tasks);
    const start = (currentPage - 1) * 5;
    return sorted.slice(start, start + 5);
  };

  const totalPages = Math.ceil(sortTasks(tasks).length / 5);

  return (
    <div className="min-h-screen transition-colors duration-200 md:mt-8 bg-white text-black dark:bg-gray-900 dark:text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-row mb-8 justify-center space-x-4 space-y-2">
          <img src="he.png" alt="bonjour" />
          <h1 className="text-xl md:text-3xl">{user.name || user.email} !</h1>
        </div>

        {/* Formulaire d'ajout */}
        <TaskForm
          newTask={newTask}
          onChangeText={(value) => {
           setNewTask(value);
           setError('');
      }}
          tag={tag}
          onChangeTag={setTag}
          priority={priority}
          onChangePriority={setPriority}
          dueDate={dueDate}
         onChangeDueDate={(value) => {
          setDueDate(value);
          setError('');
         }}
          onSubmit={handleSubmit}
        />
{error && (
  <div className=" text-red-600 text-xs md:text-base mt-4 mb-4 font-medium animate-pulse">
    {error}
  </div>
)}
    {/* Filtres */}
        <TaskFilters
          filterTag={filterTag}
          onChangeFilterTag={setFilterTag}
          sortBy={sortBy}
          onChangeSortBy={setSortBy}
          filterDone={filterDone}
          onChangeFilterDone={setFilterDone}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Liste des tâches */}
        <ul className="mt-2 space-y-3">
          {tasks.length === 0 ? (
            <p className="dark:text-gray-200 italic text-black text-lg font-medium text-center">
              Aucune tâche enregistrée 📝
            </p>
          ) : sortTasks(tasks).length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-200 italic text-lg font-medium mt-8 py-8">
              Aucune tâche ne correspond à vos filtres 🧐
            </p>
          ) : (
            paginatedTasks().map(task => (
              <TaskItem
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                editValues={editValues}
                onChangeEdit={setEditValues}
                onToggle={toggleTask}
                onEdit={() => startEditing(task)}
                onDelete={() => handleDelete(task.id)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                isOverdue={isOverdue}
              />
            ))
          )}
        </ul>

        {/* Pagination */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default HomePage;
