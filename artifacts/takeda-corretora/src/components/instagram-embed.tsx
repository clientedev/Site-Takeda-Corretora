import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Instagram } from 'lucide-react';
import { ServicePost } from '@/data/services';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: (element?: HTMLElement) => void;
      };
    };
  }
}

// Singleton helper to ensure embed.js script is appended only once
let scriptPromise: Promise<void> | null = null;

function loadInstagramScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.instgrm) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve) => {
    const existing = document.getElementById('instagram-embed-script') as HTMLScriptElement | null;
    if (existing) {
      if (window.instgrm) {
        resolve();
      } else {
        existing.addEventListener('load', () => resolve());
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'instagram-embed-script';
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve(); // Graceful degradation
    document.body.appendChild(script);
  });

  return scriptPromise;
}

interface InstagramEmbedProps {
  post: ServicePost;
  className?: string;
}

export function InstagramEmbed({ post, className = '' }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Lazy loading observer
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  // Process embed once in view
  useEffect(() => {
    if (!inView) return;

    let isCancelled = false;

    loadInstagramScript().then(() => {
      if (isCancelled) return;
      if (window.instgrm?.Embeds?.process) {
        if (containerRef.current) {
          window.instgrm.Embeds.process(containerRef.current);
        } else {
          window.instgrm.Embeds.process();
        }
      }
      // Give a brief buffer for iframe rendering
      const timer = setTimeout(() => {
        if (!isCancelled) setLoaded(true);
      }, 700);
      return () => clearTimeout(timer);
    });

    return () => {
      isCancelled = true;
    };
  }, [inView, post.id]);

  return (
    <article className={`instagram-card-wrapper ${className}`} ref={containerRef}>
      <div className="instagram-card-topbar">
        <div className="instagram-card-brand">
          <span className="instagram-icon-pill">
            <Instagram size={14} />
          </span>
          <div>
            <strong>@takedacorretora_</strong>
            <small>{post.category || 'Serviço & Proteção'}</small>
          </div>
        </div>

        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-direct-link"
          aria-label={`Abrir post ${post.id} no Instagram`}
        >
          <span>Abrir</span>
          <ArrowUpRight size={14} />
        </a>
      </div>

      <div className="instagram-embed-viewport">
        {inView && (
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={post.url}
            data-instgrm-version="14"
            style={{
              background: '#FFFFFF',
              border: 0,
              borderRadius: '12px',
              boxShadow: 'none',
              margin: '0 auto',
              maxWidth: '540px',
              minWidth: '280px',
              padding: 0,
              width: '100%',
            }}
          >
            <div style={{ padding: '16px' }}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#FFFFFF',
                  lineHeight: 0,
                  padding: '0 0',
                  textAlign: 'center',
                  textDecoration: 'none',
                  width: '100%',
                  display: 'block',
                  color: '#243342',
                  fontSize: '13px',
                }}
              >
                Ver esta publicação no Instagram
              </a>
            </div>
          </blockquote>
        )}

        {!loaded && (
          <div className="instagram-skeleton-overlay">
            <div className="instagram-skeleton-spinner" />
            <p>Carregando publicação do Instagram...</p>
          </div>
        )}
      </div>

      <div className="instagram-card-footer">
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="button button-instagram"
        >
          <Instagram size={16} />
          <span>Ver publicação no Instagram</span>
          <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
}
