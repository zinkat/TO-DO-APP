export const getTasks = async () => {
  const res = await fetch('http://localhost:3001/tasks');
  return res.json();
};

export const addTask = async (task) => {
  const res = await fetch('http://localhost:3001/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
};
export const updateTask = async (task) => {
  const res = await fetch(`http://localhost:3001/tasks/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
};
export const deleteTask = async (id) => {
  await fetch(`http://localhost:3001/tasks/${id}`, {
    method: 'DELETE',
  });
};
// Rechercher un utilisateur par email
/*export const findUserByEmail = async (email) => {
  const res = await fetch(`http://localhost:3001/users?email=${email}`);
  return res.json(); // retourne un tableau
};*/

// Créer un nouvel utilisateur
/*export const registerUser = async (email, name) => {
  const res = await fetch('http://localhost:3001/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
  return res.json();
};*/
