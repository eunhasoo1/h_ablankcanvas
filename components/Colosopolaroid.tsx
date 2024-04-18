import React from 'react';

const ColosoPolaroid = () => {
  return (
    <div className="flex flex-col items-center justify-between w-full">
      <img src="/image/colosopolaroid.png" alt="colosopolaroid" className="flex w-full max-w-48 md:max-w-72" />
      <div className="font-marydale flex flex-row gap-x-5 pr-2 mx-auto text-base bg-background py-1 md:py-2 pt-3 md:pt-4 rounded-b-3xl items-center justify-center">
        {[
          ['1', 'EN', 'https://coloso.global/en'],
          ['2', 'KR', 'https://coloso.co.kr'],
          ['3', 'JP', 'https://coloso.jp'],
          ['4', 'ES', 'https://coloso.global/es'],
        ].map(([key, title, url]) => (
          <a
            key={key}
            href={url}
            target="_blank"
            // aria-hidden={!showSections}
          >
            {title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ColosoPolaroid;
