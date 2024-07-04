import React from 'react';

const ColosoPin = () => {
  return (
    <div className="flex flex-row items-center w-full mt-12">
      <div className="gap-y-3 font-marydale flex flex-col mx-auto text-lg bg-background items-center justify-center">
        {[
          ['1', 'Coloso Course - 한국어', 'https://bit.ly/3V2Ds4i'],
          // ['2', 'Coloso Course - English', 'https://coloso.global/en'],
          // ['3', 'JP', 'https://coloso.jp'],
          // ['4', 'Coloso Course - Español', 'https://coloso.global/es'],
        ].map(([key, title, url]) => (
        <div key={key} className='flex flex-row gap-x-2'>
          <a
            href={url}
            target="_blank"
            // aria-hidden={!showSections}
            className='border-black border-[1px] rounded-full items-center flex px-4'
          >
            📌 {title}
          </a>
          <img src="/image/colosologo.png" alt="colosopolaroid" className="flex w-full max-w-12 rounded-full" />

        </div>
        ))}
      </div>
    </div>
  );
};

export default ColosoPin;
