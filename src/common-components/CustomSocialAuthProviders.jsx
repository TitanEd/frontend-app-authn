// Copy of SocialAuthProviders.jsx for the custom UI (TitanEd icon classes, button layout).
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faApple, faFacebook, faGoogle, faGooglePlus, faLinkedin, faMicrosoft,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@openedx/paragon';
import { Login } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';

import messages from './messages';
import { LOGIN_PAGE } from '../data/constants';

// TitanEd third party auth providers are configured with Font Awesome class
// names (fa-google, fa-linkedin, …); the stock list only knows apple / facebook /
// google / microsoft.
const CUSTOM_SUPPORTED_ICON_CLASSES = [
  'apple', 'facebook', 'google', 'microsoft',
  'fa-facebook', 'fa-google', 'fa-google-plus', 'fa-linkedin', 'fa-microsoft',
];
library.add(faGooglePlus, faLinkedin);

// The brand mark follows the provider itself, whatever icon class was saved for it (the Control
// Hub saved fa-google-plus and fa-facebook-f, which the list above does not know).
const BRAND_ICONS = [
  ['google', faGoogle], ['facebook', faFacebook], ['azuread', faMicrosoft], ['microsoft', faMicrosoft],
  ['linkedin', faLinkedin], ['apple', faApple],
];
const brandIcon = (provider) => {
  const key = `${provider.id || ''} ${provider.iconClass || ''}`.toLowerCase();
  const match = BRAND_ICONS.find(([name]) => key.includes(name));
  return match ? match[1] : null;
};

// The icon uploaded in the admin comes as a path on the LMS ("/media/…"): this page is served
// by another host, so the path is completed with the LMS address.
const iconUrl = (image) => (image && image.startsWith('/') ? `${getConfig().LMS_BASE_URL}${image}` : image);

// The provider's brand mark, else the icon class saved for it, else a generic sign-in icon.
const providerMark = (provider) => {
  const brand = brandIcon(provider);
  if (brand) { return <FontAwesomeIcon icon={brand} />; }
  if (CUSTOM_SUPPORTED_ICON_CLASSES.includes(provider.iconClass)) {
    return <FontAwesomeIcon icon={['fab', provider.iconClass]} />;
  }
  return <Icon className="h-75" src={Login} />;
};

const CustomSocialAuthProviders = (props) => {
  const { formatMessage } = useIntl();
  const { referrer, socialAuthProviders } = props;

  function handleSubmit(e) {
    e.preventDefault();

    const url = e.currentTarget.dataset.providerUrl;
    window.location.href = getConfig().LMS_BASE_URL + url;
  }

  const socialAuth = socialAuthProviders.map((provider) => (
    <button
      id={provider.id}
      key={provider.id}
      type="button"
      className={`btn-social btn-${provider.id}`}
      data-provider-url={referrer === LOGIN_PAGE ? provider.loginUrl : provider.registerUrl}
      onClick={handleSubmit}
    >
      {provider.iconImage ? (
        <div aria-hidden="true">
          <img className="btn-tpa__image-icon" src={iconUrl(provider.iconImage)} alt="" />
        </div>
      )
        : (
          <div className="btn-tpa__font-container" aria-hidden="true">
            {providerMark(provider)}
          </div>
        )}
      <span id="provider-name" className="notranslate pl-2" aria-hidden="true">{provider.name}</span>
      <span className="sr-only">
        {referrer === LOGIN_PAGE
          ? formatMessage(messages['sso.sign.in.with'], { providerName: provider.name })
          : formatMessage(messages['sso.create.account.using'], { providerName: provider.name })}
      </span>
    </button>
  ));

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{socialAuth}</>;
};

CustomSocialAuthProviders.defaultProps = {
  referrer: LOGIN_PAGE,
  socialAuthProviders: [],
};

CustomSocialAuthProviders.propTypes = {
  referrer: PropTypes.string,
  socialAuthProviders: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    iconClass: PropTypes.string,
    iconImage: PropTypes.string,
    loginUrl: PropTypes.string,
    registerUrl: PropTypes.string,
    skipRegistrationForm: PropTypes.bool,
  })),
};

export default CustomSocialAuthProviders;
