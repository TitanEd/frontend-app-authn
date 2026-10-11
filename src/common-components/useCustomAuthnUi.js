import { useEffect } from 'react';

// Custom UI styles load after the stock Verawood styles (as in the previous
// version), so on equal specificity the custom rules win.
import('titaned-lib/dist/index.css');
import('../styles/styles-overrides.scss');


// Installed from package.json. Run npm install before lint/build if this stays unresolved.

// Design tokens for the custom UI are scoped to this class
// (tels-brand-openedx paragon/custom_authn.scss).
export const CUSTOM_UI_CLASS = 'tels-custom-authn';

/**
 * Marks <html> and <body> as the custom authn UI while a custom page is shown,
 * so the custom styles and the design token bridge apply (modals included).
 */
const useCustomAuthnUi = () => {
  useEffect(() => {
    document.documentElement.classList.add(CUSTOM_UI_CLASS);
    document.body.classList.add(CUSTOM_UI_CLASS);
    return () => {
      document.documentElement.classList.remove(CUSTOM_UI_CLASS);
      document.body.classList.remove(CUSTOM_UI_CLASS);
    };
  }, []);
};

export default useCustomAuthnUi;
