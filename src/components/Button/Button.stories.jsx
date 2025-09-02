import React from 'react';
import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Bouton' },
  argTypes: {
    variant: { control: 'select', options: ['primary','secondary','success','warning','danger','outline','ghost','default'] },
    size: { control: 'select', options: ['sm','md','lg','icon'] },
  }
};

export const Primary = { args: { variant: 'primary' } };
export const Variants = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      {['primary','secondary','success','warning','danger','outline','ghost'].map(v => (
        <Button key={v} {...args} variant={v}>{v}</Button>
      ))}
    </div>
  )
};
export const Sizes = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
      <Button {...args} size="icon" aria-label="search" leftIcon={<span className="icon icon-search" />} />
    </div>
  )
};
export const WithIcons = {
  args: {
    leftIcon: <span className="icon icon-home" />,
    rightIcon: <span className="icon icon-search" />,
  }
};

