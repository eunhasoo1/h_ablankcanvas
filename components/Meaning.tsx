
import React, { useState, useEffect } from 'react';

const Meaning = () => {
  const [textToShow, setTextToShow] = useState('');
  // const text = `The phrase "a blank canvas" can be used metaphorically to describe a situation, opportunity, or starting point that is open to creativity, change, or development without any constraints or pre-existing guidelines. It conveys the idea of limitless possibilities, allowing for complete freedom to create, innovate, or start afresh.`;
  const text = `"a blank canvas" metaphorically represents a situation or opportunity that offers complete freedom to create, innovate, or begin anew without any constraints.`;

  // useEffect(() => {
  //   let index = 0;
  //   const intervalId = setInterval(() => {
  //     if (index <= text.length) {
  //       setTextToShow(text.substring(0, index));
  //       index++;
  //     } else {
  //       clearInterval(intervalId);
  //     }
  //   }, 150); // Adjust the speed of typing animation here (milliseconds)
    
  //   return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  // }, [text]);

  return (
      <div className='flex text-center uppercase w-full max-w-2xl px-12 md:px-16 text-xxs md:text-xs pt-28
        font-helvetica font-light'>
        {/* {textToShow} */}
        {text}
      </div>
  );
};

export default Meaning;
