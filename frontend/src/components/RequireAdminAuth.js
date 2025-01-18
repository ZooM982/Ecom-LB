import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAdminAuth = ({ children }) => {
	const { auth } = useAuth();

	if (!auth.user || auth.user.role !== "admin") {
		return <Navigate to="/login" />;
	}

	return children;
};

export default RequireAdminAuth;
