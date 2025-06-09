import React from 'react';

function TaskItem({
  task,
  isEditing,
  editValues,
  onChangeEdit,
  onSave,
  onCancel,
  onToggle,
  onEdit,
  onDelete,
  isOverdue
}) {
  return (
    <li
      className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-md shadow-sm border-l-4
        ${task.priority === 'haute' ? 'border-red-500' :
          task.priority === 'moyenne' ? 'border-yellow-400' : 'border-green-500'}
        ${isOverdue(task) ? ' bg-red-50 dark:bg-red-300/30' : 'bg-indigo-100 dark:bg-gray-800'}
      `}
    >
      {isEditing ? (
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <input
            type="text"
            value={editValues.text}
            onChange={(e) => onChangeEdit({ ...editValues, text: e.target.value })}
            className="flex-1 px-3 py-2 rounded-md border bg-white text-black dark:bg-gray-800 dark:text-white"
          />
          <select
            value={editValues.priority}
            onChange={(e) => onChangeEdit({ ...editValues, priority: e.target.value })}
            className="px-3 py-2 rounded-md border bg-white text-black dark:bg-gray-800 dark:text-white"
          >
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>

          <select
            value={editValues.tag}
            onChange={(e) => onChangeEdit({ ...editValues, tag: e.target.value })}
            className="px-3 py-2 rounded-md border bg-white text-black dark:bg-gray-800 dark:text-white"
          >
            <option value="perso">Perso</option>
            <option value="travail">Travail</option>
            <option value="urgent">Urgent</option>
          </select>

          <input
            type="date"
            value={editValues.dueDate}
            onChange={(e) => onChangeEdit({ ...editValues, dueDate: e.target.value })}
            className="px-3 py-2 rounded-md border bg-white text-black dark:bg-gray-800 dark:text-white"
          />

          <div className="flex gap-2 justify-center">
            <button onClick={onSave} className="bg-indigo-300 text-white px-2 py-1 rounded-md">
              <img src="enregistre.png" alt="enregistrer" title="enregistrer" />
            </button>
            <button onClick={onCancel} className="bg-indigo-300 text-white px-2 py-1 rounded-md">
              <img src="annuler.png" alt="annuler" title="annuler" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1">
            <p className={`font-medium ${task.done ? 'line-through text-gray-400' : ''}`}>
              {task.text}
            </p>
            <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded-full ${task.tag === 'perso'
              ? 'bg-pink-500'
              : task.tag === 'travail'
                ? 'bg-blue-500'
                : task.tag === 'urgent'
                  ? 'bg-red-500'
                  : 'bg-gray-500'}`}>
              {task.tag}
            </span>

            <p className="text-sm italic text-gray-500 dark:text-gray-400 flex items-center gap-2">
              ({task.priority}) – {task.dueDate}
              {task.done && (
                <span className="text-indigo-500 dark:text-indigo-300 text-xs font-semibold">
                  ✓ Terminée
                </span>
              )}
              {isOverdue(task) && !task.done && (
                <span className="text-red-500 font-semibold animate-pulse">
                  En retard
                </span>
              )}
            </p>
          </div>

          <div className="flex m-auto gap-2 md:ml-4">
            <button
              onClick={() => onToggle(task.id)}
              className={`px-0.5 py-0.5 rounded-md text-xs font-medium ${task.done
                ? 'bg-sky-600 text-indigo-200'
                : 'bg-pink-800 text-indigo-200'}`}
            >
              {task.done ? 'Done ✓' : 'Todo'}
            </button>
            <button
              onClick={() => onEdit(task)}
              className="text-blue-500 bg-indigo-300 text-white px-0.5 py-0.5 rounded-md hover:text-blue-700"
            >
              <img src="crayon.png" title="Modifier" alt="Modifier" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-500 bg-indigo-300 text-white px-0.5 py-0.5 rounded-md hover:text-red-700"
            >
              <img src="poubelle.png" title="Supprimer" alt="Supprimer" />
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TaskItem;
