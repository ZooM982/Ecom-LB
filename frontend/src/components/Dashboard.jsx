import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import ManageProducts from '../Dashboard/ManageProducts';
import ManageUsers from '../Dashboard/ManageUsers'; 

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <ul className='flex justify-between w-[50%] mx-auto'>
          <li className='h-[50px] w-[40%] py-2 text-center'><Link to="/dashboard/products">Gérer les produits</Link></li>
          <li className='h-[50px] w-[40%] py-2 text-center'><Link to="/dashboard/users">Gérer les utilisateurs</Link></li>
        </ul>
      </aside>
      <main className="dashboard-content">
        <Routes>
          <Route path="products" element={<ManageProducts />} />
          <Route path="users" element={<ManageUsers />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
