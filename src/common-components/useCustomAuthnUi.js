import { useEffect } from 'react';
import { flushSync } from 'react-dom';

import { getConfig } from '@edx/frontend-platform';

// ---- light / dark: the mode chosen on any page of the site --------------------------------------
// The home page (LMS) and the other MFEs keep the visitor's choice in this cookie, shared by every
// host of the site. frontend-platform reads only its own localStorage key, so the cookie is copied
// there while this module loads, before the app starts: the page opens in the right mode at once.
const THEME_KEYS = ['selected-paragon-theme-variant', 'selected-theme-variant'];

const readThemeCookie = () => {
  const match = document.cookie.match(/(?:^|; )selected-paragon-theme-variant=(light|dark)(?:;|$)/);
  return match ? match[1] : null;
};

const syncThemeFromCookie = () => {
  const fromCookie = readThemeCookie();
  if (!fromCookie) { return; }
  try {
    if (window.localStorage.getItem(THEME_KEYS[0]) !== fromCookie) {
      THEME_KEYS.forEach((key) => window.localStorage.setItem(key, fromCookie));
    }
  } catch (error) {
    // storage blocked (private mode): frontend-platform keeps its default
  }
};
syncThemeFromCookie();

export const currentThemeVariant = () => {
  let stored = null;
  try { stored = window.localStorage.getItem(THEME_KEYS[0]); } catch (error) { stored = null; }
  const variant = readThemeCookie() || stored
    || document.documentElement.getAttribute('data-paragon-theme-variant');
  return variant === 'dark' ? 'dark' : 'light';
};

// The logo for the current mode: the theme page's "logo for dark backgrounds" in dark mode.
export const themedLogoUrl = () => {
  const { LOGO_URL: logo, LOGO_WHITE_URL: darkLogo } = getConfig();
  return (currentThemeVariant() === 'dark' && darkLogo) || logo;
};

// ---- page changes: login <-> sign up, forgot / reset password ----------------------------------
// The card morphs into the next page (View Transitions API; the animation itself is in the brand
// CSS, custom_authn.scss). `direction` is "forward" (deeper: sign up, forgot password) or "back".
// Browsers without the API, and visitors who asked for less motion, simply change page.
export const authTransition = (update, direction = 'forward') => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof document.startViewTransition !== 'function' || reduceMotion) {
    update();
    return;
  }
  const root = document.documentElement;
  root.dataset.telsAuthDirection = direction;
  root.classList.add('tels-auth-transition');
  let transition;
  try {
    transition = document.startViewTransition({ update: () => flushSync(update), types: [direction] });
  } catch (error) {
    transition = document.startViewTransition(() => flushSync(update)); // without transition types
  }
  transition.finished.finally(() => root.classList.remove('tels-auth-transition'));
};

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
