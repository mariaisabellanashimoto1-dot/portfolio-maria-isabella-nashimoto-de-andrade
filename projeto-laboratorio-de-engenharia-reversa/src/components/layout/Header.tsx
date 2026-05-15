import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-solar-base03 h-[199.41px] flex flex-col justify-center px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl w-full">
        <h1 
          className="font-mono text-solar-yellow text-[57.6px] leading-tight font-bold"
          style={{ textShadow: '2px 2px 4px #000000cc' }}
        >
          Exif&thinsp;Info<span className="text-[75%]">.org</span>
        </h1>
        <p className="font-mono text-solar-cyan text-[1.2em] mt-2 max-w-3xl">
          An online tool to analyze and display the metadata in images and other media files.
        </p>
      </div>
    </header>
  );
};
