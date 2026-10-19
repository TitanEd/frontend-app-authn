// The side panel of the sign-in pages (desktop): the site's logo, a title for the page, the
// site's tagline and three short benefits. Layout, colors and the illustration are in the brand
// CSS (tels-brand-openedx paragon/custom_authn.scss, ".tels-auth-panel"); phones hide it.
import { useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@openedx/paragon';
import { CheckCircle } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';

import messages from './authBrandMessages';

const TITLES = {
  login: messages.loginTitle,
  register: messages.registerTitle,
  reset: messages.resetTitle,
};

// The tagline written on the theme page (Footer section), read once per page load.
let taglineRequest = null;
const fetchTagline = () => {
  const url = getConfig().FOOTER_CONFIG_URL;
  if (!url) { return Promise.resolve(''); }
  if (!taglineRequest) {
    taglineRequest = fetch(url, { credentials: 'omit' })
      .then((response) => (response.ok ? response.json() : {}))
      .then((data) => (data && typeof data.tagline === 'string' ? data.tagline.trim() : ''))
      .catch(() => '');
  }
  return taglineRequest;
};

const AuthBrandPanel = ({ page }) => {
  const { formatMessage } = useIntl();
  const [tagline, setTagline] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchTagline().then((text) => { if (mounted) { setTagline(text); } });
    return () => { mounted = false; };
  }, []);

  // The panel is in the brand color in both modes: the normal logo, on a light chip (brand CSS).
  const { LOGO_URL: logo, SITE_NAME: siteName } = getConfig();
  const points = [messages.pointPace, messages.pointProgress, messages.pointCertificates];

  return (
    <aside className="tels-auth-panel">
      <img className="tels-auth-panel__logo" src={logo} alt={formatMessage(messages.logoAlt, { siteName })} />
      <div className="tels-auth-panel__art" aria-hidden="true" />
      <div className="tels-auth-panel__text">
        <h2 className="tels-auth-panel__title">{formatMessage(TITLES[page] || messages.loginTitle)}</h2>
        <p className="tels-auth-panel__tagline">{tagline || formatMessage(messages.tagline)}</p>
        <ul className="tels-auth-panel__points">
          {points.map((point) => (
            <li key={point.id}>
              <Icon src={CheckCircle} className="tels-auth-panel__point-icon" />
              <span>{formatMessage(point)}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

AuthBrandPanel.propTypes = {
  page: PropTypes.oneOf(['login', 'register', 'reset']),
};

AuthBrandPanel.defaultProps = {
  page: 'login',
};

export default AuthBrandPanel;
