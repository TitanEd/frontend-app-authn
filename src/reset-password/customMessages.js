import { defineMessages } from '@edx/frontend-platform/i18n';

// Messages of the custom reset password page (CustomResetPasswordPage).
const messages = defineMessages({
  newPasswordPlaceholder: {
    id: 'reset.password.custom.new.password.placeholder',
    defaultMessage: 'Enter new password',
    description: 'Placeholder of the new password field',
  },
  confirmPasswordPlaceholder: {
    id: 'reset.password.custom.confirm.password.placeholder',
    defaultMessage: 'Confirm new password',
    description: 'Placeholder of the confirm new password field',
  },
});

export default messages;
