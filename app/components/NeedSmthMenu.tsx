import React from 'react';
import Link from 'next/link';
import { Instagram, Youtube } from 'lucide-react';

interface NeedSmthMenuProps {
  isOpen: boolean;
}

export default function NeedSmthMenu({ isOpen }: NeedSmthMenuProps) {
  return (
    <div 
      className={`fixed inset-0 bg-white z-40 transition-transform duration-500 ease-in-out transform ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      } overflow-y-auto`}
      style={{ paddingTop: 'calc(1rem + 42px)' }}
    >
      <div className="max-w-full px-5 py-10">
        <h2 className="text-sm mb-12 font-light text-gray-500">
          What do you need?
        </h2>
        
        <nav className="space-y-14 mb-20">
          <Link 
            href="https://www.youtube.com/@h_ablankcanvas" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block group"
          >
            <h3 className="text-2xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
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
            <h3 className="text-2xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
              ANIMATION COURSE (KR)
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
            <h3 className="text-2xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
              MY GO-TO AI
            </h3>
            <p className="text-sm font-light text-gray-600">
              The ultimate LLM collection
            </p>
          </Link>
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
  );
} 