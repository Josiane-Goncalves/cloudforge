import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="cf-footer" role="contentinfo">
      <div className="cf-footer__inner">
        <p className="cf-footer__quote">
          &ldquo;Grandes arquiteturas não são forjadas pelo acaso, mas esculpidas na têmpera do Well-Architected Framework.&rdquo;
        </p>
        <div className="cf-footer__meta">
          <span>CloudForge v0.1.0 • MVP Etapa 1</span>
          <span>•</span>
          <span>Preparatório AWS Certified Solutions Architect – Associate (SAA-C03)</span>
          <span>•</span>
          <span>Persistência 100% Local</span>
        </div>
      </div>
    </footer>
  );
};
