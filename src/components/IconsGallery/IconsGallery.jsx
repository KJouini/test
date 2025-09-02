import React from 'react';

export default function IconsGallery() {
  const items = [
    { name: 'home',   className: 'icon icon-home' },
    { name: 'search', className: 'icon icon-search' },
  ];
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
      {items.map(i => (
        <div key={i.name} className="flex flex-col items-center gap-2 p-3 rounded-lg border">
          <span className={`${i.className} text-3xl text-primary`} aria-hidden />
          <div className="text-xs text-gray-600">{i.name}</div>
        </div>
      ))}
    </div>
  );
}
