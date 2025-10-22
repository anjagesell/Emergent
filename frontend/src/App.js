import { useState } from 'react';
import './App.css';
import { Home, Users, Stethoscope, HeartHandshake, UserCheck, Leaf, ClipboardCheck, Wrench, Building2, Sparkles } from 'lucide-react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_sprechen-sie-41/artifacts/xxlap8yl_octagon-simplex-300x300.jpg';

const categories = [
  {
    id: 'z1',
    title: 'Z1: Hauswirtschaftliche Hilfe',
    icon: Home,
    content: {
      title: 'Hauswirtschaftliche Hilfe',
      description: 'Professionelle Unterstützung im Haushalt für ein selbstbestimmtes Leben.',
      services: [
        'Reinigung und Pflege der Wohnräume',
        'Wäsche waschen und bügeln',
        'Einkaufen und Besorgungen',
        'Zubereitung von Mahlzeiten',
        'Unterstützung bei der Haushaltsführung'
      ]
    }
  },
  {
    id: 'z2a',
    title: 'Z2a: Pflegefach',
    icon: Stethoscope,
    content: {
      title: 'Pflegefach',
      description: 'Fachgerechte pflegerische Versorgung durch qualifiziertes Personal.',
      services: [
        'Grundpflege und Behandlungspflege',
        'Medikamentengabe',
        'Wundversorgung',
        'Vitalzeichenkontrolle',
        'Dokumentation nach Standards'
      ]
    }
  },
  {
    id: 'z2b',
    title: 'Z2b: Pflege Plus',
    icon: HeartHandshake,
    content: {
      title: 'Pflege Plus',
      description: 'Erweiterte Pflegeleistungen für besondere Bedürfnisse.',
      services: [
        'Intensivpflege',
        'Spezialisierte Demenzbetreuung',
        '24-Stunden-Betreuung',
        'Palliativpflege',
        'Individuelle Pflegekonzepte'
      ]
    }
  },
  {
    id: 'z3',
    title: 'Z3: Betreuungshilfe',
    icon: Users,
    content: {
      title: 'Betreuungshilfe',
      description: 'Persönliche Begleitung und soziale Betreuung im Alltag.',
      services: [
        'Alltagsbegleitung',
        'Gespräche und soziale Kontakte',
        'Begleitung zu Terminen',
        'Freizeitgestaltung',
        'Kognitive Aktivierung'
      ]
    }
  },
  {
    id: 'z4',
    title: 'Z4: Garten Dienste',
    icon: Leaf,
    content: {
      title: 'Garten Dienste',
      description: 'Professionelle Gartenpflege für Ihr grünes Zuhause.',
      services: [
        'Rasenpflege und Mähen',
        'Beet- und Strauchpflege',
        'Heckenschnitt',
        'Winterdienst',
        'Gartenpflege nach Bedarf'
      ]
    }
  },
  {
    id: 'z5',
    title: 'Z5: Beratung und Assessment',
    icon: ClipboardCheck,
    content: {
      title: 'Beratung und Assessment',
      description: 'Umfassende Beratung und Bedarfsermittlung für Ihre individuelle Situation.',
      services: [
        'Pflegeberatung nach § 37.3 SGB XI',
        'Bedarfsermittlung und Assessment',
        'Hilfe bei Antragsstellung',
        'Individuelle Pflegeplanung',
        'Angehörigenberatung'
      ]
    }
  },
  {
    id: 'z6',
    title: 'Z6: Hausmeisterdienste',
    icon: Wrench,
    content: {
      title: 'Hausmeisterdienste',
      description: 'Zuverlässige Hausmeisterleistungen für Ihr Zuhause.',
      services: [
        'Kleinreparaturen',
        'Glühbirnenwechsel',
        'Möbelmontage',
        'Technische Wartung',
        'Handwerkliche Unterstützung'
      ]
    }
  },
  {
    id: 'z7',
    title: 'Z7: Betreutes Wohnen',
    icon: Building2,
    content: {
      title: 'Betreutes Wohnen',
      description: 'Selbstständig leben mit Sicherheit und Betreuung.',
      services: [
        'Barrierefreie Wohnungen',
        'Notrufservice 24/7',
        'Gemeinschaftsangebote',
        'Wahlleistungen nach Bedarf',
        'Soziale Betreuung'
      ]
    }
  },
  {
    id: 'z8',
    title: 'Z8: Wohlfühlstation',
    icon: Sparkles,
    content: {
      title: 'Wohlfühlstation',
      description: 'Wellness und Wohlbefinden für Körper und Seele.',
      services: [
        'Entspannungsangebote',
        'Aktivierende Pflege',
        'Wellness-Behandlungen',
        'Gedächtnistraining',
        'Kulturelle Aktivitäten'
      ]
    }
  }
];

function App() {
  const [activeCategory, setActiveCategory] = useState('home');
  const [language, setLanguage] = useState('de'); // 'de' for German, 'en' for English
  
  const currentContent = categories.find(cat => cat.id === activeCategory)?.content;

  return (
    <div className="app-container">
      {/* Header mit Logo */}
      <header className="app-header">
        {/* Language Switcher */}
        <div className="language-switcher">
          <button
            className={`flag-button ${language === 'de' ? 'active' : ''}`}
            onClick={() => setLanguage('de')}
            title="Deutsch"
            data-testid="flag-de"
          >
            🇩🇪
          </button>
          <button
            className={`flag-button ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
            title="English"
            data-testid="flag-en"
          >
            🇺🇸
          </button>
        </div>
        
        <img src={LOGO_URL} alt="OCTA Logo" className="logo" />
        <h1 className="company-name">OCTA</h1>
        <p className="company-tagline">
          {language === 'de' 
            ? 'Ganzheitliche Pflege- und Betreuungsdienstleistungen'
            : 'Comprehensive Care and Support Services'}
        </p>
      </header>

      <div className="main-layout">
        {/* Linksseitige Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button
              data-testid="nav-home"
              className={`nav-item ${activeCategory === 'home' ? 'active' : ''}`}
              onClick={() => setActiveCategory('home')}
            >
              <Home className="nav-icon" size={20} />
              <span>Startseite</span>
            </button>
            
            <div className="nav-divider"></div>
            
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  data-testid={`nav-${category.id}`}
                  className={`nav-item ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <Icon className="nav-icon" size={20} />
                  <span>{category.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Hauptinhalt */}
        <main className="content" data-testid="main-content">
          {activeCategory === 'home' ? (
            <div className="content-wrapper home-content">
              <h2 className="content-title" data-testid="content-title">Willkommen bei OCTA</h2>
              
              <div className="welcome-intro">
                <p className="intro-text">
                  Als zertifizierter Dienstleister für ganzheitliche Pflege- und Betreuungsleistungen stehen wir pflegebedürftigen und schwerbehinderten Menschen in allen Lebenslagen zur Seite – ob die benötigte Unterstützung geringfügiger oder komplexer Natur ist. Unsere Dienststelle vereint professionelle Pflege, hauswirtschaftliche Unterstützung und individuelle Betreuungsangebote unter einem Dach, um ein selbstbestimmtes und würdevolles Leben in den eigenen vier Wänden oder in betreuten Wohnformen zu ermöglichen.
                </p>
                
                <p className="intro-text">
                  Alle Dienste von OCTA dienen letztlich einem gemeinsamen Ziel: Menschen mit Pflegebedarf oder Schwerbehinderung ein verlässlicher Partner zu sein – von der kleinsten alltäglichen Hilfestellung bis hin zur umfassenden pflegerischen Versorgung. Mit unserem interdisziplinären Team aus examinierten Pflegefachkräften, zertifizierten Betreuungskräften und qualifizierten Hauswirtschaftskräften bieten wir Ihnen maßgeschneiderte Lösungen, die sich flexibel an Ihren individuellen Bedürfnissen und Ihrer jeweiligen Lebenssituation orientieren.
                </p>
                
                <p className="intro-text">
                  Unser Anspruch ist es, durch fachliche Kompetenz, Herzenswärme und Zuverlässigkeit Lebensqualität zu schaffen und zu erhalten – unabhängig davon, ob Sie leichte Unterstützung im Haushalt, intensive pflegerische Betreuung oder eine Kombination verschiedener Leistungen benötigen.
                </p>
              </div>

              <div className="services-overview">
                <h3 className="overview-title">Unsere Leistungsbereiche im Überblick:</h3>
                
                <div className="overview-grid">
                  <div className="overview-item">
                    <strong>Z1: Hauswirtschaftliche Hilfe</strong>
                    <p>Professionelle Unterstützung im Haushalt für ein gepflegtes Wohnumfeld</p>
                  </div>
                  
                  <div className="overview-item">
                    <strong>Z2a: Pflegefach</strong>
                    <p>Fachgerechte pflegerische Versorgung durch qualifizierte Pflegekräfte</p>
                  </div>
                  
                  <div className="overview-item">
                    <strong>Z2b: Pflege Plus</strong>
                    <p>Erweiterte Pflegeleistungen für besondere und intensive Bedarfe</p>
                  </div>
                  
                  <div className="overview-item">
                    <strong>Z3: Betreuungshilfe</strong>
                    <p>Soziale Begleitung und Aktivierung im Alltag</p>
                  </div>
                  
                  <div className="overview-item">
                    <strong>Z4: Garten Dienste</strong>
                    <p>Pflege und Instandhaltung Ihrer Außenanlagen</p>
                  </div>
                  
                  <div className="overview-item">
                    <strong>Z5: Beratung und Assessment</strong>
                    <p>Kompetente Beratung und individuelle Bedarfsermittlung</p>
                  </div>
                  
                  <div className="overview-item">
                    <strong>Z6: Hausmeisterdienste</strong>
                    <p>Zuverlässige handwerkliche Dienstleistungen für Ihr Zuhause</p>
                  </div>
                  
                  <div className="overview-item">
                    <strong>Z7: Betreutes Wohnen</strong>
                    <p>Selbstständiges Wohnen mit bedarfsgerechter Unterstützung</p>
                  </div>
                  
                  <div className="overview-item">
                    <strong>Z8: Wohlfühlstation</strong>
                    <p>Wellness und ganzheitliche Förderung von Körper und Geist</p>
                  </div>
                </div>
              </div>

              <div className="certifications-section">
                <h3 className="cert-title">Unsere Qualifikationen und Zertifizierungen</h3>
                <div className="cert-content">
                  <p className="cert-intro">
                    Alle unsere Leistungen werden von qualifiziertem und zertifiziertem Personal erbracht, das den gesetzlichen Anforderungen der deutschen Pflegegesetzgebung entspricht:
                  </p>
                  
                  <ul className="cert-list">
                    <li className="cert-item">
                      <strong>Pflegefachkräfte nach § 71 SGB XI</strong>
                      <span className="cert-desc">Examinierte Altenpfleger/innen und Gesundheits- und Krankenpfleger/innen mit staatlicher Anerkennung</span>
                    </li>
                    
                    <li className="cert-item">
                      <strong>Betreuungskräfte nach § 43b SGB XI</strong>
                      <span className="cert-desc">Qualifizierte Betreuungskräfte für zusätzliche Betreuungs- und Aktivierungsleistungen in der Pflege</span>
                    </li>
                    
                    <li className="cert-item">
                      <strong>Hauswirtschaftskräfte nach § 53c SGB XI</strong>
                      <span className="cert-desc">Qualifiziertes Personal für hauswirtschaftliche Versorgungsleistungen</span>
                    </li>
                    
                    <li className="cert-item">
                      <strong>Pflegeberatung nach § 37 Abs. 3 SGB XI</strong>
                      <span className="cert-desc">Zertifizierte Pflegeberater/innen für Beratungsbesuche bei häuslicher Pflege</span>
                    </li>
                    
                    <li className="cert-item">
                      <strong>Häusliche Krankenpflege nach § 132a SGB V</strong>
                      <span className="cert-desc">Zugelassene Leistungserbringer für ambulante Pflegeleistungen</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="cta-section">
                <p className="cta-text">
                  Wählen Sie aus der Navigation einen unserer Leistungsbereiche aus, um detaillierte Informationen zu erhalten, oder kontaktieren Sie uns für eine persönliche Beratung.
                </p>
              </div>
            </div>
          ) : currentContent ? (
            <div className="content-wrapper">
              <h2 className="content-title" data-testid="content-title">{currentContent.title}</h2>
              <p className="content-description">{currentContent.description}</p>
              
              <div className="services-section">
                <h3 className="services-title">Unsere Leistungen:</h3>
                <ul className="services-list">
                  {currentContent.services.map((service, index) => (
                    <li key={index} className="service-item" data-testid={`service-${index}`}>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="contact-section">
                <p className="contact-text">
                  Für weitere Informationen zu unseren Leistungen kontaktieren Sie uns gerne.
                </p>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {/* Footer mit Impressum-Link */}
      <footer className="app-footer">
        <button 
          className="impressum-link" 
          data-testid="impressum-link"
          onClick={() => setActiveCategory('impressum')}
        >
          Impressum
        </button>
        <p className="footer-copyright">© 2025 OCTA - Alle Rechte vorbehalten</p>
      </footer>

      {/* Impressum Modal/Page */}
      {activeCategory === 'impressum' && (
        <div className="modal-overlay" onClick={() => setActiveCategory('home')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveCategory('home')}>✕</button>
            <h2 className="modal-title">Impressum</h2>
            
            <div className="impressum-content">
              <section className="impressum-section">
                <h3>Angaben gemäß § 5 TMG</h3>
                <p><strong>[Firmenname]</strong></p>
                <p>[Straße und Hausnummer]</p>
                <p>[PLZ Ort]</p>
              </section>

              <section className="impressum-section">
                <h3>Kontakt</h3>
                <p>Telefon: [Telefonnummer]</p>
                <p>E-Mail: [E-Mail-Adresse]</p>
              </section>

              <section className="impressum-section">
                <h3>Vertreten durch</h3>
                <p>[Geschäftsführer/in]</p>
              </section>

              <section className="impressum-section">
                <h3>Registereintrag</h3>
                <p>Eintragung im Handelsregister</p>
                <p>Registergericht: [Gericht]</p>
                <p>Registernummer: [Nummer]</p>
              </section>

              <section className="impressum-section">
                <h3>Umsatzsteuer-ID</h3>
                <p>Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz:</p>
                <p>[USt-IdNr.]</p>
              </section>

              <section className="impressum-section">
                <h3>Zuständige Aufsichtsbehörde</h3>
                <p>[Behördenname]</p>
                <p>[Adresse]</p>
              </section>

              <section className="impressum-section">
                <h3>Berufsbezeichnung und berufsrechtliche Regelungen</h3>
                <p>Zugelassener Pflegedienst gemäß § 72 SGB XI</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;