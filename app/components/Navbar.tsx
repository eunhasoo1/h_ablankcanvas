import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Instagram, Youtube } from 'lucide-react';

interface NavbarProps {
  toggleNeedSmth?: () => void;
  needSmthOpen?: boolean;
}

export default function Navbar({ toggleNeedSmth, needSmthOpen }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (needSmthOpen && toggleNeedSmth) toggleNeedSmth();
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-600">
        <div className="flex justify-between items-center px-5 py-3 w-full">
          <div className="flex-shrink-0">
            {/* Logo */}
            <Link href="/" className="text-lg md:text-xl font-bold">
              <div className="leading-none">
                <div>HA-</div>
                <div>EUN</div>
              </div>
            </Link>
          </div>
          
          {/* Center Nav Items - Centered */}
          <nav className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 gap-8">
            <Link href="/" className="uppercase text-sm font-normal hover:text-gray-500 transition-colors">
              HOME
            </Link>
            <Link href="/the-blank-gallery" className="uppercase text-sm font-normal hover:text-gray-500 transition-colors">
              THE BLANK GALLERY
            </Link>
            <button 
              onClick={toggleNeedSmth || toggleMenu}
              className="uppercase text-sm font-normal hover:text-gray-500 transition-colors background-transparent border-none cursor-pointer"
            >
              NEED SMTH?
            </button>
          </nav>
                
          {/* Mobile menu button */}
          <button 
            className="uppercase text-xs font-light flex items-center gap-2 flex-shrink-0"
            onClick={needSmthOpen !== undefined ? (needSmthOpen ? toggleNeedSmth : toggleMenu) : toggleMenu}
            aria-label={menuOpen || needSmthOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen || needSmthOpen ? (
              <>
                Close <X size={14} />
              </>
            ) : (
              <>
                Menu <Menu size={14} />
              </>
            )}
          </button>
        </div>
      </header>
      
      {/* Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-40 transition-transform duration-500 ease-in-out transform ${
          menuOpen ? 'translate-y-0' : '-translate-y-full'
        } overflow-y-auto`}
        style={{ paddingTop: 'calc(1rem + 42px)' }}
      >
        <div className="max-w-full px-5 py-10">
          
          <nav className="space-y-14 mb-20">
            <Link 
              href="/" 
              className="block group"
              onClick={() => setMenuOpen(false)}
            >
              <h3 className="text-2xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
                HOME
              </h3>
            </Link>
            
            <Link 
              href="/the-blank-gallery" 
              className="block group"
              onClick={() => setMenuOpen(false)}
            >
              <h3 className="text-2xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
                THE BLANK GALLERY
              </h3>
            </Link>
            
            <button 
              onClick={toggleNeedSmth || toggleMenu}
              className="block group w-full text-left border-none bg-transparent"
            >
              <h3 className="text-2xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
                NEED SMTH?
              </h3>
            </button>
          </nav>
          
          <div className="pt-8">
            <div className="flex items-center gap-4">
              <Link 
                href="https://www.instagram.com/h_ablankcanvas/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Link>
              <Link 
                href="https://www.youtube.com/@h_ablankcanvas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 