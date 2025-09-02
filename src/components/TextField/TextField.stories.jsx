import React, { useState } from 'react';
import TextField from './TextField';

export default {
  title: 'Forms/TextField',
  component: TextField,
};

export const Playground = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="max-w-sm space-y-6">
        <TextField
          label="Votre nom"
          placeholder="Entrez votre nom"
          helper="Ex: Jean Dupont"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          placeholder="email@domaine.com"
          error="Adresse email invalide."
        />
      </div>
    );
  }
};
