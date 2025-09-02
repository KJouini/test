import React from 'react';
import Alert from './Alert';

export default {
  title: 'Feedback/Alert',
  component: Alert,
};

export const Variants = {
  render: () => (
    <div className="space-y-3">
      <Alert variant="info"  title="Info">Ceci est une information.</Alert>
      <Alert variant="good"  title="Succès">Opération réussie.</Alert>
      <Alert variant="warn"  title="Avertissement">Attention à ceci.</Alert>
      <Alert variant="bad"   title="Erreur">Quelque chose s’est mal passé.</Alert>
    </div>
  )
};
