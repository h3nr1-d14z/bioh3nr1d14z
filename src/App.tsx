import { useState, useCallback } from 'react';
import Preloader from './sections/Preloader';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
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

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <ScrollProgress />
      <Preloader onComplete={handlePreloaderComplete} />
      <Navigation />
      <main>
        <Hero isReady={isLoaded} />
        <Carousel />
        <PerspectiveText />
        <ParallaxReveal />
        <SkillsMatrix />
        <GitHubActivity />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <TerminalOverlay />
      <VisitorCounter />
    </>
  );
}
