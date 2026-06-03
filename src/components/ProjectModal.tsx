import { useEffect, useRef } from 'react';
import { X, Github, ExternalLink } from 'lucide-react';
import type { Project } from '../data/projects';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;

    document.body.style.overflow = 'hidden';

    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (overlay && content) {
      overlay.style.opacity = '0';
      content.style.opacity = '0';
      content.style.transform = 'translateY(30px) scale(0.96)';

      requestAnimationFrame(() => {
        overlay.style.transition = 'opacity 0.35s ease';
        content.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        overlay.style.opacity = '1';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0) scale(1)';
      });
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [project, onClose]);

  const handleClose = () => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (overlay && content) {
      overlay.style.transition = 'opacity 0.25s ease';
      content.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      overlay.style.opacity = '0';
      content.style.opacity = '0';
      content.style.transform = 'translateY(20px) scale(0.98)';
      setTimeout(onClose, 250);
    } else {
      onClose();
    }
  };

  if (!project) return null;

  return (
    <div
      ref={overlayRef}
      className="project-modal__overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div ref={contentRef} className="project-modal__content">
        <button className="project-modal__close" onClick={handleClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="project-modal__image-wrap">
          <img
            src={project.image}
            alt={project.name}
            className="project-modal__image"
            loading="eager"
          />
          <div className="project-modal__image-gradient" />
        </div>

        <div className="project-modal__body">
          <h2 className="project-modal__title">{project.name}</h2>
          <p className="project-modal__desc">{project.description}</p>

          {project.highlights && project.highlights.length > 0 && (
            <ul className="project-modal__highlights">
              {project.highlights.map((h) => (
                <li key={h} className="project-modal__highlight">
                  <span className="project-modal__bullet" />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="project-modal__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="project-modal__tag">{tag}</span>
            ))}
          </div>

          <div className="project-modal__actions">
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-modal__btn project-modal__btn--primary"
            >
              <Github size={16} />
              VIEW SOURCE
            </a>
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-modal__btn project-modal__btn--secondary"
            >
              <ExternalLink size={16} />
              OPEN REPO
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
