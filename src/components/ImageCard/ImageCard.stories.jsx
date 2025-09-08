// src/components/ImageCard/ImageCard.stories.jsx
import React from 'react';
import ImageCard from './ImageCard';
import imageDemo from '../../assets/images/Orif.png'; // <-- import module

export default {
  title: 'Atoms/ImageCard',
  component: ImageCard,
  args: {
    title: 'Image depuis la lib',
    subtitle: 'Servie depuis dist/assets',
    image: imageDemo,
  },
};

export const Default = {};
