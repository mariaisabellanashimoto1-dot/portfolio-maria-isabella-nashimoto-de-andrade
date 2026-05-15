import React from 'react';

const faqData = [
  {
    question: "What is this site?",
    answer: "Exif Info is a tool that will show you the (normally hidden) metadata that is embedded in a file that you upload. The tool focuses on displaying the metadata from Exif images (i.e. .jpeg files), but can extract the metadata from almost every common media format including images, videos, audio files, Microsoft Word documents, Adobe PDFs, and many more."
  },
  {
    question: "What is Exif?",
    answer: "The Exchangeable image file format is a standard that defines the formats of image, audio, and metadata tags used by cameras, phones, and other digital recording devices."
  },
  {
    question: "What sort of metadata is commonly included?",
    answer: (
      <>
        Depending on the file type and the authoring tool (the application or the capturing device), different types of metadata are recorded. Examples include:
        <ul className="list-disc ml-8 mt-2 space-y-1">
          <li>Capture and last edited date and time stamps (with varying precision)</li>
          <li>GPS location coordinates (degrees of latitude & longitude)</li>
          <li>A small thumbnail of the original image</li>
          <li>The author's name and copyright details</li>
          <li>Compass heading</li>
          <li>Device information including manufacturer, and model</li>
          <li>Capture information including lens type, focal range, aperture, shutter speed, flash settings</li>
          <li>The original filename</li>
        </ul>
      </>
    )
  },
  {
    question: "Can I get an example?",
    answer: (
      <>
        Here are some example files to show the range of data recorded by various different cameras:
        <ol className="list-decimal ml-8 mt-2 space-y-1">
          <li>Canon 40D</li>
          <li>iPhone 6</li>
          <li>Nexus 5X</li>
          <li>OnePlus 5</li>
          <li>Pixel 6a</li>
        </ol>
      </>
    )
  },
  {
    question: "What file types are supported?",
    answer: "A bunch! See Exif Info supported file types for the complete list."
  },
  {
    question: "How are my files handled?",
    answer: "The files that you upload are automatically processed by the Exif analyser. The original file is deleted immediately after processing. The files generated (an image thumbnail, the Exif metadata, etc.) are stored securely for up to three days (to allow time for you to view the results) and then purged. The result URL is private, unless you share that URL with others."
  },
  {
    question: "What is the underlying Exif tool?",
    answer: "Under the hood, Exif Info uses the fantastic command line program ExifTool by Phil Harvey"
  }
];

export const FAQSection: React.FC = () => {
  return (
    <section className="bg-solar-base03 py-16 px-8 md:px-16 lg:px-24 flex flex-col items-start">
      <div className="w-full max-w-6xl">
        <h2 className="text-solar-cyan text-[38.4px] font-mono font-bold mb-12">FAQ</h2>
        
        <div className="space-y-16">
          {faqData.map((item, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-solar-cyan text-[38.4px] font-mono font-bold leading-tight">
                {item.question}
              </h3>
              <div className="text-solar-cyan font-mono text-[1.2em] leading-relaxed opacity-90">
                {item.answer}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-8 border-t border-solar-cyan/10 text-solar-cyan font-mono opacity-60 text-left">
          © 2026 Jonathan Hedley.
        </div>
      </div>
    </section>
  );
};
