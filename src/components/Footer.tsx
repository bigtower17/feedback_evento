import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 w-full fixed bottom-0 left-0 pb-16">
      <div className="container mx-auto flex flex-col items-center">
        <a
          href="http://www.officinaincloud.it"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-gray-700 transition-colors text-sm"
        >
          Visita il nostro sito
        </a>
        <p className="text-sm mt-2">
          © {new Date().getFullYear()} OfficinaInCloud. Tutti i diritti riservati.
        </p>
        <div className="flex flex-row justify-center gap-4 mt-2 text-xs">
          <a
            href="https://www.iubenda.com/privacy-policy/20671085"
            className="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe text-blue-400 hover:text-gray-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            title="Informativa sulla Privacy"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.iubenda.com/privacy-policy/20671085/cookie-policy"
            className="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe text-blue-400 hover:text-gray-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            title="Cookie Policy"
          >
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;