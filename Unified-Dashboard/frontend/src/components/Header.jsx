import React from 'react';

export const Header = ({ title, subtitle, onRefresh, onGenerateKey, mobileMenuOpen, onToggleMobileMenu }) => {
  return (
    <header className="header">
      <div className="header-left">
        {onToggleMobileMenu && (
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
          >
            <span className="hamburger-icon">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        )}
        <div className="header-title">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="header-actions">
        {onRefresh && (
          <button className="btn btn-secondary" onClick={onRefresh}>
            🔄 Refresh Data
          </button>
        )}
        {onGenerateKey && (
          <button className="btn btn-primary" onClick={onGenerateKey}>
            + New App Key
          </button>
        )}
      </div>
    </header>
  );
};
