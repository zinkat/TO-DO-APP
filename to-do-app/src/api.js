import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';

// Lire les tâches pour un utilisateur
export const getTasks = async (email) => {
  const q = query(collection(db, 'tasks'), where('email', '==', email));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

//  Ajouter une tâche
export const addTask = async (task) => {
  const docRef = await addDoc(collection(db, 'tasks'), task);
  return { id: docRef.id, ...task };
};

//  Mettre à jour une tâche
export const updateTask = async (task) => {
  const { id, ...data } = task;
  const ref = doc(db, 'tasks', id); 
  await updateDoc(ref, data);
};

//  Supprimer une tâche
export const deleteTask = async (id) => {
  await deleteDoc(doc(db, 'tasks', id));
};

///api.js json server version
/*export const getTasks = async () => {
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
};*/
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
