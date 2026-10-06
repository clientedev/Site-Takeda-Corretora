import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Instagram, Menu, ShieldCheck, X } from 'lucide-react';
import { servicesData } from '@/data/services';
import { InstagramEmbed } from '@/components/instagram-embed';

export default function ServicesPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="site-shell">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="/" aria-label="Takeda Seguros — início">
            <img
              src="/images/takeda-logo-official.png"
              alt="Logo Takeda Seguros"
              className="brand-logo-img"
            />
            <span className="wordmark-name">
              <span className="wordmark-title">Takeda <em>Seguros</em></span>
            </span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="services-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav
            id="services-navigation"
            className={menuOpen ? 'navigation is-open' : 'navigation'}
            aria-label="Navegação secundária"
          >
            <a href="/" onClick={() => setMenuOpen(false)}>Início</a>
            <a href="/#sobre" onClick={() => setMenuOpen(false)}>Sobre a Takeda</a>
            <a href="/#vida" onClick={() => setMenuOpen(false)}>Seguro de vida</a>
            <a href="/#prev" onClick={() => setMenuOpen(false)}>Previdência</a>
            <a href="/#contato" className="nav-contact" onClick={() => setMenuOpen(false)}>
              Solicitar cotação <ArrowUpRight size={15} />
            </a>
          </nav>
        </div>
      </header>

      <main id="conteudo" className="services-page-main">
        <section className="services-header-section">
          <div className="section-wrap">
            <div className="services-breadcrumbs">
              <a href="/" className="services-back-btn">
                <ArrowLeft size={16} />
                <span>Voltar para a página inicial</span>
              </a>
            </div>

            <div className="services-header-content">
              <p className="eyebrow">
                Soluções & Consultoria <span className="eyebrow-line" />
              </p>
              <h1>
                Nossos <i>Serviços</i>
              </h1>
              <p className="services-header-lede">
                A Takeda Corretora oferece soluções completas e desenhadas sob medida para proteger o seu presente
                e estruturar o seu futuro financeiro. Abaixo, confira as publicações oficiais do nosso Instagram
                apresentando nossos serviços com transparência, didática e exemplos práticos.
              </p>

              <div className="services-header-badges">
                <a
                  href="https://www.instagram.com/takedacorretora_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="services-profile-pill"
                >
                  <Instagram size={17} />
                  <span>Siga @takedacorretora_ no Instagram</span>
                  <ArrowUpRight size={15} />
                </a>

                <div className="services-trust-mini">
                  <ShieldCheck size={18} />
                  <span>Conteúdos informativos e consultoria sem compromisso</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="services-grid-section">
          <div className="section-wrap">
            <div className="services-dedicated-grid">
              {servicesData.map((post) => (
                <InstagramEmbed key={post.id} post={post} />
              ))}
            </div>

            <div className="services-cta-banner">
              <div className="services-cta-text">
                <h3>Precisa de uma recomendação personalizada?</h3>
                <p>
                  Cada momento de vida exige uma estratégia singular. Converse diretamente com a nossa corretora
                  para tirar dúvidas ou solicitar uma cotação sob medida sem qualquer custo.
                </p>
              </div>
              <a href="/#contato" className="button button-dark">
                Falar com a Takeda <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <a className="wordmark footer-mark" href="/">
            <span className="wordmark-name">
              Takeda <em>Corretora</em>
              <small>PROTEÇÃO COM CLAREZA</small>
            </span>
          </a>
          <p>
            Seguro de vida e previdência privada<br />
            com atendimento consultivo e independente.
          </p>
          <a href="https://www.instagram.com/takedacorretora_/" target="_blank" rel="noreferrer">
            @takedacorretora_ <ArrowUpRight size={14} />
          </a>
          <span className="copyright">
            © {new Date().getFullYear()} Takeda Corretora · Todos os direitos reservados
          </span>
        </div>
      </footer>
    </div>
  );
}
