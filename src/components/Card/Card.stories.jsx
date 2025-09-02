import React from 'react';
import Card from './Card';
import Button from '../Button/Button';
import Badge from '../Badge/Badge';

export default {
  title: 'Components/Card',
  component: Card,
};

export const Default = {
  render: () => (
    <Card
      title="Carte produit"
      subtitle={<Badge variant="primary">Nouveau</Badge>}
      actions={<Button size="sm">Action</Button>}
      footer={<div className="text-sm text-gray-600">Pied de carte</div>}
    >
      <p className="text-sm text-gray-700">
        Contenu de la carte. Utilise la grille, les espacements, etc.
      </p>
    </Card>
  )
};
