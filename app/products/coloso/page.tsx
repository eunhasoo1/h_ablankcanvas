"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ColosoProductPage = () => {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const router = useRouter();

  const languages = [
    { lang: '한국어', url: 'https://bit.ly/3V2Ds4i', available: true },
    { lang: 'Global', url: 'https://coloso.global/en', available: false },
    // { lang: 'English', url: 'https://coloso.global/en', available: false },
    // { lang: 'Japanese', url: 'https://coloso.jp', available: false },
  ];

  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-dvh p-4 font-sans relative">
      <button
        onClick={goHome}
        className="absolute top-4 left-4 p-2 z-10"
      >
        <ArrowLeft size={24} />
      </button>
      <div className="max-w-6xl w-full h-full pt-20">
        <h1 className="text-2xl font-normal">Coloso Course</h1>
        <h2 className="text-4xl md:text-[3.6rem] font-bold font-marydale uppercase mt-4">
          YOUR CHARACTERS, BROUGHT TO LIFE.
        </h2>
        <div className="flex flex-col md:flex-row gap-4 md:gap-16 md:mt-8">
          <div className="w-full md:w-1/2 py-8 md:py-12">
            <Image
              src="/image/colosoproduct.png"
              alt="Coloso Course Character"
              width={500}
              height={300}
              className="rounded-3xl w-full h-auto"
            />
          </div>
          <div className="w-full md:w-1/2 ">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-xl pt-0 pb-8 md:pt-12 md:pb-12">
              {languages.map((item, index) => (
                <div key={index} className="h-full">
                  <Link href={item.available ? item.url : '#'} passHref>
                    <div
                      className={`
                        ${item.available ? 'border-[1px]' : 'border-[1px] border-dashed'}
                        ${selectedLang === item.lang ? 'border-red-500' : item.available ? 'border-black' : 'border-gray-400'}
                        rounded-3xl py-16 text-center cursor-pointer
                        ${item.available ? 'hover:bg-gray-100' : 'cursor-not-allowed'}
                        transition duration-300 flex items-center justify-center h-full flex-col
                        ${item.available ? 'text-black' : 'text-gray-400'}
                      `}
                      onClick={() => item.available && setSelectedLang(item.lang)}
                    >
                      {item.lang}
                      {!item.available && <span className="ml-2 text-sm">(Coming Soon)</span>}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColosoProductPage;