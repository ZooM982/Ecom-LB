// src/components/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";


const Login = () => {
  const [username, setUsername] = useState(""); // Change 'username' en 'email'
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await loginUser(username, password); // Reçois le user en plus du token
      
      // Stockez le token et l'utilisateur dans le localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Vérifie le rôle de l'utilisateur
      if (user.role === "admin") {
        navigate("/dashboard"); // Rediriger vers le tableau de bord admin
      } else {
        navigate("/"); // Rediriger vers le tableau de bord utilisateur
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la connexion.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Se connecter</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>{" "}
            {/* Change 'Nom d'utilisateur' en 'Email' */}
            <input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Se connecter
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Pas de compte ?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
