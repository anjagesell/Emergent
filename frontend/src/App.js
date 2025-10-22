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
        'Pflegeberatung nach § 37.3',
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
  const [activeCategory, setActiveCategory] = useState('z1');
  
  const currentContent = categories.find(cat => cat.id === activeCategory)?.content;

  return (
    <div className="app-container">
      {/* Header mit Logo */}
      <header className="app-header">
        <img src={LOGO_URL} alt="OCTA Logo" className="logo" />
        <h1 className="company-name">OCTA</h1>
      </header>

      <div className="main-layout">
        {/* Linksseitige Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
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
          {currentContent && (
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
          )}
        </main>
      </div>
    </div>
  );
}

export default App;