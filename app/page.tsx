"use client"

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Coffee, ChevronRight } from 'lucide-react';
import { Instagram, Youtube } from 'lucide-react';
import { ReactNode } from 'react';
import Image from 'next/image';
import LatestVideo from './components/LatestVideo';
import Message from './components/Message';


interface SocialMediaItem {
  id: string;
  title: string;
  url: string;
  icon: ReactNode;
}

export default function Home() {
  return (
    <div className="font-helvetica w-full flex flex-col min-h-dvh">
      {/* Header - Full width */}
      <div className="w-full bg-[#fafafa] py-4 pt-6">
        <div className="flex flex-col items-center gap-1">
          <Link href="/ablankcanvas" className="w-16 h-16 rounded-full overflow-hidden cursor-pointer">
            <Image
              src="/image/profilepic.png"
              alt="Profile"
              width={60}
              height={60}
              className="w-full h-full object-cover"
            />
          </Link>
          <div className="flex flex-col items-center gap-1 pl-2">
            <Link 
              href="/ablankcanvas"
              className="flex items-center text-[13px] text-[#8E8E93] cursor-pointer"
            >
              <span>Haeun</span>
              <ChevronRight size={14} className='translate-y-[1px] text-[#C7C7CC]' />
            </Link>
          </div>
        </div>
      </div>

      {/* Content - With padding */}
      <div className="flex-1 px-5 py-4 max-w-xl mx-auto w-full">
        <Message text="Latest" />
        
        <LatestVideo />
        
        <Message text="I make stuff :)" showTail={true} />

        <div className="flex-1 flex flex-col w-full">
          <div className="flex-1 grid grid-cols-1 gap-3 w-full mx-auto md:mx-0">
            {/* Coloso Course */}
            <div className="flex">
              <Link href="https://bit.ly/4dDyZvR" target="_blank" rel="noopener noreferrer" className="w-full">
                <div className="relative flex flex-col h-full overflow-hidden rounded-3xl group">
                  <img
                    src="/image/coloso.png"
                    alt="Coloso Course"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col text-white py-3 px-4 md:py-4 md:px-5 pr-3 md:pr-4 justify-between">
                    <h2 className="text-md md:text-2xl font-normal">Coloso Course</h2>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl md:text-4xl leading-tight font-medium">
                        Your characters,<br />brought to life.
                      </p>
                      <ArrowRight className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Wake The Dead */}
            <div className="flex-1 mb-3">
              <Link href="https://wakethedead.ai" target="_blank" className="h-full">
                <div className="relative flex flex-col h-full overflow-hidden rounded-3xl group">
                  <img
                    src="/image/wtd.png"
                    alt="Wake The Dead"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col text-white py-3 px-4 md:py-4 md:px-5 pr-3 md:pr-4 justify-between">
                    <h2 className="text-md md:text-2xl font-normal">Wake The Dead</h2>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl md:text-4xl leading-tight font-medium">
                        Emoji CPR<br />for any content 🚑
                      </p>
                      <ArrowRight className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* <div className="flex flex-col justify-center">
                <SocialLinks />
              </div> */}
           
            {/* Bottom Container for Post-it and Social Links */}
            <div className="gap-4 mt-12">
            {/* <Message text="You can find me here" showTail={true} /> */}
              {/* Social Links Container */}
              <div className="text-[#282828] rounded-3xl pt-2 flex flex-col items-center gap-4">
                {[
                  {
                    id: '1',
                    title: 'Instagram',
                    url: 'https://www.instagram.com/h_ablankcanvas/',
                    icon: <Instagram size={24} className="flex-shrink-0" />
                  },
                  {
                    id: '2',
                    title: 'Youtube - Main',
                    url: 'https://www.youtube.com/@h_ablankcanvas',
                    icon: <Youtube size={24} className="flex-shrink-0" />
                  },
                  {
                    id: '3',
                    title: 'Youtube - Timelapses',
                    url: 'https://www.youtube.com/@hablankcanvas_data',
                    icon: <Youtube size={24} className="flex-shrink-0" />
                  },
                  // {
                  //   id: '4',
                  //   title: 'BANANA',
                  //   url: 'https://buymeacoffee.com/kingbob',
                  //   icon: <Coffee size={24} className="flex-shrink-0" />
                  // },
                ].map((item: SocialMediaItem) => (
                  <a 
                    key={item.id} 
                    href={item.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-marydale text-xl text-[#282828] hover:text-gray-600 transition-colors flex flex-row items-center gap-2 w-full max-w-[250px]"
                  >
                    {item.icon}
                    <span className="text-left">{item.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end w-full my-12 mt-80">
          <div className="flex flex-col items-end">
            <Message text="One story at a time" type='send' />
            <span className="text-[11px] text-[#8D8C90] mt-1 mr-1 font-medium">
              Delivered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}