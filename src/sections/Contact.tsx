import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      },
    });

    if (leftRef.current) {
      tl.fromTo(
        leftRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }

    if (rightRef.current) {
      tl.fromTo(
        rightRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.8'
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Message transmitted to Discord!', {
        description: 'I will get back to you soon.',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch {
      toast.error('Transmission failed.', {
        description: 'Please try again or reach out via socials.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="contact" id="contact">
      <div className="contact__grid">
        <div ref={leftRef}>
          <h2 className="contact__heading">INITIALIZE CONTACT</h2>
          <p className="contact__body">
            Got a system that needs building, a network that needs securing, or a game that needs modding? Let&apos;s talk.
          </p>
          <div className="contact__socials">
            <a
              href="https://github.com/h3nr1-d14z"
              target="_blank"
              rel="noopener noreferrer"
              className="contact__social"
            >
              GitHub
            </a>
            <a
              href="https://www.facebook.com/h3nr1.d14z"
              target="_blank"
              rel="noopener noreferrer"
              className="contact__social"
            >
              Facebook
            </a>
          </div>
        </div>
        <div ref={rightRef}>
          <form className="contact__form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              className="contact__input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="contact__input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <textarea
              placeholder="Message"
              className="contact__textarea"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
            <button type="submit" className="contact__submit" disabled={isSubmitting}>
              {isSubmitting ? 'TRANSMITTING...' : 'TRANSMIT'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
