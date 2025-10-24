import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = ({ name, language, position }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage = language === 'de'
        ? `Hallo! Ich bin ${name}, Ihre KI-Assistentin für OCTA. Wie kann ich Ihnen heute helfen?`
        : `Hello! I'm ${name}, your AI assistant for OCTA. How can I help you today?`;
      
      setMessages([{
        text: welcomeMessage,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length, name, language]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: inputText,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Check if bot wants to redirect to form
      if (data.response.includes('[REDIRECT_TO_FORM]')) {
        const botMessage = {
          text: data.response.replace('[REDIRECT_TO_FORM]', ''),
          sender: 'bot',
          timestamp: new Date(),
          hasRedirect: true
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const botMessage = {
          text: data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: language === 'de' 
          ? 'Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.'
          : 'Sorry, there was an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRedirect = () => {
    // Scroll to availability form
    const availabilitySection = document.querySelector('[data-section="availability"]');
    if (availabilitySection) {
      availabilitySection.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <div className={`chatbot-container ${position}`}>
      {!isOpen && (
        <button
          className="chatbot-trigger"
          onClick={() => setIsOpen(true)}
          title={language === 'de' ? `Chat mit ${name}` : `Chat with ${name}`}
        >
          <div className="chatbot-avatar">{name[0]}</div>
          <span className="chatbot-name">{name}</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar-small">{name[0]}</div>
              <div>
                <div className="chatbot-header-name">{name}</div>
                <div className="chatbot-header-subtitle">
                  {language === 'de' ? 'KI-Kundenservice' : 'AI Customer Service'}
                </div>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              title={language === 'de' ? 'Schließen' : 'Close'}
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.text}
                  {msg.hasRedirect && (
                    <button 
                      className="redirect-button"
                      onClick={handleRedirect}
                    >
                      {language === 'de' ? '➜ Zum Kontaktformular' : '➜ Go to Contact Form'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'de' ? 'Schreiben Sie Ihre Nachricht...' : 'Type your message...'}
              rows="2"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="send-button"
            >
              {language === 'de' ? 'Senden' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
