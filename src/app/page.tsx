'use client';

import ParallaxStars from "../components/ParallaxStars";
import { FaGithub, FaEnvelope, FaLinkedin } from "react-icons/fa";
import { useState, useEffect } from "react";

const stacks = [
  {
    key: "devops",
    label: "DevOps",
    color: "from-green-400 to-blue-500",
    about: `Fresher DevOps engineer passionate about automation, CI/CD, and cloud infrastructure. I love building reliable pipelines and learning new tools!`,
    skills: ["Linux", "Docker", "CI/CD", "GitHub Actions", "Cloud"],
    projects: [
      { name: "Infra Monitor", desc: "A dashboard for server health & deploys." },
      { name: "Auto Deploy", desc: "CI/CD pipeline for web apps." },
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
      { name: "Awesome Portfolio", desc: "Animated, modern portfolio site." },
      { name: "UI Playground", desc: "Creative UI components & effects." },
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
      { name: "Mini Platformer", desc: "A Unity WebGL platform game." },
      { name: "VFX Lab", desc: "Showcase of custom Unity effects." },
    ],
    funFacts: [
      { emoji: "🎮", text: "Built my own game engine!" },
      { emoji: "🕹️", text: "Game jam fan." },
      { emoji: "🌌", text: "Sci-fi lover." }
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
      <main className="z-10 flex flex-col items-center justify-center gap-8 py-24 w-full">
        {/* Stack Switcher */}
        <div className="flex gap-4 mb-4 animate-fade-in-up">
          {stacks.map((s) => (
            <button
              key={s.key}
              onClick={() => handleStackSwitch(s)}
              className={`px-5 py-2 rounded-full font-bold text-white bg-gradient-to-r ${s.color} shadow hover:scale-110 transition-all duration-300 ${stack.key === s.key ? "ring-4 ring-white/30" : "opacity-70"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {/* Hero Section */}
        <div className="backdrop-blur-md bg-black/30 dark:bg-white/10 rounded-3xl p-10 shadow-2xl border border-white/10 animate-fade-in">
          <h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg animate-gradient-x">
            h3nr1-d14z
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-white/80 dark:text-white/70 font-medium animate-fade-in-up">
            Creative Coder & UI Enthusiast
          </p>
          <div className="flex gap-6 mt-8 justify-center animate-fade-in-up">
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
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 p-1.5 shadow-lg hover:scale-110 transition-transform duration-300"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-2xl text-white group-hover:rotate-[10deg] transition-transform duration-300" />
            </a>
          </div>
        </div>
        {/* Terminal About Section */}
        <div className={isTransitioning ? "animate-fade-out" : "animate-fade-in"} key={stack.key + '-about'}>
          <TerminalAbout text={stack.about} />
        </div>
        {/* About Me Section (Skills) */}
        <div className={isTransitioning ? "animate-fade-out" : "animate-fade-in"} key={stack.key + '-skills'}>
          <section className="w-full max-w-2xl mt-8 animate-fade-in-up">
            <div className="rounded-2xl bg-gradient-to-br from-cyan-900/60 to-fuchsia-900/40 p-8 shadow-xl border border-white/10 backdrop-blur-md">
              <h2 className="text-3xl font-bold text-white mb-2">Skills</h2>
              <div className="flex flex-wrap gap-4">
                {stack.skills.map((skill) => (
                  <span key={skill} className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow hover:scale-110 transition-transform duration-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
        {/* Projects Section */}
        <div className={isTransitioning ? "animate-fade-out" : "animate-fade-in"} key={stack.key + '-projects'}>
          <section className="w-full max-w-4xl mt-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {stack.projects.map((proj) => (
                <div
                  key={proj.name}
                  className="group bg-gradient-to-br from-fuchsia-800/60 to-cyan-800/40 rounded-2xl p-6 shadow-lg border border-white/10 transition-all duration-300 hover:shadow-3xl hover:scale-105 card-3d"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-fuchsia-400 transition-colors">{proj.name}</h3>
                  <p className="text-white/70 mb-2">{proj.desc}</p>
                  <a href="#" className="text-cyan-300 hover:underline">View Project →</a>
                </div>
              ))}
            </div>
          </section>
        </div>
        {/* Fun Facts Marquee Section */}
        <section className="w-full max-w-2xl mt-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Fun Facts</h2>
          <div className="relative w-full overflow-hidden">
            <div className="marquee flex gap-8" style={{animation: 'marquee 18s linear infinite'}}>
              {stack.funFacts.concat(stack.funFacts).map((fact, i) => (
                <div key={i} className="min-w-[220px] flex items-center gap-2 bg-gradient-to-br from-fuchsia-700/80 to-cyan-700/60 rounded-xl px-6 py-4 text-white text-lg font-semibold shadow-lg border border-white/10 animate-fade-in-up hover:scale-105 transition-transform duration-300">
                  <span className="text-2xl">{fact.emoji}</span>
                  <span>{fact.text}</span>
                </div>
              ))}
            </div>
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </div>
        </section>
        {/* Tech Stack Section */}
        <section className="w-full max-w-2xl mt-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Tech Stack</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            <span className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow hover:scale-110 transition-transform duration-300">React</span>
            <span className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow hover:scale-110 transition-transform duration-300">Next.js</span>
            <span className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow hover:scale-110 transition-transform duration-300">TypeScript</span>
            <span className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow hover:scale-110 transition-transform duration-300">TailwindCSS</span>
            <span className="bg-white/10 rounded-full px-5 py-2 text-white text-lg font-semibold shadow hover:scale-110 transition-transform duration-300">shadcn/ui</span>
          </div>
        </section>
        {/* Timeline Section */}
        <section className="w-full max-w-2xl mt-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">My Coding Journey</h2>
          <ol className="relative border-l-2 border-fuchsia-500/40 ml-4">
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-fuchsia-500 rounded-full -left-3 ring-8 ring-fuchsia-500/20 animate-bounce" />
              <h3 className="font-bold text-white">2015: First Lines of Code</h3>
              <p className="text-white/70">Started learning HTML & CSS, built my first static site.</p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-cyan-400 rounded-full -left-3 ring-8 ring-cyan-400/20 animate-bounce" />
              <h3 className="font-bold text-white">2018: Discovered React</h3>
              <p className="text-white/70">Fell in love with component-based UI and interactivity.</p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full -left-3 ring-8 ring-blue-500/20 animate-bounce" />
              <h3 className="font-bold text-white">2022: Next.js & UI Mastery</h3>
              <p className="text-white/70">Built advanced, animated sites and started sharing open source UI ideas.</p>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full -left-3 ring-8 ring-fuchsia-500/20 animate-bounce" />
              <h3 className="font-bold text-white">2025: Still Creating!</h3>
              <p className="text-white/70">Always learning, always building, always sharing.</p>
            </li>
          </ol>
        </section>
        {/* Contact Section */}
        <section className="w-full max-w-xl mt-16 animate-fade-in-up mb-24">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-900/60 to-fuchsia-900/40 p-8 shadow-xl border border-white/10 backdrop-blur-md flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-2">Contact</h2>
            <p className="text-white/80 mb-4 text-center">Want to collaborate or just say hi? Reach out to me!</p>
            <a href="mailto:your@email.com" className="px-8 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-bounce">Say Hello</a>
          </div>
        </section>
      </main>
    </div>
  );
}
