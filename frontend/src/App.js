import { useState } from 'react';
import './App.css';
import { Home, Users, Stethoscope, HeartHandshake, UserCheck, Leaf, ClipboardCheck, Wrench, Building2, Sparkles, FileText, Briefcase } from 'lucide-react';
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
  z8: Sparkles,
  z9: Briefcase
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
  
  // Job application form state
  const [jobFormData, setJobFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: ''
  });
  const [jobFormSubmitted, setJobFormSubmitted] = useState(false);
  const [jobFormError, setJobFormError] = useState('');
  
  // Intern section state
  const [isInternAuthenticated, setIsInternAuthenticated] = useState(false);
  const [internPassword, setInternPassword] = useState('');
  const [internError, setInternError] = useState('');
  const [requests, setRequests] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [internActiveTab, setInternActiveTab] = useState('availability'); // 'availability' or 'jobs'
  
  const t = translations[language];
  const categoryKeys = ['z1', 'z2a', 'z2b', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'z9'];

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
    if (internPassword === 'Morpheus') {
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
          ) : activeCategory === 'datenschutz' ? (
            <div className="content-wrapper">
              <h2 className="content-title">{t.datenschutz}</h2>
              
              <div className="legal-content">
                {language === 'de' ? (
                  <>
                    <section className="legal-section">
                      <h3>1. Datenschutz auf einen Blick</h3>
                      <h4>Allgemeine Hinweise</h4>
                      <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.</p>
                    </section>

                    <section className="legal-section">
                      <h3>2. Datenerfassung auf dieser Website</h3>
                      <h4>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
                      <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
                      
                      <h4>Wie erfassen wir Ihre Daten?</h4>
                      <p>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</p>
                      <p>Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.</p>
                      
                      <h4>Wofür nutzen wir Ihre Daten?</h4>
                      <p>Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden oder um Sie über unsere Dienstleistungen zu informieren, wenn Sie eine Verfügbarkeitsanfrage gestellt haben.</p>
                      
                      <h4>Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
                      <p>Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.</p>
                      <p>Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.</p>
                    </section>

                    <section className="legal-section">
                      <h3>3. Hosting</h3>
                      <p>Wir hosten die Inhalte unserer Website bei einem externen Dienstleister. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v.a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.</p>
                      <p>Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).</p>
                    </section>

                    <section className="legal-section">
                      <h3>4. Allgemeine Hinweise und Pflichtinformationen</h3>
                      <h4>Datenschutz</h4>
                      <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
                      <p>Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.</p>
                      <p>Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.</p>
                      
                      <h4>Hinweis zur verantwortlichen Stelle</h4>
                      <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
                      <p><strong>Lois Schmidt</strong><br />
                      Gilmerdingen<br />
                      Niedersachsen, Deutschland<br />
                      E-Mail: Alltagshilfe007@web.de</p>
                      <p>Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z.B. Namen, E-Mail-Adressen o. Ä.) entscheidet.</p>
                    </section>

                    <section className="legal-section">
                      <h3>5. Datenerfassung auf dieser Website</h3>
                      <h4>Kontaktformular</h4>
                      <p>Wenn Sie uns per Kontaktformular (Verfügbarkeitsanfrage) Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
                      <p>Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde.</p>
                      <p>Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z.B. nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.</p>
                    </section>

                    <section className="legal-section">
                      <h3>6. Ihre Rechte</h3>
                      <h4>Auskunftsrecht</h4>
                      <p>Sie haben das Recht, jederzeit Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten.</p>
                      
                      <h4>Recht auf Berichtigung</h4>
                      <p>Sie haben das Recht, die Berichtigung unrichtiger oder Vervollständigung unvollständiger personenbezogener Daten zu verlangen.</p>
                      
                      <h4>Recht auf Löschung</h4>
                      <p>Sie haben das Recht, die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen, soweit nicht die Verarbeitung zur Ausübung des Rechts auf freie Meinungsäußerung und Information, zur Erfüllung einer rechtlichen Verpflichtung, aus Gründen des öffentlichen Interesses oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.</p>
                      
                      <h4>Recht auf Einschränkung der Verarbeitung</h4>
                      <p>Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen, wenn die Richtigkeit der Daten von Ihnen bestritten wird, die Verarbeitung unrechtmäßig ist, Sie aber deren Löschung ablehnen.</p>
                      
                      <h4>Recht auf Datenübertragbarkeit</h4>
                      <p>Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen.</p>
                      
                      <h4>Widerspruchsrecht</h4>
                      <p>Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen.</p>
                      
                      <h4>Beschwerderecht</h4>
                      <p>Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Zuständig ist die Aufsichtsbehörde Ihres üblichen Aufenthaltsortes, Ihres Arbeitsplatzes oder unseres Unternehmenssitzes.</p>
                    </section>

                    <section className="legal-section">
                      <h3>7. Speicherdauer</h3>
                      <p>Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z.B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.</p>
                    </section>

                    <section className="legal-section">
                      <p><strong>Stand: Januar 2025</strong></p>
                      <p>Diese Datenschutzerklärung entspricht den Anforderungen der EU-Datenschutz-Grundverordnung (DSGVO) in der aktuell gültigen Fassung.</p>
                    </section>
                  </>
                ) : (
                  <>
                    <section className="legal-section">
                      <h3>1. Data Protection at a Glance</h3>
                      <h4>General Information</h4>
                      <p>The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to personally identify you. For detailed information on data protection, please refer to our privacy policy listed below this text.</p>
                    </section>

                    <section className="legal-section">
                      <h3>2. Data Collection on this Website</h3>
                      <h4>Who is responsible for data collection on this website?</h4>
                      <p>Data processing on this website is carried out by the website operator. You can find their contact details in the imprint of this website.</p>
                      
                      <h4>How do we collect your data?</h4>
                      <p>Your data is collected in part by you providing it to us. This may be data that you enter into a contact form, for example.</p>
                      <p>Other data is collected automatically or with your consent when you visit the website by our IT systems. This is mainly technical data (e.g. internet browser, operating system, or time of page access). This data is collected automatically as soon as you enter this website.</p>
                      
                      <h4>What do we use your data for?</h4>
                      <p>Some of the data is collected to ensure error-free provision of the website. Other data may be used to analyze your user behavior or to inform you about our services if you have submitted an availability request.</p>
                      
                      <h4>What rights do you have regarding your data?</h4>
                      <p>You have the right to receive information about the origin, recipient, and purpose of your stored personal data free of charge at any time. You also have the right to request correction or deletion of this data. If you have given consent to data processing, you can revoke this consent at any time for the future. You also have the right to request restriction of the processing of your personal data under certain circumstances. Furthermore, you have the right to lodge a complaint with the competent supervisory authority.</p>
                      <p>You can contact us at any time regarding this and other questions about data protection.</p>
                    </section>

                    <section className="legal-section">
                      <h3>3. Hosting</h3>
                      <p>We host the content of our website with an external service provider. The personal data collected on this website is stored on the host's servers. This may include IP addresses, contact requests, meta and communication data, contract data, contact details, names, website accesses, and other data generated via a website.</p>
                      <p>The host is used for the purpose of fulfilling contracts with our potential and existing customers (Art. 6 Para. 1 lit. b GDPR) and in the interest of secure, fast, and efficient provision of our online offer by a professional provider (Art. 6 Para. 1 lit. f GDPR).</p>
                    </section>

                    <section className="legal-section">
                      <h3>4. General Information and Mandatory Information</h3>
                      <h4>Data Protection</h4>
                      <p>The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with statutory data protection regulations and this privacy policy.</p>
                      <p>When you use this website, various personal data is collected. Personal data is data that can be used to personally identify you. This privacy policy explains what data we collect and what we use it for. It also explains how and for what purpose this happens.</p>
                      <p>We point out that data transmission on the Internet (e.g. when communicating by email) can have security gaps. Complete protection of data against access by third parties is not possible.</p>
                      
                      <h4>Note on the Responsible Party</h4>
                      <p>The responsible party for data processing on this website is:</p>
                      <p><strong>Lois Schmidt</strong><br />
                      Gilmerdingen<br />
                      Lower Saxony, Germany<br />
                      Email: Alltagshilfe007@web.de</p>
                      <p>The responsible party is the natural or legal person who alone or jointly with others determines the purposes and means of processing personal data (e.g. names, email addresses, etc.).</p>
                    </section>

                    <section className="legal-section">
                      <h3>5. Data Collection on this Website</h3>
                      <h4>Contact Form</h4>
                      <p>If you send us inquiries via the contact form (availability request), your details from the inquiry form, including the contact details you provided there, will be stored by us for the purpose of processing the inquiry and in case of follow-up questions. We do not pass on this data without your consent.</p>
                      <p>This data is processed on the basis of Art. 6 Para. 1 lit. b GDPR, provided your request is related to the fulfillment of a contract or is necessary for the implementation of pre-contractual measures. In all other cases, processing is based on our legitimate interest in effectively processing inquiries sent to us (Art. 6 Para. 1 lit. f GDPR) or on your consent (Art. 6 Para. 1 lit. a GDPR) if this has been requested.</p>
                      <p>The data you enter in the contact form remains with us until you request deletion, revoke your consent to storage, or the purpose for data storage no longer applies (e.g. after completing your request). Mandatory legal provisions – especially retention periods – remain unaffected.</p>
                    </section>

                    <section className="legal-section">
                      <h3>6. Your Rights</h3>
                      <h4>Right to Information</h4>
                      <p>You have the right to receive information about your personal data stored by us at any time.</p>
                      
                      <h4>Right to Rectification</h4>
                      <p>You have the right to request correction of incorrect or completion of incomplete personal data.</p>
                      
                      <h4>Right to Deletion</h4>
                      <p>You have the right to request deletion of your personal data stored by us, unless processing is necessary for exercising the right to freedom of expression and information, for fulfilling a legal obligation, for reasons of public interest, or for asserting, exercising, or defending legal claims.</p>
                      
                      <h4>Right to Restriction of Processing</h4>
                      <p>You have the right to request restriction of processing of your personal data if the accuracy of the data is disputed by you, the processing is unlawful, but you refuse its deletion.</p>
                      
                      <h4>Right to Data Portability</h4>
                      <p>You have the right to have data that we process automatically on the basis of your consent or in fulfillment of a contract handed over to you or to a third party in a common, machine-readable format.</p>
                      
                      <h4>Right to Object</h4>
                      <p>You have the right to object at any time to the processing of personal data concerning you, which is based on Art. 6 Para. 1 lit. e or f GDPR, for reasons arising from your particular situation.</p>
                      
                      <h4>Right to Complain</h4>
                      <p>You have the right to lodge a complaint with a supervisory authority. The supervisory authority of your usual place of residence, workplace, or our company headquarters is responsible.</p>
                    </section>

                    <section className="legal-section">
                      <h3>7. Storage Duration</h3>
                      <p>Unless a more specific storage period has been specified within this privacy policy, your personal data will remain with us until the purpose for data processing no longer applies. If you assert a legitimate request for deletion or revoke consent to data processing, your data will be deleted unless we have other legally permissible reasons for storing your personal data (e.g. tax or commercial retention periods); in the latter case, deletion occurs after these reasons cease to apply.</p>
                    </section>

                    <section className="legal-section">
                      <p><strong>Status: January 2025</strong></p>
                      <p>This privacy policy complies with the requirements of the EU General Data Protection Regulation (GDPR) in its currently valid version.</p>
                    </section>
                  </>
                )}
              </div>
            </div>
          ) : activeCategory === 'impressum' ? (
            <div className="content-wrapper">
              <h2 className="content-title">{t.impressum}</h2>
              <div className="impressum-content">
                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Angaben gemäß § 5 TMG' : 'Information according to § 5 TMG'}</h3>
                  <p><strong>OCTA</strong></p>
                  <p>{language === 'de' ? 'Inhaber' : 'Owner'}: Lois Schmidt</p>
                  <p>Gilmerdingen</p>
                  <p>Niedersachsen, Deutschland</p>
                </section>

                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Kontakt' : 'Contact'}</h3>
                  <p>E-Mail: Alltagshilfe007@web.de</p>
                  <p>{language === 'de' ? 'Telefon' : 'Phone'}: [{language === 'de' ? 'Auf Anfrage' : 'Available upon request'}]</p>
                </section>

                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Vertreten durch' : 'Represented by'}</h3>
                  <p>Lois Schmidt</p>
                </section>

                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Berufsbezeichnung und berufsrechtliche Regelungen' : 'Professional Title and Professional Regulations'}</h3>
                  <p>{language === 'de' ? 'Zugelassener Pflegedienst gemäß § 72 SGB XI' : 'Approved care service according to § 72 SGB XI'}</p>
                  <p>{language === 'de' ? 'Betreuungskräfte nach § 43b SGB XI' : 'Care assistants according to § 43b SGB XI'}</p>
                  <p>{language === 'de' ? 'Hauswirtschaftskräfte nach § 53c SGB XI' : 'Household staff according to § 53c SGB XI'}</p>
                </section>

                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Haftungsausschluss' : 'Disclaimer'}</h3>
                  <h4>{language === 'de' ? 'Haftung für Inhalte' : 'Liability for Content'}</h4>
                  <p>{language === 'de' 
                    ? 'Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.'
                    : 'The content of our pages has been created with the greatest care. However, we cannot guarantee the accuracy, completeness and timeliness of the content.'}</p>
                </section>

                <section className="impressum-section">
                  <h3>{language === 'de' ? 'Datenschutz' : 'Data Protection'}</h3>
                  <p>{language === 'de'
                    ? 'Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten erhoben werden, erfolgt dies auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.'
                    : 'The use of our website is generally possible without providing personal data. Insofar as personal data is collected on our pages, this is done on a voluntary basis. This data will not be passed on to third parties without your express consent.'}</p>
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

              {/* Work-Life Balance Image for Stellenangebote */}
              {activeCategory === 'z9' && (
                <div className="job-image-section">
                  <img 
                    src="https://images.unsplash.com/photo-1663229049306-33b5cd9c2134?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxoZWFsdGhjYXJlJTIwd29ya2VycyUyMGZhbWlseXxlbnwwfHx8fDE3NjExMDI1OTl8MA&ixlib=rb-4.1.0&q=85"
                    alt="Work-Life Balance Familie"
                    className="job-hero-image"
                  />
                </div>
              )}

              {/* Application Form for Stellenangebote */}
              {activeCategory === 'z9' && (
                <div className="application-form-section">
                  <h3 className="form-section-title">
                    {language === 'de' ? 'Interesse geweckt? Kontaktieren Sie uns!' : 'Interested? Contact us!'}
                  </h3>
                  <form className="job-application-form" onSubmit={(e) => {
                    e.preventDefault();
                    alert(language === 'de' 
                      ? 'Vielen Dank für Ihr Interesse! Wir melden uns in Kürze bei Ihnen.' 
                      : 'Thank you for your interest! We will contact you shortly.');
                  }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">
                          {language === 'de' ? 'Vor- und Nachname' : 'Full Name'} <span className="required">*</span>
                        </label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder={language === 'de' ? 'Max Mustermann' : 'John Doe'}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">
                          {language === 'de' ? 'E-Mail-Adresse' : 'Email Address'} <span className="required">*</span>
                        </label>
                        <input 
                          type="email" 
                          className="form-input" 
                          placeholder={language === 'de' ? 'ihre.email@beispiel.de' : 'your.email@example.com'}
                          required 
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">
                          {language === 'de' ? 'Telefonnummer' : 'Phone Number'} <span className="required">*</span>
                        </label>
                        <input 
                          type="tel" 
                          className="form-input" 
                          placeholder="+49 123 456789"
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">
                          {language === 'de' ? 'Position/Bereich' : 'Position/Area'}
                        </label>
                        <select className="form-input">
                          <option value="">{language === 'de' ? 'Bitte wählen...' : 'Please select...'}</option>
                          <option value="pflege">{language === 'de' ? 'Pflegefachkraft' : 'Nursing Professional'}</option>
                          <option value="betreuung">{language === 'de' ? 'Betreuungskraft' : 'Care Assistant'}</option>
                          <option value="hauswirtschaft">{language === 'de' ? 'Hauswirtschaft' : 'Household Staff'}</option>
                          <option value="ehrenamt">{language === 'de' ? 'Ehrenamtliche Tätigkeit' : 'Volunteer Work'}</option>
                          <option value="sonstiges">{language === 'de' ? 'Sonstiges' : 'Other'}</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        {language === 'de' ? 'Ihre Nachricht' : 'Your Message'}
                      </label>
                      <textarea 
                        className="form-textarea" 
                        rows="5"
                        placeholder={language === 'de' 
                          ? 'Erzählen Sie uns etwas über sich und Ihre Motivation...' 
                          : 'Tell us about yourself and your motivation...'}
                      />
                    </div>
                    <button type="submit" className="submit-button">
                      {language === 'de' ? 'Interesse bekunden' : 'Express Interest'}
                    </button>
                  </form>
                </div>
              )}

              {activeCategory !== 'z9' && (
                <div className="contact-section">
                  <p className="contact-text">{t.contactText}</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer mit Impressum und Datenschutz */}
      <footer className="app-footer">
        {/* Krankenkassen Logos */}
        <div className="insurance-logos">
          <p className="insurance-text">
            {language === 'de' ? 'Akzeptierte Krankenkassen:' : 'Accepted Health Insurance:'}
          </p>
          <div className="logos-container">
            <img 
              src="https://customer-assets.emergentagent.com/job_sprechen-sie-41/artifacts/p6hgsljo_Untitled-design-3.jpg" 
              alt="Techniker Krankenkasse" 
              className="insurance-logo"
            />
            <img 
              src="https://customer-assets.emergentagent.com/job_sprechen-sie-41/artifacts/vlyfala9_Allgemeine_Ortskrankenkasse_logo.svg.png" 
              alt="AOK - Die Gesundheitskasse" 
              className="insurance-logo"
            />
            <img 
              src="https://customer-assets.emergentagent.com/job_sprechen-sie-41/artifacts/2vdwdvf9_barmer-logo-png_seeklogo-16692.png" 
              alt="Barmer" 
              className="insurance-logo"
            />
            <img 
              src="https://customer-assets.emergentagent.com/job_sprechen-sie-41/artifacts/laarcn9u_GKV-Spitzenverband_logo.svg" 
              alt="GKV Spitzenverband" 
              className="insurance-logo"
            />
          </div>
        </div>

        <div className="footer-divider-line"></div>

        <div className="footer-links">
          <button 
            className="footer-link" 
            data-testid="impressum-link"
            onClick={() => setActiveCategory('impressum')}
          >
            {t.impressum}
          </button>
          <span className="footer-divider">|</span>
          <button 
            className="footer-link" 
            data-testid="datenschutz-link"
            onClick={() => setActiveCategory('datenschutz')}
          >
            {t.datenschutz}
          </button>
        </div>
        <p className="footer-copyright">{t.copyright}</p>
      </footer>
    </div>
  );
}

export default App;