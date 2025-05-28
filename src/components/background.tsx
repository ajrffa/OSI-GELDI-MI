import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
      <div className="absolute inset-0 animate-spin-slow bg-gradient-to-br from-[#83232A] via-[#83232A] to-[#83232A] opacity-110 rounded-full w-[200%] h-[200%] -top-1/2 -left-1/2 blur-3xl" />
    </div>
  );
};

export default Background;
