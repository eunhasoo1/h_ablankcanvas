"use client"

import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};


export default function Home() {
  return (
    <motion.main 
        className=" max-w-xs mx-auto text-black h-dvh flex flex-col justify-center font-marydale py-32 px-2 pl-0 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      <motion.div 
        className="text-lg font-bold text-left mb-8"
        variants={itemVariants}
      >
        <p>HA</p>
        <p className="-mt-2">EUN</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-[3fr_4fr] grid-rows-3  mb-10 flex-grow"
        variants={containerVariants}
      >
        {/* Item 1 */}
        <motion.div variants={itemVariants} className="relative">
            <Link href="https://www.youtube.com/@h_ablankcanvas" target="_blank" rel="noopener noreferrer" className="relative block w-full h-full">
                <Image src="/image/1.png" alt="The Details" fill className="object-contain scale-125" />
                <p className="absolute top-1 right-2 text-xs">01</p>
            </Link>
        </motion.div>

        {/* Item 2 */}
        <motion.div variants={itemVariants} className="relative flex flex-col justify-center items-center z-10">
            <Link href="https://www.chatflix.app" target="_blank" rel="noopener noreferrer" className="relative   flex flex-col justify-center items-center z-10 w-full h-full">
                <div className="w-full h-full relative">
                    <Image src="/image/2.png" alt="Chatflix App" fill className="object-contain scale-50 translate-y-9" />
                    <p className="text-xs pt-2 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4">02</p>
                </div>
            </Link>
        </motion.div>

        {/* Item 3 */}
        <motion.div variants={itemVariants} className="relative z-10">
            <Link href="https://bit.ly/4dDyZvR" target="_blank" rel="noopener noreferrer" className="relative  block z-10 w-full h-full">
            <Image src="/image/3.png" alt="Coloso" fill className="object-contain -translate-x-2 " />
            <p className="absolute bottom-6 right-6 -translate-y-1/2 text-xs">03</p>
            </Link>
        </motion.div>
        
        {/* Item 4 */}
        <motion.div variants={itemVariants} className="relative row-span-2 flex flex-col justify-center items-center z-0">
            <Link href="https://www.instagram.com/h_ablankcanvas/" target="_blank" rel="noopener noreferrer" className="relative row-span-2 flex flex-col justify-center items-center z-0 w-full h-full">
                <div className="w-full h-full relative">
                    <Image src="/image/4.png" alt="Instagram" fill className="object-contain scale-[120%]" />
                </div>
                <p className="text-xs absolute bottom-1/2 left-8 translate-y-1 translate-x-3">04</p>
            </Link>
        </motion.div>

        {/* Item 5 */}
        <motion.div variants={itemVariants} className="relative z-10">
            <Link href="https://hablankcanvas.com" target="_blank" rel="noopener noreferrer" className="relative  block z-10 w-full h-full">
            <Image src="/image/5.png" alt="Youtube" fill className="object-contain -ml-2" />
            <p className="absolute bottom-10 right-[-1rem] -translate-y-1/2 text-xs">05</p>
            </Link>
        </motion.div>
      </motion.div>

      <motion.div 
        className="text-sm space-y-1 text-left"
        variants={itemVariants}
      >
        <p>(01) youtube main (02) chatflix app (03) coloso - korean</p>
        <p>(04) Instagram (05) home</p>
      </motion.div>
    </motion.main>
  );
}


