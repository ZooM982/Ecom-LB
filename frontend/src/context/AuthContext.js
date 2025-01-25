import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState(() => {
		const token = localStorage.getItem("token");
		const user = JSON.parse(localStorage.getItem("user"));
		return { token, user };
	});

	const onLogin = (token, user) => {
		setAuth({ token, user });
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
	};

	const onLogout = () => {
		setAuth({ token: null, user: null });
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	};

	const isAuthenticated = !!auth.token;

	return (
		<AuthContext.Provider value={{ auth, isAuthenticated, onLogin, onLogout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
