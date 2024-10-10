import React from 'react';
import { Link } from 'react-router-dom';
import { CiLogin } from "react-icons/ci";

const Header = ({ toggleCart }) => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link to="/">Logo</Link>
        </div>
        <div>
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/men" className="mr-4">Men</Link>
          <Link to="/women" className="mr-4">Women</Link>
          <Link to="/kids" className="mr-4">Kids</Link>
          <Link to="/accessories" className="mr-4">Accessories</Link>
          <Link to="/sale" className="mr-4">Sale</Link>
        </div>
        <button onClick={toggleCart} className="bg-blue-500 text-white py-2 px-4 rounded">Cart</button>
        <Link to="login"><span className='text-[25px] '><CiLogin /></span> </Link>
      </nav>
    </header>
  );
};

export default Header;
