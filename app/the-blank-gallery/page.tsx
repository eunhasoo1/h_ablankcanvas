"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import NeedSmthMenu from '../components/NeedSmthMenu';
import Footer from '../components/Footer';

// Gallery item interface
interface GalleryItem {
  id: number;
  title: string;
  imageSrc: string;
  date: string;
  url: string;
}

export default function BlankGallery() {
  const [needSmthOpen, setNeedSmthOpen] = useState(false);
  
  // Gallery items
  const galleryItems: GalleryItem[] = [
    { id: 1, title: "CLOUD", imageSrc: "/image/gallery/cloud.png", date: "May 2025", url: "https://cloud-umber-one.vercel.app" },
  ];

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
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Navbar */}
      <Navbar toggleNeedSmth={toggleNeedSmth} needSmthOpen={needSmthOpen} />
      
      {/* Need Smth Menu */}
      <NeedSmthMenu isOpen={needSmthOpen} />
      
      {/* Main Content - Gallery Grid */}
      <main className="pt-20 md:pt-24 pb-32 w-full bg-white px-5 md:px-10 flex-grow">
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {galleryItems.map((item) => (
            <div key={item.id} className="flex flex-col mb-8">
              {/* Artwork preview */}
              <Link 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden cursor-pointer group relative">
                  {/* Shadow effect container */}
                  <div className="absolute inset-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:shadow-[0_8px_35px_rgba(0,0,0,0.16)] transition-shadow duration-300"></div>
                  
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 z-10 relative"
                  />
                </div>
              </Link>
              
              {/* Artwork title */}
              <div className="mt-1">
                <h2 className="text-base md:text-lg font-normal uppercase">{item.title}</h2>
                <p className="text-xs text-gray-500 ">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer fixed />
    </div>
  );
} 