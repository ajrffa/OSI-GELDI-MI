import React, { useState, useEffect, useRef } from 'react';
import FloatingHeads from './FloatingHeads';

const targetDate = new Date('2025-09-01T00:00:00');

function getTimeLeft() {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();
  return {
    days: Math.max(Math.floor(difference / (1000 * 60 * 60 * 24)), 0),
    hours: Math.max(Math.floor((difference / (1000 * 60 * 60)) % 24), 0),
    minutes: Math.max(Math.floor((difference / 1000 / 60) % 60), 0),
    seconds: Math.max(Math.floor((difference / 1000) % 60), 0),
  };
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-white font-bold bg-gsRed border-4 border-gsYellow px-4 py-2 rounded-md shadow-lg text-sm sm:text-base">
      <span>{timeLeft.days}g </span>
      <span>{timeLeft.hours}s </span>
      <span>{timeLeft.minutes}d </span>
      <span>{timeLeft.seconds}s</span>
    </div>
  );
}

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLDivElement>(null);

  const messages = ["HENÜZ GELMEDİ", "GELDİ Mİ?", "HENÜZ GELMEDİ, SABIR!"];

  const handleClick = () => {
    const nextIndex = clickCount % messages.length;
    setMessage(messages[nextIndex]);
    setClickCount(prev => prev + 1);
    window.dispatchEvent(new Event('osimhen-scatter'));
  };

  useEffect(() => {
    const audio = new Audio('/music.mp3');
    audio.loop = true;
    audio.volume = 0.1;

    const playAudio = () => {
      audio.play().catch(() => {
        console.log("Autoplay engellendi.");
      });
    };

    playAudio();
    document.addEventListener('click', playAudio, { once: true });

    return () => {
      document.removeEventListener('click', playAudio);
      audio.pause();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(90deg,#ff8904_50%,#C0392B_50%,#C0392B)] overflow-hidden relative">

      {/* Mask */}
      <div className="absolute top-0 z-30 w-24 h-auto animate-swing origin-top transform left-4 sm:right-1/4 sm:left-auto">
        <div className="w-[2px] h-24 bg-black mx-auto"></div>
        <a href="https://www.gsstore.org/osimhen-shop-by-player/" target="_blank" rel="noopener noreferrer">
          <img
            src="/osimhen-mask.png"
            alt="Osimhen Mask"
            className="w-full h-auto -mt-2 cursor-pointer"
          />
        </a>
      </div>

      {/* Uçuşan kafalar */}
      <FloatingHeads buttonRef={buttonRef} iframeRef={iframeRef} />

      {/* YouTube player - sadece masaüstünde göster */}
      <div
        ref={iframeRef}
        className="fixed top-0 left-0 bottom-0 p-4 z-10 w-full max-w-[75vw] sm:max-w-[551px] hidden sm:block"
      >
        <div className="aspect-video border-4 border-[#82181a] rounded-2xl overflow-hidden shadow-lg bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/videoseries?list=PLMbDsb2aWMwFlUih8bh-sWIe6Kq0owBte&autoplay=1&mute=1&loop=1&playlist=PLMbDsb2aWMwFlUih8bh-sWIe6Kq0owBte"
            title="Osimhen Skills Playlist"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Buton ve mesaj */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-20">
        <div className="flex flex-col items-center space-y-6 text-center w-full max-w-xs sm:max-w-none">
          <button
            ref={buttonRef}
            onClick={handleClick}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-red-700 px-8 sm:px-12 py-3 sm:py-10 text-4xl sm:text-5xl font-extrabold rounded-2xl shadow-2xl border-4 border-red-700 hover:scale-110 transition-transform duration-300 sm:w-auto sm:max-w-2xl"
          >
            OSIMHEN GELDİ Mİ?
          </button>

          {message && (
            <div
              key={clickCount}
              className="mt-4 w-full max-w-md p-4 sm:p-6 bg-black bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl text-white animate-fade-in transition-all duration-500"
            >
              <p className="text-lg sm:text-xl font-semibold">{message}</p>
            </div>
          )}
        </div>
      </main>

      {/* Sağ üst - Logo ve X */}
      <div className="fixed top-4 right-4 flex space-x-4 items-center z-30">
        <a
          href="https://X.com/GalatasaraySK"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-300"
          aria-label="Twitter X Link"
        >
          <img src="/x-icon.png" alt="X Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
        </a>
        <a
          href="https://www.galatasaray.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-300"
          aria-label="Galatasaray Official Website"
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <img
              src="/gs-logo.png"
              alt="Galatasaray Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </a>
      </div>

      {/* Geri Sayım */}
      <div className="fixed top-20 right-4 z-30">
        <Countdown />
      </div>
{/* Sağ alt köşe Osimhen Forması */}
<div className="fixed bottom-4 right-4 z-30 flex flex-col items-center space-y-2">
  <a
    href="https://www.gsstore.org/galatasaray-puma-2024-2025-ic-saha-parcali-profesyonel-forma-77964301-2/"
    target="_blank"
    rel="noopener noreferrer"
    className="group relative animate-wave"
  >
    <img
      src="/osimhen-kit.png"
      alt="Osimhen Forması"
      className="h-48 sm:h-72 object-contain pointer-events-auto drop-shadow-lg transition-transform duration-300 group-hover:scale-105 animate-waveFlag"
    />
  </a>
  
  {/* LED efektli metin kutusu */}
  <div className="px-3 py-1 rounded text-xs sm:text-sm text-center shadow-md bg-black bg-opacity-70 animate-pulseGlow">
    <p className="text-white">
      Bonservise destek olmak için<br />
      <span className="text-yellow-400 font-bold animate-glowText">
        GSStore'a uğrayın
      </span>
    </p>
  </div>
</div>
    </div>
  );
};

export default App;
