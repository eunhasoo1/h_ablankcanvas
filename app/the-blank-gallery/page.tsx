"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Instagram, Youtube } from 'lucide-react';

export default function BlankGallery() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
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
              onClick={toggleMenu}
              className="uppercase text-sm font-normal hover:text-gray-500 transition-colors background-transparent border-none cursor-pointer"
            >
              NEED
            </button>
          </nav>
                
          {/* Mobile menu button */}
          <button 
            className="uppercase text-xs font-light flex items-center gap-2 flex-shrink-0"
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
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
          <h2 className="uppercase text-sm mb-12 font-light text-gray-500">
            WHAT DO YOU NEED?
          </h2>
          
          <nav className="space-y-14 mb-20">
            <Link 
              href="https://www.youtube.com/@h_ablankcanvas" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block group"
            >
              <h3 className="text-4xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
                PROCESS VIDEOS
              </h3>
              <p className="text-sm font-light text-gray-600">
                My workflow, from start to finish.
              </p>
            </Link>
            
            <Link 
              href="https://bit.ly/4dDyZvR" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block group"
            >
              <h3 className="text-4xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
                ANIMATION COURSE
              </h3>
              <p className="text-sm font-light text-gray-600">
                Your characters, brought to life
              </p>
            </Link>
            
            <Link 
              href="https://chatflix.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block group"
            >
              <h3 className="text-4xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
                MY GO-TO AI
              </h3>
              <p className="text-sm font-light text-gray-600">
                The ultimate LLM collection
              </p>
            </Link>
          </nav>
          
          <div className="border-t border-gray-200 pt-8">
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
      
      {/* Main Content - Under Construction */}
      <main className="pb-16 w-full h-screen flex items-center justify-center bg-white">
        <h1 className="text-black text-4xl md:text-6xl uppercase font-normal px-5">
          Under Construction
        </h1>
      </main>

      {/* Footer - Full Width */}
      <footer className="fixed bottom-0 left-0 w-full border-t border-gray-200 py-8 px-5 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex gap-6 mb-4 md:mb-0">
            <Link 
              href="https://www.instagram.com/h_ablankcanvas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-500 transition-colors text-xs uppercase"
            >
              Instagram
            </Link>
            <Link 
              href="https://www.youtube.com/@h_ablankcanvas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-500 transition-colors text-xs uppercase"
            >
              YouTube
            </Link>
          </div>
          
          <div className="text-xs text-gray-500 font-light">
            © {new Date().getFullYear()} HA-EUN. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 