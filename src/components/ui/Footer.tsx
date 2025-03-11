import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-black/90 border-t border-gray-800 py-6 mt-auto"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo e Copyright */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-[#E50914] font-bold text-xl">
              CINEPLAY
            </Link>
            <span className="text-gray-400 text-sm">
              © {currentYear} Todos os direitos reservados
            </span>
          </div>

          {/* Links Centrais */}
          <div className="flex items-center space-x-6">
            <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
              Sobre
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacidade
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Termos
            </Link>
            <Link to="/help" className="text-gray-400 hover:text-white text-sm transition-colors">
              Ajuda
            </Link>
          </div>

          {/* Redes Sociais */}
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}; 