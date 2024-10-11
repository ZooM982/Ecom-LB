import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageUsers.css'; // Import des styles

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',  // Remplacement de 'name' par 'username'
    email: '',
    password: '',
    role: 'user',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://ecom-lb.onrender.com/api/users');
        console.log('Utilisateurs récupérés :', response.data);  // Vérification de la réponse
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ecom-lb.onrender.com/api/users/register', newUser);
      alert('Utilisateur ajouté !');
      setUsers([...users, response.data.user]);  // Ajout de la réponse au tableau d'utilisateurs
      setNewUser({ username: '', email: '', password: '', role: 'user' });
    } catch (error) {
      console.error(error);
      alert(`Erreur lors de l'ajout de l'utilisateur : ${error.response?.data?.message || 'Erreur inconnue'}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    console.log('ID utilisateur à supprimer :', userId);  // Vérification de l'ID
    try {
      await axios.delete(`https://ecom-lb.onrender.com/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      alert('Utilisateur supprimé !');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="manage-users">
      <h2>Gestion des utilisateurs</h2>
      <form onSubmit={handleAddUser} className="user-form">
        <input
          type="text"
          placeholder="Nom de l'utilisateur"
          value={newUser.username}  // Utilisation de 'username'
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          required
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
          className="input-field"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="input-field"
        >
          <option value="user">Utilisateur</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="add-user-button">Ajouter utilisateur</button>
      </form>

      <h3>Liste des utilisateurs</h3>
      <ul className="user-list">
        {users.map(user => (
          <li key={user._id} className="user-item">
            <div>
              <strong>{user.username}</strong> <br />
              {user.email} - <span className="role-label">{user.role}</span>
            </div>
            <button
              onClick={() => handleDeleteUser(user._id)}
              className="delete-button"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
