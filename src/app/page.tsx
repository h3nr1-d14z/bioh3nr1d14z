'use client';

import ParallaxStars from "../components/ParallaxStars";
import { FaGithub, FaEnvelope, FaFacebook } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const stacks = [
  {
    key: "devops",
    label: "DevOps",
    color: "from-green-400 to-blue-500",
    about: `Fresher DevOps engineer passionate about automation, CI/CD, and cloud infrastructure. I love building reliable pipelines and learning new tools!`,
    skills: ["Linux", "Docker", "CI/CD", "GitHub Actions", "Cloud"],
    projects: [
      { name: "Unity Jenkins Pipeline", desc: "A jenkins pipelnie for building Unity games.", href: "" },
      { name: "Auto Deploy", desc: "CI/CD pipeline for web apps.", href: "" },
    ],
    funFacts: [
      { emoji: "🔧", text: "I script everything!" },
      { emoji: "☁️", text: "Cloud explorer." },
      { emoji: "🚦", text: "Love green builds." }
    ]
  },
  {
    key: "web",
    label: "Web Dev",
    color: "from-fuchsia-500 to-cyan-400",
    about: `Full stack web dev learner, building beautiful, interactive apps with React, Next.js, and modern UI/UX.`,
    skills: ["React", "Next.js", "TypeScript", "TailwindCSS", "UI/UX"],
    projects: [
      { name: "Awesome Portfolio", desc: "Animated, modern portfolio site.", href: "https://github.com/h3nr1-d14z/bioh3nr1d14z" },
      { name: "ITPTIT Wiki", desc: "A member database website (Under development).", href: "https://github.com/h3nr1-d14z/itptit-wiki" },
    ],
    funFacts: [
      { emoji: "🎨", text: "Design + code fan." },
      { emoji: "⚡️", text: "Love fast UIs." },
      { emoji: "🧑‍💻", text: "Always learning." }
    ]
  },
  {
    key: "game",
    label: "Game Dev",
    color: "from-yellow-400 to-pink-500",
    about: `Unity game dev enthusiast, experimenting with gameplay, effects, and interactive worlds.`,
    skills: ["Unity", "C#", "Game Design", "2D/3D", "VFX"],
    projects: [
      { name: "Pixel3D", desc: "A painting pixel Unity game.", href: "https://github.com/h3nr1-d14z/BasePixel3D" },
      { name: "Soundclound", desc: "Showcase of my music.", href: "https://soundcloud.com/ktflunazamora" },
    ],
    funFacts: [
      { emoji: "🎵", text: "Music lover :3" },
      { emoji: "🕹️", text: "Game jam fan." },
      { emoji: "🌌", text: "Large game pool." }
    ]
  },
];

function TerminalAbout({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, [text]);
  return (
    <div className="font-mono bg-black/80 text-green-400 rounded-xl p-6 shadow-lg border border-green-400/20 text-lg w-full max-w-2xl mx-auto mt-12 animate-fade-in-up">
      <span className="text-green-500">$</span> {displayed}
      <span className="animate-blink">|</span>
    </div>
  );
}

export default function Home() {
  const [stack, setStack] = useState(stacks[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle stack switch with animation
  const handleStackSwitch = (s: typeof stacks[0]) => {
    if (stack.key === s.key) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setStack(s);
      setIsTransitioning(false);
    }, 350); // match fade duration
  };

  // 3D Card Hover Effect for Projects
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };
  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = e.currentTarget;
    card.style.transform = '';
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <ParallaxStars />
      {/* Subtle animated noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.08) 100%)', mixBlendMode: 'overlay', animation: 'gradient-x 12s ease-in-out infinite'}} />
      <main className="z-10 flex flex-col items-center justify-center gap-8 py-24 w-full">
        {/* Stack Switcher */}
        <motion.div className="flex gap-4 mb-4" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1, duration:0.7, type:'spring'}}>
          {stacks.map((s) => (
            <button
              key={s.key}
              onClick={() => handleStackSwitch(s)}
              className={`px-5 py-2 rounded-full font-bold text-white bg-gradient-to-r ${s.color} shadow hover:scale-110 transition-all duration-300 ${stack.key === s.key ? "ring-4 ring-white/30" : "opacity-70"}`}
            >
              {s.label}
            </button>
          ))}
        </motion.div>
        {/* Hero Section */}
        <motion.div className="backdrop-blur-md bg-black/30 dark:bg-white/10 rounded-3xl p-10 shadow-2xl border border-white/10" initial={{opacity:0, y:-40}} animate={{opacity:1, y:0}} transition={{duration:0.8, type:'spring'}}>
          <motion.h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg animate-gradient-x" initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.2, duration:0.7}}>
            h3nr1-d14z
          </motion.h1>
          <motion.p className="mt-4 text-xl sm:text-2xl text-white/80 dark:text-white/70 font-medium" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4, duration:0.7}}>
            Creative Coder & UI/UX Enthusiast
          </motion.p>
          <motion.div className="flex gap-6 mt-8 justify-center" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.6, duration:0.7}}>
            <a
              href="https://github.com/h3nr1-d14z"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 p-1.5 shadow-lg hover:scale-110 transition-transform duration-300"
              aria-label="GitHub"
            >
              <FaGithub className="text-2xl text-white group-hover:rotate-[15deg] transition-transform duration-300" />
            </a>
            <a
              href="mailto:leduchieu101@gmail.com"
              className="group rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-1.5 shadow-lg hover:scale-110 transition-transform duration-300"
              aria-label="Email"
            >
              <FaEnvelope className="text-2xl text-white group-hover:rotate-[-15deg] transition-transform duration-300" />
            </a>
            <a
              href="https://facebook.com/ktflunazamora"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 p-1.5 shadow-lg hover:scale-110 transition-transform duration-300"
              aria-label="Facebook"
            >
              <FaFacebook className="text-2xl text-white group-hover:rotate-[10deg] transition-transform duration-300" />
            </a>
          </motion.div>
        </motion.div>
        {/* Terminal About Section */}
        <motion.div className={isTransitioning ? "animate-fade-out" : "animate-fade-in"} key={stack.key + '-about'} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}}>
          <TerminalAbout text={stack.about} />
        </motion.div>
        {/* About Me Section (Skills) */}
        <motion.div className={isTransitioning ? "animate-fade-out" : "animate-fade-in"} key={stack.key + '-skills'} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true, amount:0.2}} transition={{delay:0.1}}>
          <section className="w-full max-w-2xl mt-8">
            <div className="rounded-2xl bg-gradient-to-br from-cyan-900/60 to-fuchsia-900/40 p-8 shadow-xl border border-white/10 backdrop-blur-md">
              <h2 className="text-3xl font-bold text-white mb-2">Skills</h2>
              <div className="flex flex-wrap gap-4">
                {stack.skills.map((skill) => (
                  <motion.span key={skill} whileHover={{scale:1.13, boxShadow:'0 0 16px #0ff'}} className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow transition-transform duration-300">
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </section>
        </motion.div>
        {/* Projects Section */}
        <motion.div className={isTransitioning ? "animate-fade-out" : "animate-fade-in"} key={stack.key + '-projects'} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true, amount:0.2}} transition={{delay:0.1}}>
          <section className="w-full max-w-4xl mt-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {stack.projects.map((proj) => (
                <motion.div
                  key={proj.name}
                  className="group bg-gradient-to-br from-fuchsia-800/60 to-cyan-800/40 rounded-2xl p-6 shadow-lg border border-white/10 transition-all duration-300 hover:shadow-3xl hover:scale-105 card-3d"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  whileHover={{scale:1.07, boxShadow:'0 8px 32px 0 rgba(0,255,255,0.18)'}}
                >
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-fuchsia-400 transition-colors">{proj.name}</h3>
                  <p className="text-white/70 mb-2">{proj.desc}</p>
                  <a href={proj.href} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">View Project →</a>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
        {/* Fun Facts Marquee Section */}
        <motion.section className="w-full max-w-2xl mt-12" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true, amount:0.2}} transition={{delay:0.1}}>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Fun Facts</h2>
          <div className="relative w-full flex justify-center overflow-hidden group py-10 px-10">
            <motion.div
              className="marquee flex gap-8"
              style={{animation: 'marquee 18s linear infinite', maxWidth: '900px'}}
              whileHover={{animationPlayState: 'paused'}}
            >
              {stack.funFacts.concat(stack.funFacts).map((fact, i) => (
                <motion.div
                  key={i}
                  className="min-w-[180px] max-w-[260px] flex items-center gap-2 bg-gradient-to-br from-fuchsia-700/80 to-cyan-700/60 rounded-xl px-6 py-4 text-white text-base font-semibold shadow-lg border border-white/10 hover:z-10 transition-transform duration-300"
                  whileHover={{scale:1.15, zIndex: 20, boxShadow: '0 4px 32px 0 #0ff'}}
                >
                  <motion.span animate={{rotate:[0,10,-10,0], scale:[1,1.2,1]}} transition={{repeat:Infinity, duration:2, delay:i*0.1}} className="text-xl">{fact.emoji}</motion.span>
                  <span>{fact.text}</span>
                </motion.div>
              ))}
            </motion.div>
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </div>
        </motion.section>
        {/* Tech Stack Section */}
        <motion.section className="w-full max-w-2xl mt-16" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true, amount:0.2}} transition={{delay:0.1}}>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Tech Stack</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            <motion.span whileHover={{scale:1.13, boxShadow:'0 0 16px #0ff'}} className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow transition-transform duration-300">Groovy</motion.span>
            <motion.span whileHover={{scale:1.13, boxShadow:'0 0 16px #0ff'}} className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow transition-transform duration-300">NextJS</motion.span>
            <motion.span whileHover={{scale:1.13, boxShadow:'0 0 16px #0ff'}} className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow transition-transform duration-300">NodeJS</motion.span>
            <motion.span whileHover={{scale:1.13, boxShadow:'0 0 16px #0ff'}} className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow transition-transform duration-300">TypeScript</motion.span>
            <motion.span whileHover={{scale:1.13, boxShadow:'0 0 16px #0ff'}} className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow transition-transform duration-300">TailwindCSS</motion.span>
            <motion.span whileHover={{scale:1.13, boxShadow:'0 0 16px #0ff'}} className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow transition-transform duration-300">shadcn/ui</motion.span>
            <motion.span whileHover={{scale:1.13, boxShadow:'0 0 16px #0ff'}} className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow transition-transform duration-300">Unity</motion.span>
            <motion.span whileHover={{scale:1.13, boxShadow:'0 0 16px #0ff'}} className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow transition-transform duration-300">Flask</motion.span>
          </div>
        </motion.section>
        {/* Timeline Section */}
        <motion.section className="w-full max-w-2xl mt-16" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true, amount:0.2}} transition={{delay:0.1}}>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">My Coding Journey</h2>
          <ol className="relative border-l-2 border-fuchsia-500/40 ml-4">
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-fuchsia-500 rounded-full -left-3 ring-8 ring-fuchsia-500/20 animate-bounce" />
              <h3 className="font-bold text-white">2015: First Lines of Code</h3>
              <p className="text-white/70">Started learning HTML & CSS, built my first static site.</p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-cyan-400 rounded-full -left-3 ring-8 ring-cyan-400/20 animate-bounce" />
              <h3 className="font-bold text-white">2017: Tried myself out with Game Development</h3>
              <p className="text-white/70">Took my first step on how to create a game on Unity.</p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full -left-3 ring-8 ring-blue-500/20 animate-bounce" />
              <h3 className="font-bold text-white">2022: Got into college: PTIT</h3>
              <p className="text-white/70">Gained a deeper insight into how to code efficiently.</p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full -left-3 ring-8 ring-blue-500/20 animate-bounce" />
              <h3 className="font-bold text-white">2023: Had my first internship opportunity at GPlay.</h3>
              <p className="text-white/70">This is where I truly experienced how to create a commercial game.</p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full -left-3 ring-8 ring-blue-500/20 animate-bounce" />
              <h3 className="font-bold text-white">2024: Started working at TheOne Game Studio</h3>
              <p className="text-white/70">Began my journey in Game DevOps.</p>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full -left-3 ring-8 ring-fuchsia-500/20 animate-bounce" />
              <h3 className="font-bold text-white">2025: Still Creating!</h3>
              <p className="text-white/70">Always learning, always building, always sharing.</p>
            </li>
          </ol>
        </motion.section>
        {/* Contact Section */}
        <motion.section className="w-full max-w-xl mt-16 mb-24" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true, amount:0.2}} transition={{delay:0.1}}>
          <div className="rounded-2xl bg-gradient-to-br from-cyan-900/60 to-fuchsia-900/40 p-8 shadow-xl border border-white/10 backdrop-blur-md flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-2">Contact</h2>
            <p className="text-white/80 mb-4 text-center">Want to collaborate or just say hi? Reach out to me!</p>
            <motion.a whileHover={{scale:1.09, boxShadow:'0 0 32px #0ff'}} href="mailto:your@email.com" className="px-8 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-bounce">Say Hello</motion.a>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
