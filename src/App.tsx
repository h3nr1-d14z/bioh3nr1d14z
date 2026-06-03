import { useState, useCallback, lazy, Suspense } from 'react';
import Preloader from './sections/Preloader';
import Navigation from './sections/Navigation';
import Carousel from './sections/Carousel';
import PerspectiveText from './sections/PerspectiveText';
import ParallaxReveal from './sections/ParallaxReveal';
import SkillsMatrix from './sections/SkillsMatrix';
import GitHubActivity from './sections/GitHubActivity';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import TerminalOverlay from './components/TerminalOverlay';
import VisitorCounter from './components/VisitorCounter';
import ProjectModal from './components/ProjectModal';
import type { Project } from './data/projects';

const Hero = lazy(() => import('./sections/Hero'));

function HeroFallback() {
  return <div style={{ height: '100vh', background: '#1c1c1c' }} />;
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const openProject = useCallback((project: Project) => {
    setActiveProject(project);
  }, []);

  const closeProject = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <>
      <ScrollProgress />
      <Preloader onComplete={handlePreloaderComplete} />
      <Navigation />
      <main>
        <Suspense fallback={<HeroFallback />}>
          <Hero isReady={isLoaded} />
        </Suspense>
        <Carousel onProjectClick={openProject} />
        <PerspectiveText />
        <ParallaxReveal onProjectClick={openProject} />
        <SkillsMatrix />
        <GitHubActivity />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <TerminalOverlay />
      <VisitorCounter />
      <ProjectModal project={activeProject} onClose={closeProject} />
    </>
  );
}
