import React from 'react';

function TaskFilters({
  filterTag,
  sortBy,
  filterDone,
  searchTerm,
  onChangeFilterTag,
  onChangeSortBy,
  onChangeFilterDone,
  onSearchChange
}) {
  return (
    <div className="mb-8 mt-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
      {/* Filtrer par catégorie */}
      <select
        value={filterTag}
        onChange={(e) => onChangeFilterTag(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
      >
        <option value="">Toutes les catégories</option>
        <option value="perso">Perso</option>
        <option value="travail">Travail</option>
        <option value="urgent">Urgent</option>
      </select>

      {/* Trier par */}
      <select
        value={sortBy}
        onChange={(e) => onChangeSortBy(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
      >
        <option value="date">Date limite</option>
        <option value="priority">Priorité</option>
      </select>

      {/* État (terminée ou à faire) */}
      <select
        value={filterDone}
        onChange={(e) => onChangeFilterDone(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
      >
        <option value="all">Toutes</option>
        <option value="done">Terminées</option>
        <option value="todo">À faire</option>
      </select>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="🔍 Rechercher une tâche..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)} 
        className="transition-colors duration-200 px-4 py-2 rounded-md border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 max-w-2xl"
      />
    </div>
  );
}

export default TaskFilters;
// This component provides filters for tasks, allowing users to filter by category, sort by date or priority, filter by completion status, and search for tasks by text input.


