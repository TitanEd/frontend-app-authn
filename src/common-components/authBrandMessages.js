import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  loginTitle: {
    id: 'tels.authn.panel.login.title',
    defaultMessage: 'Welcome back. Let\'s keep learning.',
    description: 'Title of the side panel of the sign-in page',
  },
  registerTitle: {
    id: 'tels.authn.panel.register.title',
    defaultMessage: 'Start learning something new today.',
    description: 'Title of the side panel of the sign-up page',
  },
  resetTitle: {
    id: 'tels.authn.panel.reset.title',
    defaultMessage: 'We\'ll get you back to your courses.',
    description: 'Title of the side panel of the forgot password and reset password pages',
  },
  tagline: {
    id: 'tels.authn.panel.tagline',
    defaultMessage: 'Expert-led courses, practice and certificates that prove what you can do.',
    description: 'Tagline under the title of the sign-in side panel, shown when the site has no tagline of its own',
  },
  pointPace: {
    id: 'tels.authn.panel.point.pace',
    defaultMessage: 'Learn at your own pace, on any device',
    description: 'First benefit listed in the sign-in side panel',
  },
  pointProgress: {
    id: 'tels.authn.panel.point.progress',
    defaultMessage: 'Track your progress and grades',
    description: 'Second benefit listed in the sign-in side panel',
  },
  pointCertificates: {
    id: 'tels.authn.panel.point.certificates',
    defaultMessage: 'Earn certificates and badges',
    description: 'Third benefit listed in the sign-in side panel',
  },
  logoAlt: {
    id: 'tels.authn.panel.logo.alt',
    defaultMessage: '{siteName} logo',
    description: 'Text alternative of the logo in the sign-in side panel. {siteName} is the name of the platform.',
  },
});

export default messages;
