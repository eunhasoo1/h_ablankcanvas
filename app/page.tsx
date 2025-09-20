"use client"

import Image from 'next/image';
import Link from 'next/link';

import image1 from '../assets/images/1.png';
import image2 from '../assets/images/2.png';
import image3 from '../assets/images/3.png';
import image4 from '../assets/images/4.png';
import image5 from '../assets/images/5.png';

export default function Home() {
  return (
    <main className=" max-w-xs mx-auto text-black h-dvh flex flex-col justify-center font-marydale py-20 px-2 pl-0 overflow-hidden">
      <div className="text-lg font-bold text-left mb-8">
        <p>HA</p>
        <p className="-mt-2">EUN</p>
      </div>

      <div className="grid grid-cols-[3fr_4fr] grid-rows-3  mb-10 flex-grow">
        {/* Item 1 */}
        <Link href="https://www.youtube.com/@h_ablankcanvas" target="_blank" rel="noopener noreferrer" className="relative ">
          <Image src={image1} alt="The Details" fill className="object-contain scale-125" />
          <p className="absolute top-1 right-2 text-xs">01</p>
        </Link>

        {/* Item 2 */}
        <Link href="https://www.chatflix.app" target="_blank" rel="noopener noreferrer" className="relative   flex flex-col justify-center items-center z-10">
            <div className="w-full h-full relative">
                <Image src={image2} alt="Chatflix App" fill className="object-contain scale-50 translate-y-9" />
                <p className="text-xs pt-2 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4">02</p>
            </div>
        </Link>

        {/* Item 3 */}
        <Link href="https://bit.ly/4dDyZvR" target="_blank" rel="noopener noreferrer" className="relative  block z-10 ">
          <Image src={image3} alt="Coloso" fill className="object-contain -translate-x-2 " />
          <p className="absolute bottom-6 right-6 -translate-y-1/2 text-xs">03</p>
        </Link>

        {/* Item 4 */}
        <Link href="https://www.instagram.com/h_ablankcanvas/" target="_blank" rel="noopener noreferrer" className="relative row-span-2 flex flex-col justify-center items-center z-0">
            <div className="w-full h-full relative">
                <Image src={image4} alt="Instagram" fill className="object-contain scale-[120%]" />
            </div>
            <p className="text-xs absolute bottom-1/2 left-8 translate-y-1 translate-x-3">04</p>
        </Link>

        {/* Item 5 */}
        <Link href="https://hablankcanvas.com" target="_blank" rel="noopener noreferrer" className="relative  block z-10">
          <Image src={image5} alt="Youtube" fill className="object-contain -ml-2" />
          <p className="absolute bottom-10 right-[-1rem] -translate-y-1/2 text-xs">05</p>
        </Link>
      </div>

      <div className="text-sm space-y-1 text-left">
        <p>(01) youtube main (02) chatflix app (03) coloso - korean</p>
        <p>(04) Instagram (05) home</p>
      </div>
    </main>
  );
}


