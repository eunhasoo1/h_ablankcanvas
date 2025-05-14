import React from 'react';
import Link from 'next/link';

interface FooterProps {
  fixed?: boolean;
}

export default function Footer({ fixed = false }: FooterProps) {
  return (
    <footer className={`${fixed ? 'fixed bottom-0 left-0' : ''} w-full border-t border-gray-600 py-8 px-5 ${fixed ? 'bg-white' : ''}`}>
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
          © {new Date().getFullYear()} HABLANKCANVAS. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 