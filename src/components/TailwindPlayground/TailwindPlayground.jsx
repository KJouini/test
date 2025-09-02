import React from 'react';

const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-xl font-semibold">{title}</h2>
    <div className="p-4 rounded-lg border bg-white">{children}</div>
  </section>
);

export default function TailwindPlayground() {
  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-lg">
      {/* Typo & font (font-sans est appliquée via @layer base dans ton CSS) */}
      <Section title="Typography & Font">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Heading (font-sans)</h1>
          <p className="text-base">
            Texte par défaut avec une emphase <span className="text-primary font-medium">primary</span>.
          </p>
        </div>
      </Section>

      {/* Couleurs issues de @theme (bg-primary, text-primary) */}
      <Section title="Color tokens (primary)">
        <div className="flex items-center gap-4">
          <div className="w-16 h-10 rounded bg-primary" title="bg-primary" />
          <span className="text-primary font-medium">text-primary</span>
          <span className="px-2 py-1 rounded bg-primary text-white">Badge primary</span>
        </div>
      </Section>

      {/* Boutons provenant de @layer components (.tw-btn) */}
      <Section title="Buttons (.tw-btn)">
        <div className="flex flex-wrap gap-3 items-center">
          <button className="tw-btn">Default</button>
          <button className="tw-btn">
            <span className="icon icon-home" aria-hidden />
            Home
          </button>
          <button className="tw-btn">
            <span className="icon icon-search" aria-hidden />
            Search
          </button>
          <button className="tw-btn opacity-50 cursor-not-allowed" disabled>
            Disabled
          </button>
          <button className="tw-btn text-sm">Small</button>
          <button className="tw-btn text-lg">Large</button>
        </div>
      </Section>

      {/* Icônes utilitaires : 1em = scalable via text-… */}
      <Section title="Icons (.icon, .icon-home, .icon-search)">
        <div className="flex items-center gap-6">
          <span className="icon icon-home text-primary text-xl" aria-label="home small" />
          <span className="icon icon-search text-primary text-3xl" aria-label="search medium" />
          <span className="icon icon-home text-gray-700 text-5xl" aria-label="home large" />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Les icônes prennent la couleur via <code>currentColor</code> et la taille via <code>text-*</code>.
        </p>
      </Section>
    </div>
  );
}
