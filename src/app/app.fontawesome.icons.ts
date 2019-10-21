import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

export const faIcons = [
  faGithub,
  faInfoCircle,
];

export function registerAppFaIcons() {
  library.add(...faIcons);
}
