import React from 'react';
import { MdShoppingCart } from "react-icons/md";

const CartIcon = ({ cartItems }) => {
  return (
    <div className="relative">
      <MdShoppingCart />
      {cartItems.length > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
          {cartItems.reduce((total, item) => total + item.quantity, 0)} 
        </span>
      )}
    </div>
  );
};

export default CartIcon;
