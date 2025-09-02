import React from 'react';

const variantMap = {
  neutral: 'tw-badge',
  primary: 'tw-badge tw-badge--primary',
  secondary: 'tw-badge tw-badge--secondary',
  success: 'tw-badge tw-badge--success',
  warning: 'tw-badge tw-badge--warning',
  danger:  'tw-badge tw-badge--danger',
};

export default function Badge({ children, variant = 'neutral', className = '', ...props }) {
  const cls = variantMap[variant] ?? variantMap.neutral;
  return (
    <span className={`${cls} ${className}`} {...props}>
      {children}
    </span>
  );
}
