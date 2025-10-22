import { useState } from 'react';
import './App.css';
import { Home, Users, Stethoscope, HeartHandshake, UserCheck, Leaf, ClipboardCheck, Wrench, Building2, Sparkles, FileText } from 'lucide-react';
import { translations } from './translations';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_sprechen-sie-41/artifacts/xxlap8yl_octagon-simplex-300x300.jpg';

const categoryIcons = {
  z1: Home,
  z2a: Stethoscope,
  z2b: HeartHandshake,
  z3: Users,
  z4: Leaf,
  z5: ClipboardCheck,
  z6: Wrench,
  z7: Building2,
  z8: Sparkles
};

function App() {
  const [activeCategory, setActiveCategory] = useState('home');
  const [language, setLanguage] = useState('de'); // 'de' for German, 'en' for English
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    services: []
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  
  const t = translations[language];
  const categoryKeys = ['z1', 'z2a', 'z2b', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8'];

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.name || !formData.email || !formData.phone || formData.services.length === 0) {
      setFormError(t.availability.errorMessage);
      return;
    }
    
    // Here you would normally send the data to a backend
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        services: []
      });
    }, 5000);
  };

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
              <span>{t.nav.home}</span>
            </button>

            <button
              data-testid="nav-availability"
              className={`nav-item ${activeCategory === 'availability' ? 'active' : ''}`}
              onClick={() => setActiveCategory('availability')}
            >
              <FileText className="nav-icon" size={20} />
              <span>{t.nav.availability}</span>
            </button>
            
            <div className="nav-divider"></div>
            
            {categoryKeys.map((catKey) => {
              const Icon = categoryIcons[catKey];
              return (
                <button
                  key={catKey}
                  data-testid={`nav-${catKey}`}
                  className={`nav-item ${activeCategory === catKey ? 'active' : ''}`}
                  onClick={() => setActiveCategory(catKey)}
                >
                  <Icon className="nav-icon" size={20} />
                  <span>{t.nav[catKey]}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Hauptinhalt */}
        <main className="content" data-testid="main-content">
          {activeCategory === 'home' ? (
            <div className="content-wrapper home-content">
              <h2 className="content-title" data-testid="content-title">{t.home.title}</h2>
              
              <div className="welcome-intro">
                <p className="intro-text">{t.home.intro1}</p>
                <p className="intro-text">{t.home.intro2}</p>
                <p className="intro-text">{t.home.intro3}</p>
              </div>

              <div className="services-overview">
                <h3 className="overview-title">{t.home.servicesTitle}</h3>
                
                <div className="overview-grid">
                  {categoryKeys.map((catKey) => (
                    <div key={catKey} className="overview-item">
                      <strong>{t.overviewItems[catKey].title}</strong>
                      <p>{t.overviewItems[catKey].desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="certifications-section">
                <h3 className="cert-title">{t.home.certTitle}</h3>
                <div className="cert-content">
                  <p className="cert-intro">{t.home.certIntro}</p>
                  
                  <ul className="cert-list">
                    {t.certifications.map((cert, idx) => (
                      <li key={idx} className="cert-item">
                        <strong>{cert.title}</strong>
                        <span className="cert-desc">{cert.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="cta-section">
                <p className="cta-text">{t.home.ctaText}</p>
              </div>
            </div>
          ) : activeCategory === 'impressum' ? (
            <div className="content-wrapper">
              <h2 className="content-title">{t.impressum}</h2>
              <div className="impressum-content">
                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Angaben gemäß § 5 TMG' : 'Information according to § 5 TMG'}</h3>
                  <p><strong>[{language === 'de' ? 'Firmenname' : 'Company Name'}]</strong></p>
                  <p>[{language === 'de' ? 'Straße und Hausnummer' : 'Street and House Number'}]</p>
                  <p>[{language === 'de' ? 'PLZ Ort' : 'Zip Code City'}]</p>
                </section>

                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Kontakt' : 'Contact'}</h3>
                  <p>{language === 'de' ? 'Telefon' : 'Phone'}: [{language === 'de' ? 'Telefonnummer' : 'Phone Number'}]</p>
                  <p>E-Mail: [{language === 'de' ? 'E-Mail-Adresse' : 'Email Address'}]</p>
                </section>

                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Vertreten durch' : 'Represented by'}</h3>
                  <p>[{language === 'de' ? 'Geschäftsführer/in' : 'Managing Director'}]</p>
                </section>

                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Registereintrag' : 'Register Entry'}</h3>
                  <p>{language === 'de' ? 'Eintragung im Handelsregister' : 'Entry in Commercial Register'}</p>
                  <p>{language === 'de' ? 'Registergericht' : 'Register Court'}: [{language === 'de' ? 'Gericht' : 'Court'}]</p>
                  <p>{language === 'de' ? 'Registernummer' : 'Register Number'}: [{language === 'de' ? 'Nummer' : 'Number'}]</p>
                </section>

                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Umsatzsteuer-ID' : 'VAT ID'}</h3>
                  <p>{language === 'de' ? 'Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz:' : 'VAT identification number according to §27a VAT Act:'}</p>
                  <p>[{language === 'de' ? 'USt-IdNr.' : 'VAT ID'}]</p>
                </section>

                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Zuständige Aufsichtsbehörde' : 'Responsible Supervisory Authority'}</h3>
                  <p>[{language === 'de' ? 'Behördenname' : 'Authority Name'}]</p>
                  <p>[{language === 'de' ? 'Adresse' : 'Address'}]</p>
                </section>

                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Berufsbezeichnung und berufsrechtliche Regelungen' : 'Professional Title and Professional Regulations'}</h3>
                  <p>{language === 'de' ? 'Zugelassener Pflegedienst gemäß § 72 SGB XI' : 'Approved care service according to § 72 SGB XI'}</p>
                </section>
              </div>
            </div>
          ) : (
            <div className="content-wrapper">
              <h2 className="content-title" data-testid="content-title">{t.categories[activeCategory].title}</h2>
              <p className="content-description">{t.categories[activeCategory].desc}</p>
              
              <div className="services-section">
                <h3 className="services-title">{t.servicesHeading}</h3>
                <ul className="services-list">
                  {t.categories[activeCategory].services.map((service, index) => (
                    <li key={index} className="service-item" data-testid={`service-${index}`}>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="contact-section">
                <p className="contact-text">{t.contactText}</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer mit Impressum-Link */}
      <footer className="app-footer">
        <button 
          className="impressum-link" 
          data-testid="impressum-link"
          onClick={() => setActiveCategory('impressum')}
        >
          {t.impressum}
        </button>
        <p className="footer-copyright">{t.copyright}</p>
      </footer>
    </div>
  );
}

export default App;