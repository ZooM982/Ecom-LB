import React from 'react';
import { Link } from 'react-router-dom';
import { CiLogin } from "react-icons/ci";
import { MdShoppingCart } from "react-icons/md";

const Header = ({ toggleCart }) => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto md:flex justify-between items-center text-center">
        <div className="text-lg font-bold">
          <Link to="/">Logo</Link>
        </div>
        <div className=''>
          <Link to="/" className="mx-[5px]">Home</Link>
          <Link to="/men" className="mx-[5px]">Men</Link>
          <Link to="/women" className="mx-[5px]">Women</Link>
          <Link to="/kids" className="mx-[5px]">Kids</Link>
          <Link to="/accessories" className="mx-[5px]">Accessories</Link>
          <Link to="/sale" className="mx-[5px]">Sale</Link>
        </div>
        <div className='flex justify-between md:w-[80px] text-[25px] text-white me-[10px]'>
        <button onClick={toggleCart} className=""><span><MdShoppingCart/></span></button>
        <Link to="/login"><span className=''><CiLogin /></span> </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
