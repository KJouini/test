// src/components/ImageCard/ImageCard.jsx (exemple)
import React from 'react';
import Orif from '../../assets/images/Orif.png'; // <-- import module

export default function ImageCard() {
  return (
    <div className="card">
      <div className="card-body">
        <img src={Orif} alt="Orif" className="max-w-xs rounded-xl" />
        <p className="mt-2 text-sm text-black/70">Servie depuis dist/assets via rollup</p>
      </div>
    </div>
  );
}
