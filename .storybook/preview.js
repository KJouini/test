// Charge le CSS source (Tailwind v4) de ta lib en mode dev Storybook
import '../src/styles/tailwind.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: { expanded: true }
};
