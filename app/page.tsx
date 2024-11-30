"use client"

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Coffee } from 'lucide-react';
import { Instagram, Youtube } from 'lucide-react';
import { ReactNode } from 'react';

interface SocialMediaItem {
  id: string;
  title: string;
  url: string;
  icon: ReactNode;
}

export default function Home() {
  return (
    <div className="font-helvetica w-full flex flex-col min-h-dvh pb-4 p-5 pt-0 overflow-x-hidden">
      <div className="flex flex-col items-center w-full py-8 cursor-default">
        <a href="/ablankcanvas" className="flex items-center text-center cursor-default
          font-marydale  
          uppercase 
          text-4xl
          md:text-6xl
          font-bold">
          A Blank Canvas
        </a>
      </div>

      <div className="flex-1 flex flex-col w-full">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl mx-auto">
          {/* Left Side - Wake The Dead */}
          <div className="flex">
            <Link href="https://wakethedead.ai" target="_blank" className="w-full">
              <div className="relative flex flex-col h-full overflow-hidden rounded-3xl group">
                <img
                  src="/image/wtd.png"
                  alt="Wake The Dead"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-0 left-0 w-full h-full flex flex-col text-white py-3 px-4 md:py-4 md:px-5 pr-3 md:pr-4 justify-between">
                  <h2 className="text-md md:text-2xl font-normal">Wake The Dead</h2>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl md:text-5xl leading-tight font-medium">
                      Emoji CPR<br />for any content 🚑
                    </p>
                    <ArrowRight className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Side - Stacked Layout */}
          <div className="flex flex-col gap-6">
            {/* Coloso Course */}
            <div className="flex-1">
              <Link href="https://bit.ly/4dDyZvR" target="_blank" rel="noopener noreferrer" className="h-full">
                <div className="relative flex flex-col h-full overflow-hidden rounded-3xl group">
                  <img
                    src="/image/coloso.png"
                    alt="Coloso Course"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col text-white py-3 px-4 md:py-4 md:px-5 pr-3 md:pr-4 justify-between">
                    <h2 className="text-md md:text-2xl font-normal">Coloso Course</h2>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl md:text-5xl leading-tight font-medium">
                        Your characters,<br />brought to life.
                      </p>
                      <ArrowRight className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Bottom Container for Post-it and Social Links */}
            <div className="grid grid-cols-2 gap-4 aspect-[2/1]">
              {/* Post-it Note */}
              <div className="relative flex items-center justify-center">
                <div className="w-full h-full transform" style={{ transform: 'rotate(-6deg)' }}>
                  <img
                    src="/image/post-it.png"
                    alt="Post-it note"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span 
                  className="absolute top-1/2 left-1/2 font-marydale text-xl md:text-2xl"
                  style={{ 
                    transform: 'translate(-50%, -50%) rotate(-6deg)',
                    WebkitTransform: 'translate(-50%, -50%) rotate(-6deg)' 
                  }}
                >
                  Hi :)
                </span>
              </div>

              {/* Social Links Container */}
              <div className="rounded-3xl p-2 md:p-6 pl-2 md:pl-6 flex flex-col justify-center gap-4">
              {[
                {
                  id: '1',
                  title: 'Youtube',
                  url: 'https://www.youtube.com/@ABlankCanvas_Data',
                  icon: <Youtube size={24} className="flex-shrink-0" />
                },
                {
                  id: '2',
                  title: 'Instagram',
                  url: 'https://www.instagram.com/h_ablankcanvas/',
                  icon: <Instagram size={24} className="flex-shrink-0" />
                },
                {
                  id: '3',
                  title: 'BANANA',
                  url: 'https://buymeacoffee.com/kingbob',
                  icon: <Coffee size={24} className="flex-shrink-0" />
                },
              ].map((item: SocialMediaItem) => (
                <a 
                  key={item.id} 
                  href={item.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-marydale text-xl hover:text-gray-600 transition-colors flex flex-row items-center gap-2"
                >
                  {item.icon}
                  <span className="text-left break-all">{item.title}</span>
                </a>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
      <p className="font-marydale text-center text-black w-full py-8">
        One story at a time.
      </p>
    </div>
  );
}