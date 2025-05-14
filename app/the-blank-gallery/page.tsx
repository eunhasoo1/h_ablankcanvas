"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import NeedSmthMenu from '../components/NeedSmthMenu';
import Footer from '../components/Footer';

export default function BlankGallery() {
  const [needSmthOpen, setNeedSmthOpen] = useState(false);

  useEffect(() => {
    // Prevent scroll when needSmth is open
    if (needSmthOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [needSmthOpen]);

  const toggleNeedSmth = () => {
    setNeedSmthOpen(!needSmthOpen);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <Navbar toggleNeedSmth={toggleNeedSmth} needSmthOpen={needSmthOpen} />
      
      {/* Need Smth Menu */}
      <NeedSmthMenu isOpen={needSmthOpen} />
      
      {/* Main Content - Under Construction */}
      <main className="pb-16 w-full h-screen flex items-center justify-center bg-white">
        <h1 className="text-black text-4xl md:text-6xl uppercase font-normal px-5">
          Under Construction
        </h1>
      </main>

      {/* Footer */}
      <Footer fixed />
    </div>
  );
} 