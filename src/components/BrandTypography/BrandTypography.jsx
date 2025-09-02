import React from 'react';

export default function BrandTypography() {
  return (
    <div className="space-y-2">
      <p className="text-slate-600">Fonte via font-sans (lib)</p>
      <p className="text-lg">Normal (400) — fallback si non fournie</p>
      <p className="text-lg font-bold">Bold (700)</p>
      <p className="text-lg font-bold italic">Bold Italic (700 italic)</p>
      <p className="text-lg font-extrabold">ExtraBold (800)</p>
      <p className="text-lg font-black">Black (900)</p>
      <p className="text-lg font-black italic">Black Italic (900 italic)</p>
    </div>
  );
}
