
"use client"

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="font-helvetica w-full flex flex-col items-center min-h-screen justify-between overflow-clip">
      <div className="flex flex-col items-center w-full px-5">
        <a href='/ablankcanvas' className='mt-10 md:mt-20 flex items-center text-center 
          font-marydale  
          uppercase 
          text-4xl
          md:text-7xl lg:text-[7rem]
          font-bold'>
          A Blank Canvas
        </a>

        <div className="flex flex-col items-center py-24 px-12 w-full">
          <Link href="/products/coloso">
            <div className="relative flex flex-col items-center">
              <img
                src="/image/coloso.png"
                alt="Coloso Course"
                className="flex w-full max-w-96 cursor-pointer rounded-3xl"
              />
              <div className="absolute top-0 left-0 w-full h-full flex flex-col text-white py-3 px-4 md:py-5 md:px-6 font-helvetica justify-between font-medium">
                <h2 className="text-md md:text-xl">Coloso Course</h2>
                <p className="text-2xl md:text-4xl leading-6">
                  Your Characters,<br />brought to life.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="font-marydale flex gap-6 pt-20 pb-40 justify-center font-light text-center items-center w-full">
          { [
            // ['3', 'Youtube', 'https://youtube.com/@h_ablankcanvas', undefined],
            ['1', 'Instagram', 'https://www.instagram.com/h_ablankcanvas/', undefined],
            ['2', 'Twitter', 'https://www.x.com/h_ablankcanvas/', undefined],
            // ['2', undefined, 'https://www.x.com/h_ablankcanvas/', '/image/twitter.png'],
          ].map(([key, title, url, imgSrc]) => (
            <a key={key} href={url ?? ""} target="_blank" className="bg-background rounded-full flex items-center">
              {imgSrc ? <img src={imgSrc} className=" h-full object-cover flex max-h-5" /> : title}
            </a>
          ))}
        </div>

        </div>
        <div>

        <p className="font-marydale text-center text-xs text-black w-full pb-16 ">
          One story at a time.
        </p>
        </div>
    </div>
  );
}