// src/components/Footer.jsx
import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-400">
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-2 md:mb-0">
          © {currentYear} SMKS Muhammadiyah Satui. All Rights Reserved.
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-white transition-colors"><FaFacebook size={20} /></a>
          <a href="#" className="hover:text-white transition-colors"><FaInstagram size={20} /></a>
          <a href="#" className="hover:text-white transition-colors"><FaYoutube size={20} /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;