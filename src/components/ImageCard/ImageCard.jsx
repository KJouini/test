import React from 'react';
import orif from '../../assets/images/Orif.png';


export default function ImageCard() {
  return (
    <div className="p-4 rounded-xl shadow bg-white inline-flex items-center gap-4">
      <img src={orif} alt="Orif" className="w-24 h-24 object-cover rounded-lg" />
      <div>
        <div className="font-semibold">Image depuis la lib</div>
        <div className="text-sm text-slate-600">Servie depuis dist/assets</div>
      </div>
    </div>
  );
}
