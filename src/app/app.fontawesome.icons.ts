import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

export const faIcons = [
  faGithub,
];

export function registerAppFaIcons() {
  library.add(...faIcons);
}
