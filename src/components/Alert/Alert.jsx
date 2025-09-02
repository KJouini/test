import React from 'react';

const variantMap = {
  info:  'tw-alert tw-alert--info',
  good:  'tw-alert tw-alert--good',
  warn:  'tw-alert tw-alert--warn',
  bad:   'tw-alert tw-alert--bad',
};

export default function Alert({ variant = 'info', icon, title, children, className = '', ...props }) {
  const cls = variantMap[variant] ?? variantMap.info;
  return (
    <div role="alert" className={`${cls} ${className}`} {...props}>
      {icon ? <span className="text-xl" aria-hidden>{icon}</span> : null}
      <div className="space-y-1">
        {title && <div className="font-semibold">{title}</div>}
        <div className="text-sm text-gray-700">{children}</div>
      </div>
    </div>
  );
}
