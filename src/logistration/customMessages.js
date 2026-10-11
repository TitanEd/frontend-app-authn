import { defineMessages } from '@edx/frontend-platform/i18n';

// Messages of the custom sign in / register page (CustomLogistration).
const messages = defineMessages({
  logoAlt: {
    id: 'logistration.custom.logo.alt',
    defaultMessage: '{siteName} logo',
    description: 'Alt text of the site logo on the sign in / register page',
  },
  loginHeading: {
    id: 'logistration.custom.login.heading',
    defaultMessage: 'Log In To Your Account',
    description: 'Heading of the sign in form',
  },
  registerHeading: {
    id: 'logistration.custom.register.heading',
    defaultMessage: 'Create An Account',
    description: 'Heading of the registration form',
  },
  enterDetails: {
    id: 'logistration.custom.enter.details',
    defaultMessage: 'Please Enter Your Details',
    description: 'Sub heading above the sign in / registration form fields',
  },
  or: {
    id: 'logistration.custom.divider.or',
    defaultMessage: 'Or',
    description: 'Divider between social sign in buttons and the form',
  },
  emailOrUsernameLabel: {
    id: 'logistration.custom.email.or.username.label',
    defaultMessage: 'Email or Username',
    description: 'Label of the email or username field',
  },
  emailOrUsernamePlaceholder: {
    id: 'logistration.custom.email.or.username.placeholder',
    defaultMessage: 'Example@titaned.com',
    description: 'Placeholder of the email or username field',
  },
  passwordLabel: {
    id: 'logistration.custom.password.label',
    defaultMessage: 'Password',
    description: 'Label of the password field',
  },
  passwordPlaceholder: {
    id: 'logistration.custom.password.placeholder',
    defaultMessage: 'Enter password',
    description: 'Placeholder of the password field',
  },
  loginButton: {
    id: 'logistration.custom.login.button',
    defaultMessage: 'Login',
    description: 'Sign in button and link to the sign in form',
  },
  forgotPassword: {
    id: 'logistration.custom.forgot.password',
    defaultMessage: 'Forgot password?',
    description: 'Link to the forgot password page',
  },
  noAccount: {
    id: 'logistration.custom.no.account',
    defaultMessage: "Don't Have An Account?",
    description: 'Text before the link to the registration form',
  },
  signUp: {
    id: 'logistration.custom.sign.up',
    defaultMessage: 'Sign Up',
    description: 'Link to the registration form',
  },
  haveAccount: {
    id: 'logistration.custom.have.account',
    defaultMessage: 'Already Have An Account?',
    description: 'Text before the link to the sign in form',
  },
});

export default messages;
