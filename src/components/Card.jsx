import React from 'react';

export default function Card({ title, subtitle, actions, children, footer, className = '', ...props }) {
  return (
    <div className={`tw-card ${className}`} {...props}>
      {(title || subtitle || actions) && (
        <header className="tw-card-header">
          <div>
            {title && <div className="tw-card-title">{title}</div>}
            {subtitle && <div className="tw-card-subtle">{subtitle}</div>}
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </header>
      )}
      <div className="tw-card-body">
        {children}
      </div>
      {footer && <footer className="tw-card-footer">{footer}</footer>}
    </div>
  );
}
