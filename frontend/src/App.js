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
  
  // Intern section state
  const [isInternAuthenticated, setIsInternAuthenticated] = useState(false);
  const [internPassword, setInternPassword] = useState('');
  const [internError, setInternError] = useState('');
  const [requests, setRequests] = useState([]);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.name || !formData.email || !formData.phone || formData.services.length === 0) {
      setFormError(t.availability.errorMessage);
      return;
    }
    
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/availability-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language: language
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit request');
      }
      
      const result = await response.json();
      console.log('Form submitted successfully:', result);
      setFormSubmitted(true);
      
      // Reset form after 8 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          services: []
        });
      }, 8000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError(language === 'de' 
        ? 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
        : 'An error occurred. Please try again later.');
    }
  };

  const handleInternLogin = (e) => {
    e.preventDefault();
    // Simple password check - in production, use backend authentication
    if (internPassword === 'OCTA2025') {
      setIsInternAuthenticated(true);
      setInternError('');
      loadRequests();
    } else {
      setInternError(language === 'de' ? 'Falsches Passwort' : 'Incorrect password');
    }
  };

  const loadRequests = async () => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/availability-requests`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
    }
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

            <button
              data-testid="nav-intern"
              className={`nav-item ${activeCategory === 'intern' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('intern');
                if (isInternAuthenticated) loadRequests();
              }}
            >
              <UserCheck className="nav-icon" size={20} />
              <span>{t.nav.intern}</span>
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
          ) : activeCategory === 'availability' ? (
            <div className="content-wrapper">
              <div className="letter-form-container">
                <div className="letter-header">
                  <img src={LOGO_URL} alt="OCTA Logo" className="letter-logo" />
                  <h2 className="letter-title">{t.availability.title}</h2>
                </div>

                <div className="letter-body">
                  <p className="letter-greeting">{t.availability.greeting}</p>
                  <p className="letter-intro">{t.availability.intro}</p>

                  {formSubmitted ? (
                    <div className="success-message" data-testid="success-message">
                      <span className="success-icon">✓</span>
                      <div className="success-text">
                        {t.availability.successMessage.split('\n\n').map((para, idx) => (
                          <p key={idx}>{para}</p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="availability-form">
                      {formError && (
                        <div className="error-message" data-testid="error-message">
                          {formError}
                        </div>
                      )}

                      <div className="form-section">
                        <div className="form-group">
                          <label htmlFor="name" className="form-label">
                            {t.availability.nameLabel} <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            data-testid="input-name"
                            className="form-input"
                            placeholder={t.availability.namePlaceholder}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="email" className="form-label">
                            {t.availability.emailLabel} <span className="required">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            data-testid="input-email"
                            className="form-input"
                            placeholder={t.availability.emailPlaceholder}
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="phone" className="form-label">
                            {t.availability.phoneLabel} <span className="required">*</span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            data-testid="input-phone"
                            className="form-input"
                            placeholder={t.availability.phonePlaceholder}
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="message" className="form-label">
                            {t.availability.messageLabel}
                          </label>
                          <textarea
                            id="message"
                            data-testid="input-message"
                            className="form-textarea"
                            placeholder={t.availability.messagePlaceholder}
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            rows="5"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label services-label">
                            {t.availability.servicesLabel} <span className="required">*</span>
                          </label>
                          <div className="services-checkboxes">
                            {categoryKeys.map((service) => (
                              <label key={service} className="checkbox-label">
                                <input
                                  type="checkbox"
                                  data-testid={`checkbox-${service}`}
                                  checked={formData.services.includes(service)}
                                  onChange={() => handleServiceToggle(service)}
                                  className="checkbox-input"
                                />
                                <span className="checkbox-text">{t.nav[service]}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="letter-closing">
                        <p>{t.availability.closing}</p>
                        <div className="signature-line"></div>
                      </div>

                      <button type="submit" className="submit-button" data-testid="submit-button">
                        {t.availability.submitButton}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ) : activeCategory === 'intern' ? (
            <div className="content-wrapper">
              <h2 className="content-title">{t.intern.title}</h2>
              
              {!isInternAuthenticated ? (
                <div className="intern-login">
                  <form onSubmit={handleInternLogin} className="login-form">
                    <div className="form-group">
                      <label htmlFor="intern-password" className="form-label">
                        {t.intern.passwordLabel}
                      </label>
                      <input
                        type="password"
                        id="intern-password"
                        data-testid="intern-password"
                        className="form-input"
                        value={internPassword}
                        onChange={(e) => setInternPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    
                    {internError && (
                      <div className="error-message">{internError}</div>
                    )}
                    
                    <button type="submit" className="submit-button" data-testid="intern-login-btn">
                      {t.intern.loginButton}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="intern-dashboard">
                  <div className="intern-header">
                    <button 
                      className="logout-button" 
                      onClick={() => {
                        setIsInternAuthenticated(false);
                        setInternPassword('');
                        setRequests([]);
                      }}
                      data-testid="logout-btn"
                    >
                      {t.intern.logoutButton}
                    </button>
                  </div>
                  
                  <h3 className="requests-title">{t.intern.requestsTitle}</h3>
                  
                  {requests.length === 0 ? (
                    <p className="no-requests">{t.intern.noRequests}</p>
                  ) : (
                    <div className="requests-list">
                      {requests.map((request) => (
                        <div key={request.id} className="request-card" data-testid="request-card">
                          <div className="request-header">
                            <h4 className="request-name">{request.name}</h4>
                            <span className="request-date">
                              {new Date(request.timestamp).toLocaleString(language === 'de' ? 'de-DE' : 'en-US')}
                            </span>
                          </div>
                          
                          <div className="request-details">
                            <p><strong>Email:</strong> {request.email}</p>
                            <p><strong>{language === 'de' ? 'Telefon' : 'Phone'}:</strong> {request.phone}</p>
                            
                            <div className="request-services">
                              <strong>{t.intern.services}:</strong>
                              <ul>
                                {request.services.map((service, idx) => (
                                  <li key={idx}>{t.nav[service]}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {request.message && (
                              <div className="request-message">
                                <strong>{t.intern.message}:</strong>
                                <p>{request.message}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
              
              {t.categories[activeCategory].fullText && (
                <div className="full-text-section">
                  {t.categories[activeCategory].fullText.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="full-text-paragraph">{paragraph}</p>
                  ))}
                </div>
              )}
              
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