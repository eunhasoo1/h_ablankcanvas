
"use client"

import React, { useState } from 'react';

export default function Home() {
  const [showSections, setShowSections] = useState(false);

  return (
    <div className="font-helvetica w-full flex flex-col items-center min-h-screen justify-between overflow-clip">
      <div className="max-w-4xl flex flex-col items-center w-full  px-5 ">
        <a href='/' className='mt-10 md:mt-20 flex items-center text-center 
          font-marydale  
          uppercase 
          text-4xl
          md:text-8xl
          font-bold'>
          A Blank Canvas.
        </a>
        {/* <p className="mt-12 font-john text-center text-xs md:text-sm text-black pb-4 w-full ">
        A Blank Canvas.
        </p> */}
        <div className="flex flex-col items-center pt-8 px-6 pl-20 md:pl-56 w-full">
          <img src="/image/profile.png" alt="Haeun's Profile" className="flex w-full max-w-48 md:max-w-72" />
          {/* <p className="font-marydale text-xl md:text-4xl font-bold ">Hi {':)'}</p> */}
        </div>
        {/* <p className='pt-16 pb-4 flex text-center
          font-marydale 
          uppercase 
          text-lg
          md:text-2xl 
          font-bold'>
          Links to stuffs
        </p> */}
        {/* <p className='mt-20 flex items-center text-center 
          font-marydale  
          uppercase 
          text-3xl
          md:text-5xl 
          font-bold'>
          I made these.
        </p> */}
        <div className="pt-10 md:pt-16 pr-16 md:pr-60 flex flex-col justify-center text-xl w-full">
          {/* <div className="max-w-full rounded-3xl overflow-hidden border z-10  border-black flex max-h-40 cursor-pointer"
            onClick={() => setShowSections(!showSections)}>
            <div className="bg-background p-3 px-4 w-1/2 flex flex-col justify-between">
              <h2 className="text-xl md:text-2xl ">Coloso</h2>
              <p className="text-left text-xs md:text-base">{'->'} Let's begin</p>
            </div>
            <img src="/image/coloso.png" alt="Tools" className="w-1/2 object-cover" />
          </div> */}
          {/* <div
            className="font-marydale grid grid-cols-3 gap-4 px-12 text-base transition-all duration-300 ease-in-out"
          >
            {[
              ['1', 'KR', 'https://coloso.co.kr'],
              ['2', 'EN', 'https://coloso.global/en'],
              ['3', 'JP', 'https://coloso.jp'],
            ].map(([key, title, url]) => (
              <a
                key={key}
                href={url}
                className=" bg-background border-[1px] border-black py-1 md:py-2 pt-2 md:pt-4 rounded-b-3xl h-10 flex items-center justify-center transition-transform duration-500 ease-in-out transform"
                style={{
                  // This will apply a translateY transformation based on the visibility state
                  transform: showSections ? 'translateY(-20%)' : 'translateY(-100%)',
                }}
              >
                {title}
              </a>
            ))}
          </div> */}
          {/* coloso polaroid */}
          <div className="flex flex-col items-center justify-between w-full"
            >
            <img src="/image/colosopolaroid.png" alt="colosopolaroid" className="flex w-full max-w-48 md:max-w-72" />
              {/* <p className="font-marydale text-xl md:text-4xl font-bold mx-auto">Hi {':)'}</p> */}
              <div className="font-marydale flex flex-row gap-x-5 pr-2 mx-auto text-base bg-background py-1 md:py-2 pt-3 md:pt-4 rounded-b-3xl items-center justify-center
                ">
            {[
              ['1', 'EN', 'https://coloso.global/en'],
              ['2', 'KR', 'https://coloso.co.kr'],
              ['3', 'JP', 'https://coloso.jp'],
              ['4', 'ES', 'https://coloso.global/es'],
            ].map(([key, title, url]) => (
              <a
                key={key}
                href={url}
                aria-hidden={!showSections}
              >
                {title}
              </a>
            ))}
          </div>
          </div>

          {/* image with border */}
           {/* <div className="max-w-full rounded-3xl overflow-hidden border-[1px] z-10  border-black flex max-h-40 cursor-pointer"
            onClick={() => setShowSections(!showSections)}>
            <div className="bg-background p-3 px-4 w-1/2 flex flex-col justify-between">
              <h2 className="text-xl md:text-2xl ">Coloso</h2>
              <p className="text-left text-xs md:text-base">{'->'} Let's begin</p>
            </div>
            <img src="/image/coloso.png" alt="Tools" className="w-1/2 object-cover" />
          </div>
          <div className="font-marydale grid grid-cols-3 gap-4 px-12 text-base transition-opacity duration-500 ease-in-out">
            {[
              ['1', 'KR', 'https://coloso.co.kr'],
              ['2', 'EN', 'https://coloso.global/en'],
              ['3', 'JP', 'https://coloso.jp'],
            ].map(([key, title, url]) => (
              <a
                key={key}
                href={url}
                className={`bg-background py-1 md:py-2 pt-2 md:pt-4 rounded-b-3xl h-10 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
                  showSections ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden={!showSections}
              >
                {title}
              </a>
            ))}
          </div> */}
        </div>
        {/* <div className="pt-4 flex flex-col justify-center text-xl w-full">
          <div className="max-w-full rounded-3xl overflow-hidden border z-10  border-black flex max-h-40 cursor-pointer"
            onClick={() => setShowSections(!showSections)}>
            <div className="bg-background p-3 px-4 w-1/2 flex flex-col justify-between">
              <h2 className="text-xl md:text-2xl ">Coloso</h2>
              <p className="text-left text-xs md:text-base">{'->'} Let's begin</p>
            </div>
            <img src="/image/coloso.png" alt="Tools" className="w-1/2 object-cover" />
          </div>
          <div
            className={`font-marydale grid grid-cols-3 gap-4 px-12 text-base transition-all duration-300 ease-in-out ${showSections ? 'max-h-40' : 'max-h-0'}`}
          >
            {[
              ['1', 'KR', 'https://coloso.co.kr'],
              ['2', 'EN', 'https://coloso.global/en'],
              ['3', 'JP', 'https://coloso.jp'],
            ].map(([key, title, url]) => (
              <a
                key={key}
                href={url}
                className=" bg-background border-[1px] border-black py-1 md:py-2 pt-2 md:pt-4 rounded-b-3xl h-full flex items-center justify-center transition-transform duration-500 ease-in-out transform"
                style={{
                  // This will apply a translateY transformation based on the visibility state
                  transform: showSections ? 'translateY(-20%)' : 'translateY(-100%)',
                }}
              >
                {title}
              </a>
            ))}
          </div>
        </div> */}
        <p className='mt-16 md:mt-24 pb-4 flex items-center text-center 
          font-marydale  
          uppercase 
          text-3xl
          md:text-5xl 
          font-bold'>
          I post stuff.
        </p>
        <div className="font-marydale flex gap-8 justify-center text-lg text-center items-center w-full">
          { [
            ['3', 'Youtube', 'https://youtube.com/@h_ablankcanvas', undefined],
            ['1', 'Instagram', 'https://www.instagram.com/h_ablankcanvas/', undefined],
            // ['1', 'Twitter', 'https://www.instagram.com/h_ablankcanvas/', undefined],
            ['2', undefined, 'https://www.x.com/h_ablankcanvas/', '/image/twitter.png'],
          ].map(([key, title, url, imgSrc]) => (
            <a key={key} href={url ?? ""} className="bg-background rounded-full flex items-center">
              {imgSrc ? <img src={imgSrc} className=" h-full object-cover flex max-h-5" /> : title}
            </a>
          ))}
        </div>

        </div>
        <p className="mt-40 pt-8 font-john text-center text-xs md:text-sm text-black pb-16 w-full ">
          One story at a time
        </p>
    </div>
  );
}