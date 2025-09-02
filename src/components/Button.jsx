import React from 'react';

const variantMap = {
  primary: 'tw-btn tw-btn--primary',
  secondary: 'tw-btn tw-btn--secondary',
  success: 'tw-btn tw-btn--success',
  warning: 'tw-btn tw-btn--warning',
  danger: 'tw-btn tw-btn--danger',
  outline: 'tw-btn tw-btn--outline',
  ghost: 'tw-btn tw-btn--ghost',
  default: 'tw-btn'
};

const sizeMap = {
  sm: 'tw-btn--sm',
  md: '',
  lg: 'tw-btn--lg',
  icon: 'tw-btn--icon'
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,  // ex: <span className="icon icon-home" />
  rightIcon, // ex: <span className="icon icon-search" />
  className = '',
  ...props
}) {
  const base = variantMap[variant] ?? variantMap.default;
  const sizeCls = sizeMap[size] ?? '';
  return (
    <button className={`${base} ${sizeCls} ${className}`} {...props}>
      {leftIcon ? <span aria-hidden>{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span aria-hidden>{rightIcon}</span> : null}
    </button>
  );
}
