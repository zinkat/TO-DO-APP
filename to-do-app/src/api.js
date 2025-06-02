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
export const login = async (email) => {
  const res = await fetch('http://localhost:3001/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
};
export const register = async (email) => {
  const res = await fetch('http://localhost:3001/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
};


/*export const getUser = async (email) => {
  const res = await fetch(`http://localhost:3001/users/${email}`);
  return res.json();
};
export const updateUser = async (user) => {
  const res = await fetch(`http://localhost:3001/users/${user.email}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return res.json();
};
export const getAllUsers = async () => {
  const res = await fetch('http://localhost:3001/users');
  return res.json();
};
export const deleteUser = async (email) => {
  await fetch(`http://localhost:3001/users/${email}`, {
    method: 'DELETE',
  });
};

export const getTasksByUser = async (email) => {
  const res = await fetch(`http://localhost:3001/tasks?email=${email}`);
  return res.json();
};
export const getTaskById = async (id) => {
  const res = await fetch(`http://localhost:3001/tasks/${id}`);
  return res.json();
};
export const getTasksByPriority = async (priority) => {
  const res = await fetch(`http://localhost:3001/tasks?priority=${priority}`);
  return res.json();
};
export const getTasksByDueDate = async (dueDate) => {
  const res = await fetch(`http://localhost:3001/tasks?dueDate=${dueDate}`);
  return res.json();
};
export const getTasksBySearchTerm = async (searchTerm) => {
  const res = await fetch(`http://localhost:3001/tasks?text_like=${searchTerm}`);
  return res.json();
};
export const getTasksBySort = async (sortBy) => {
  const res = await fetch(`http://localhost:3001/tasks?_sort=${sortBy}&_order=asc`);
  return res.json();
};
export const getTasksByUserAndPriority = async (email, priority) => {
  const res = await fetch(`http://localhost:3001/tasks?email=${email}&priority=${priority}`);
  return res.json();
};
export const getTasksByUserAndDueDate = async (email, dueDate) => {
  const res = await fetch(`http://localhost:3001/tasks?email=${email}&dueDate=${dueDate}`);
  return res.json();
};
export const getTasksByUserAndSearchTerm = async (email, searchTerm) => {
  const res = await fetch(`http://localhost:3001/tasks?email=${email}&text_like=${searchTerm}`);
  return res.json();
};
export const getTasksByUserAndSort = async (email, sortBy) => {
  const res = await fetch(`http://localhost:3001/tasks?email=${email}&_sort=${sortBy}&_order=asc`);
  return res.json();
};*/
