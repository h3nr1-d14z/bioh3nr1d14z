import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Navigation from './sections/Navigation';
import Footer from './sections/Footer';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import TerminalOverlay from './components/TerminalOverlay';
import VisitorCounter from './components/VisitorCounter';
import Home from './pages/Home';

// Writeup kéo theo react-markdown + highlight.js. Tách chunk riêng để trang
// chủ không phải tải phần đó.
const WriteupsIndex = lazy(() => import('./pages/WriteupsIndex'));
const WriteupDetail = lazy(() => import('./pages/WriteupDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return <div className="route-fallback">Loading…</div>;
}

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Navigation />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writeups" element={<WriteupsIndex />} />
          <Route path="/writeups/:slug" element={<WriteupDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <BackToTop />
      <TerminalOverlay />
      <VisitorCounter />
    </>
  );
}
