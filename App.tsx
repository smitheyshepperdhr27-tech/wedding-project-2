
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Heart, Calendar, MapPin, ChevronDown } from 'lucide-react';

/**
 * 【配置区】在这里修改新人信息
 */
const WEDDING_CONFIG = {
  groom: "张慕之",
  bride: "林映雪",
  date: "2024.10.20",
  time: "11:58 AM",
  location: "杭州 · 西子湖畔 悦榕庄",
  address: "浙江省杭州市西湖区紫金港路21号",
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // 请更换为轻柔钢琴曲链接
  mainPhoto: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000", // 封面图
  storyPhoto1: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000", // 故事图1
  storyPhoto2: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000", // 故事图2
  endingPhoto: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1000", // 结尾图
};

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 初始化音频
  useEffect(() => {
    audioRef.current = new Audio(WEDDING_CONFIG.musicUrl);
    audioRef.current.loop = true;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // 自动滚动逻辑
  useEffect(() => {
    let scrollInterval: number;
    if (autoScrollActive && hasStarted) {
      scrollInterval = window.setInterval(() => {
        window.scrollBy({ top: 0.5, behavior: 'auto' });
      }, 16); // 约60fps的极慢平滑滚动
    }
    return () => clearInterval(scrollInterval);
  }, [autoScrollActive, hasStarted]);

  // 开启邀请函
  const startInvitation = () => {
    setHasStarted(true);
    setAutoScrollActive(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      setIsMusicPlaying(true);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  // 监听用户手动触摸，暂停/恢复自动滚动
  useEffect(() => {
    const handleTouch = () => setAutoScrollActive(false);
    const handleScroll = () => {
      // 如果已经滚到底部，停止
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
        setAutoScrollActive(false);
      }
    };
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 bg-[#FDFBF7] flex flex-col items-center justify-center z-50 px-10 text-center">
        <h2 className="serif-en text-3xl mb-4 tracking-widest text-[#A68966]">INVITATION</h2>
        <div className="w-px h-16 bg-[#A68966] mb-8"></div>
        <p className="mb-12 text-sm tracking-[0.2em] font-light text-[#8A8A8A]">开启属于我们的故事</p>
        <button 
          onClick={startInvitation}
          className="border border-[#A68966] px-8 py-3 rounded-full text-[#A68966] hover:bg-[#A68966] hover:text-white transition-all duration-500 tracking-widest text-sm"
        >
          OPEN
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* 音乐控制浮窗 */}
      <button 
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-40 p-2 rounded-full bg-white/50 backdrop-blur-sm border border-[#A68966]/20 text-[#A68966]"
      >
        {isMusicPlaying ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
      </button>

      {/* 第一屏：封面 */}
      <section className="h-screen flex flex-col justify-center items-center relative px-6 bg-[#FDFBF7]">
        <div className="mb-8 overflow-hidden fade-in-up">
           <img 
            src={WEDDING_CONFIG.mainPhoto} 
            alt="Wedding" 
            className="w-full h-[60vh] object-cover rounded-sm grayscale-[30%] brightness-95"
          />
        </div>
        <div className="text-center fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h1 className="serif-en text-2xl md:text-3xl tracking-[0.15em] mb-4">We're Getting Married</h1>
          <div className="flex items-center justify-center gap-4 text-xl tracking-[0.4em] font-light mb-4">
            <span>{WEDDING_CONFIG.groom}</span>
            <Heart size={14} className="text-[#A68966] fill-[#A68966]" />
            <span>{WEDDING_CONFIG.bride}</span>
          </div>
          <p className="serif-en text-[#A68966] tracking-[0.2em]">{WEDDING_CONFIG.date}</p>
        </div>
        <div className="absolute bottom-10 animate-bounce text-[#A68966]">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* 第二屏：故事引言 */}
      <section className="min-h-screen py-24 px-8 bg-[#FAF8F5] flex flex-col justify-center">
        <div className="max-w-md mx-auto text-center space-y-12">
          <div className="serif-en text-[#A68966] text-xs tracking-[0.3em] uppercase">The Story</div>
          <h2 className="text-2xl leading-relaxed tracking-widest font-light">
            从初见的那一刻起<br/>
            我们就知道<br/>
            余生都会是彼此
          </h2>
          <div className="aspect-[4/5] overflow-hidden">
            <img 
              src={WEDDING_CONFIG.storyPhoto1} 
              alt="Moment" 
              className="w-full h-full object-cover grayscale-[20%]"
            />
          </div>
          <p className="text-sm leading-8 text-[#8A8A8A] tracking-widest font-light px-4">
            在这个温柔的季节里，我们决定把彼此写进未来的每一页。克制而热烈，平淡而永恒。
          </p>
        </div>
      </section>

      {/* 第三屏：仪式感留白 */}
      <section className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-8">
         <div className="w-full max-w-sm">
            <img 
              src={WEDDING_CONFIG.storyPhoto2} 
              alt="Moment 2" 
              className="w-full h-[50vh] object-cover mb-12 shadow-sm"
            />
            <div className="border-l border-[#A68966] pl-6 py-4">
               <p className="text-lg tracking-[0.3em] mb-2 italic serif-en">Save the Date</p>
               <p className="text-sm tracking-widest text-[#8A8A8A]">诚邀您见证我们的重要时刻</p>
            </div>
         </div>
      </section>

      {/* 第四屏：婚礼详情 */}
      <section className="min-h-screen py-24 px-8 bg-[#F4F1ED]">
        <div className="max-w-md mx-auto flex flex-col items-center space-y-16">
          <div className="text-center">
            <h2 className="serif-en text-3xl tracking-widest mb-2">Details</h2>
            <div className="w-10 h-px bg-[#A68966] mx-auto"></div>
          </div>

          <div className="w-full space-y-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <Calendar size={28} strokeWidth={1} className="text-[#A68966]" />
              <div>
                <p className="serif-en text-xl mb-1 tracking-widest">{WEDDING_CONFIG.date}</p>
                <p className="text-xs text-[#8A8A8A] tracking-[0.2em]">{WEDDING_CONFIG.time}</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <MapPin size={28} strokeWidth={1} className="text-[#A68966]" />
              <div>
                <p className="text-lg mb-1 tracking-widest">{WEDDING_CONFIG.location}</p>
                <p className="text-xs text-[#8A8A8A] tracking-wider leading-relaxed px-4">{WEDDING_CONFIG.address}</p>
              </div>
            </div>
          </div>

          <div className="w-full pt-12">
             <div className="aspect-video bg-[#EAE7E2] flex items-center justify-center text-[#A68966] rounded-sm overflow-hidden relative">
                {/* 模拟地图区域 */}
                <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800)'}}></div>
                <div className="relative z-10 text-center px-6 py-4 bg-white/80 backdrop-blur-sm">
                   <p className="text-xs tracking-widest mb-2 font-medium">查看地图导航</p>
                   <button className="text-[10px] border border-[#A68966] px-4 py-1.5 rounded-full uppercase tracking-widest">Open Map</button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 结尾屏 */}
      <section className="h-screen bg-[#FDFBF7] flex flex-col items-center justify-center text-center px-10">
        <div className="w-full max-w-sm mb-12">
           <img 
            src={WEDDING_CONFIG.endingPhoto} 
            alt="The End" 
            className="w-full aspect-[3/4] object-cover rounded-sm grayscale-[40%]"
          />
        </div>
        <p className="serif-en italic text-xl md:text-2xl text-[#A68966] tracking-widest mb-6">
          Thank you for being part of our story
        </p>
        <div className="flex items-center gap-3 text-sm tracking-[0.3em] font-light text-[#8A8A8A]">
           <span>{WEDDING_CONFIG.groom}</span>
           <span className="text-[#A68966]">&</span>
           <span>{WEDDING_CONFIG.bride}</span>
        </div>
        <div className="mt-16 text-[10px] text-[#C4C4C4] tracking-widest uppercase">
          Wedding Invitation 2024
        </div>
      </section>

      {/* 底部功能栏 (WeChat 底部悬浮效果) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40 bg-white/30 backdrop-blur-md px-6 py-2 rounded-full border border-white/50 shadow-sm opacity-80">
          <p className="text-[10px] tracking-widest text-[#A68966] font-medium">TOUCH TO PAUSE SCROLL</p>
      </div>
    </div>
  );
};

export default App;
