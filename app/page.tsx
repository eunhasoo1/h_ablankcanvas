
"use client"

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import LatestYouTubeVideo from '@/components/LatestYouTubeVideo';
import { Instagram, Youtube, Twitter } from 'lucide-react';
import { ReactNode } from 'react';

interface SocialMediaItem {
  id: string;
  title: string;
  url: string;
  icon: ReactNode;
}

export default function Home() {
  return (
    <div className="font-helvetica w-full flex flex-col items-center h-dvh justify-between ">
      <div className="flex flex-col items-center w-full px-5 gap-y-24 sm:gap-y-40">
      <div className="flex flex-col items-center w-full">
        <a href='/ablankcanvas' className='mt-10 md:mt-12 flex items-center text-center 
          font-marydale  
          uppercase 
          text-4xl
          md:text-7xl lg:text-[7rem]
          font-bold 
          '>
          A Blank Canvas
        </a>
        {/* <a href='/ablankcanvas' className='mt-10 md:mt-20 flex items-center text-center 
          font-marydale  
          uppercase 
          text-4xl
          md:text-7xl lg:text-[7rem]
          font-bold'>
          A Blank Canvas
        </a> */}
        {/* <LatestYouTubeVideo channelId={process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID!} /> */}
        </div>
        <div className="flex flex-col items-center w-full gap-y-4 sm:gap-y-6">
        {/* <p className='mb-4 flex items-center text-center 
          font-marydale  
          uppercase 
          text-4xl sm:text-5xl
          font-bold 
          '>
          I make stuff
        </p> */}
          {/* <Link href="https://wakethedead.ai" target="_blank">
              <div className="relative flex flex-col items-center group">
                <img
                  src="/image/wtd.png"
                  alt="Wake The Dead"
                  className="flex w-full max-w-96 cursor-pointer rounded-3xl"
                />
                <div className="absolute top-0 left-0 w-full h-full flex flex-col text-white py-3 px-4 md:py-4 md:px-5 pr-3 md:pr-4 font-helvetica justify-between font-medium">
                  <h2 className="text-md md:text-xl font-normal">Wake The Dead (beta) - Free</h2>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl md:text-4xl leading-7">
                    Emoji CPR
                    <br /> for any content 🚑
                    </p>
                    <ArrowRight className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </Link> */}
          {/* <Link href="/products/coloso"> */}
          <Link href="https://bit.ly/4dDyZvR" target="_blank" rel="noopener noreferrer" >
            {/* <div className="relative flex flex-col items-center group"> */}
            <div className="relative flex flex-col items-center group">
              <img
                src="/image/coloso.png"
                alt="Coloso Course"
                className="flex w-full max-w-96 cursor-pointer rounded-3xl"
              />
              <div className="absolute top-0 left-0 w-full h-full flex flex-col text-white py-3 px-4 md:py-4 md:px-5 pr-3 md:pr-4 font-helvetica justify-between font-medium">
                <h2 className="text-md md:text-xl font-normal">Coloso Course</h2>
                <div className="flex items-end justify-between">
                  <p className="text-3xl md:text-4xl leading-7">
                    Your characters,<br />brought to life.
                  </p>
                  <ArrowRight className="w-8 h-8" />
                </div>
              </div>
            </div>
          </Link>
          
        </div>
        <div className="flex flex-col justify-center text-center items-center w-full ">
        <p className='mb-4 flex items-center text-center 
          font-marydale
          uppercase 
          text-4xl
          md:text-5xl 
          font-bold'>
          I post stuff
        </p>
        {/* <div className="font-marydale flex gap-8 pt-20 pb-40 mt-12 justify-center text-center items-center w-full text-lg sm:text-2xl font-normal"> */}
        <div className="font-marydale flex gap-8 pb-40 justify-center text-center items-center w-full text-lg sm:text-2xl font-light">
          {[
            {
              id: '3',
              title: 'Youtube',
              url: 'https://youtube.com/@h_ablankcanvas',
              icon: <Youtube size={20} className="mr-2" />
            },
            {
              id: '1',
              title: 'Instagram',
              url: 'https://www.instagram.com/h_ablankcanvas/',
              icon: <Instagram size={20} className="mr-2" />
            },
            // {
            //   id: '2',
            //   title: 'Twitter',
            //   url: 'https://www.x.com/h_ablankcanvas/',
            //   icon: <Twitter size={24} className="mr-2" />
            // },
          ].map((item: SocialMediaItem) => (
            <a 
              key={item.id} 
              href={item.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background flex items-center hover:text-gray-600 transition-colors"
            >
              {item.icon}
              {item.title}
            </a>
          ))}
        </div>
        </div>
        </div>
        <div>
        <p className="font-marydale text-center text-black w-full pb-16 ">
          One story at a time.
        </p>
        </div>
    </div>
  );
}