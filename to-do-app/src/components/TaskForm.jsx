import React from 'react';

function TaskForm({
  newTask,
  priority,
  dueDate,
  tag,
  onChangeText,
  onChangePriority,
  onChangeDueDate,
  onChangeTag,
  onSubmit
}) {
  return (
    <form onSubmit={(e) => onSubmit(e)} className="flex flex-col md:flex-row gap-2 md:gap-4 mt-4">

      {/* Champ texte */}
      <input
        type="text"
        placeholder="Ajouter une tâche"
        value={newTask}
        onChange={(e) => onChangeText(e.target.value)}
        className="transition-colors duration-200 px-4 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 w-3/4"
  
      />

      {/* Sélecteur de tag */}
      <select
        value={tag}
        onChange={(e) => onChangeTag(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
      >
        <option value="perso">Perso</option>
        <option value="travail">Travail</option>
        <option value="urgent">Urgent</option>
      </select>

      {/* Sélecteur de priorité */}
      <select
        value={priority}
        onChange={(e) => onChangePriority(e.target.value)} 
        className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
      >
        <option value="basse">Basse</option>
        <option value="moyenne">Moyenne</option>
        <option value="haute">Haute</option>
      </select>

      {/* Date limite */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => onChangeDueDate(e.target.value)}
        className="transition-colors duration-200 px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />

      {/* Bouton Ajouter */}
      <button
        type="submit"
        className="transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
      >
        Ajouter
      </button>
    </form>
  );
}

export default TaskForm;
