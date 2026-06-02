import { useState, useCallback } from 'react';
import Preloader from './sections/Preloader';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Carousel from './sections/Carousel';
import PerspectiveText from './sections/PerspectiveText';
import ParallaxReveal from './sections/ParallaxReveal';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      <Navigation />
      <main>
        <Hero isReady={isLoaded} />
        <Carousel />
        <PerspectiveText />
        <ParallaxReveal />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
