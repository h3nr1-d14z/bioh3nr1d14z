import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router';
import Preloader from '../sections/Preloader';
import Carousel from '../sections/Carousel';
import PerspectiveText from '../sections/PerspectiveText';
import ParallaxReveal from '../sections/ParallaxReveal';
import SkillsMatrix from '../sections/SkillsMatrix';
import Now from '../sections/Now';
import GitHubActivity from '../sections/GitHubActivity';
import Contact from '../sections/Contact';
import ProjectModal from '../components/ProjectModal';
import type { Project } from '../data/projects';

const Hero = lazy(() => import('../sections/Hero'));

function HeroFallback() {
  return <div style={{ height: '100vh', background: '#1c1c1c' }} />;
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const location = useLocation();

  const handlePreloaderComplete = useCallback(() => setIsLoaded(true), []);
  const openProject = useCallback((project: Project) => setActiveProject(project), []);
  const closeProject = useCallback(() => setActiveProject(null), []);

  // Đến trang chủ kèm hash (ví dụ bấm "Contact" từ trang writeup) thì phải
  // cuộn thủ công — trình duyệt chỉ tự xử lý hash với HTML tĩnh, không phải
  // với section vừa mount trong SPA.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      <main>
        <Suspense fallback={<HeroFallback />}>
          <Hero isReady={isLoaded} />
        </Suspense>
        <Carousel onProjectClick={openProject} />
        <PerspectiveText />
        <ParallaxReveal onProjectClick={openProject} />
        <SkillsMatrix />
        <Now />
        <GitHubActivity />
        <Contact />
      </main>
      <ProjectModal project={activeProject} onClose={closeProject} />
    </>
  );
}
