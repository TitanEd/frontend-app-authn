import { defineMessages } from '@edx/frontend-platform/i18n';

// Messages of the custom forgot password page (CustomForgotPage).
const messages = defineMessages({
  heading: {
    id: 'forgot.password.custom.page.heading',
    defaultMessage: 'Forgot Password?',
    description: 'Heading of the custom forgot password page',
  },
  emailLabel: {
    id: 'forgot.password.custom.email.field.label',
    defaultMessage: 'Registered Email',
    description: 'Label of the email field on the custom forgot password page',
  },
  havingTrouble: {
    id: 'forgot.password.custom.having.trouble',
    defaultMessage: 'Having Trouble?',
    description: 'Text before the help link on the custom forgot password page',
  },
  getHelp: {
    id: 'forgot.password.custom.get.help',
    defaultMessage: 'Get Help',
    description: 'Help link on the custom forgot password page',
  },
});

export default messages;
