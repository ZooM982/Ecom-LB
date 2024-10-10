import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-6">
      <div className="container mx-auto flex justify-between">
        <p>&copy; 2024 Clothing Store. All rights reserved.</p>
        <nav className="space-x-6">
          <a href="/" className="hover:text-gray-400">Privacy Policy</a>
          <a href="/" className="hover:text-gray-400">Terms of Service</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
