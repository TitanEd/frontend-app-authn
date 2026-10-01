import React, { useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Form,
  Icon,
  Spinner,
  StatefulButton,
} from '@openedx/paragon';
import { ArrowBack } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';

import { validatePassword } from './data/api';
import { useResetPassword, useValidateToken } from './data/apiHook';
import {
  FORM_SUBMISSION_ERROR, PASSWORD_RESET, PASSWORD_RESET_ERROR, PASSWORD_VALIDATION_ERROR, TOKEN_STATE,
} from './data/constants';
import messages from './messages';
import ResetPasswordFailure from './ResetPasswordFailure';
import { PasswordField } from '../common-components';
import {
  LETTER_REGEX, LOGIN_PAGE, NUMBER_REGEX, RESET_PAGE,
} from '../data/constants';
import { getAllPossibleQueryParams, updatePathWithQueryParams, windowScrollTo } from '../data/utils';

const CustomResetPasswordPage = (props) => {
  const { formatMessage } = useIntl();
  const newPasswordError = formatMessage(messages['password.validation.message']);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [errorCode, setErrorCode] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (props.status !== TOKEN_STATE.PENDING && props.status !== PASSWORD_RESET_ERROR) {
      setErrorCode(props.status);
    }
    if (props.status === PASSWORD_VALIDATION_ERROR) {
      setFormErrors({ newPassword: newPasswordError });
    }
  }, [props.status, newPasswordError]);

  const validatePasswordFromBackend = async (password) => {
    let errorMessage = '';
    try {
      const payload = {
        reset_password_page: true,
        password,
      };
      errorMessage = await validatePassword(payload);
    } catch (err) {
      errorMessage = '';
    }
    setFormErrors({ ...formErrors, newPassword: errorMessage });
  };

  const validateInput = (name, value) => {
    switch (name) {
      case 'newPassword':
        if (!value || !LETTER_REGEX.test(value) || !NUMBER_REGEX.test(value) || value.length < 8) {
          formErrors.newPassword = formatMessage(messages['password.validation.message']);
        } else {
          validatePasswordFromBackend(value);
        }
        break;
      case 'confirmPassword':
        if (!value) {
          formErrors.confirmPassword = formatMessage(messages['confirm.your.password']);
        } else if (value !== newPassword) {
          formErrors.confirmPassword = formatMessage(messages['passwords.do.not.match']);
        } else {
          formErrors.confirmPassword = '';
        }
        break;
      default:
        break;
    }
    setFormErrors({ ...formErrors });
    return !Object.values(formErrors).some(x => (x !== ''));
  };

  const handleOnBlur = (event) => {
    const { name, value } = event.target;
    validateInput(name, value);
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;

    setConfirmPassword(value);
    validateInput('confirmPassword', value);
  };

  const handleOnFocus = (e) => {
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isPasswordValid = validateInput('newPassword', newPassword);
    const isPasswordConfirmed = validateInput('confirmPassword', confirmPassword);

    if (isPasswordValid && isPasswordConfirmed) {
      const formPayload = {
        new_password1: newPassword,
        new_password2: confirmPassword,
      };
      const params = getAllPossibleQueryParams();
      props.resetPassword(formPayload, props.token || token, params);
    } else {
      setErrorCode(FORM_SUBMISSION_ERROR);
      windowScrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  };

  if (props.status === TOKEN_STATE.PENDING) {
    if (token || props.token) {
      props.validateToken(props.token || token);
      return <Spinner animation="border" variant="primary" className="spinner--position-centered" />;
    }
  } else if (props.status === PASSWORD_RESET_ERROR) {
    navigate(updatePathWithQueryParams(RESET_PAGE), { state: { status: props.resetFailureCode } });
  } else if (props.status === 'success') {
    navigate(updatePathWithQueryParams(LOGIN_PAGE), { state: { showResetPasswordSuccessBanner: true } });
  } else {
    return (
    <div className="custom-reset-password-container">
      <Helmet>
        <title>
          {formatMessage(messages['reset.password.page.title'], { siteName: getConfig().SITE_NAME })}
        </title>
      </Helmet>
      <div className="reset-password-form-wrapper">
        <div className="reset-password-form-container">
          {/* Back Button */}
          <div className="back-button-container">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate(updatePathWithQueryParams(LOGIN_PAGE))}
            >
              <Icon src={ArrowBack} />
            </button>
          </div>

          {/* Main Form */}
          <Form id="set-reset-password-form" name="set-reset-password-form" className="reset-password-form">
            <ResetPasswordFailure errorCode={errorCode} errorMsg={props.errorMsg} />
            <h2 className="reset-password-title">
              {formatMessage(messages['reset.password'])}
            </h2>
            <p className="reset-password-instructions">
              {formatMessage(messages['reset.password.page.instructions'])}
            </p>

            <PasswordField
              name="newPassword"
              value={newPassword}
              handleChange={(e) => setNewPassword(e.target.value)}
              handleBlur={handleOnBlur}
              handleFocus={handleOnFocus}
              errorMessage={formErrors.newPassword}
              floatingLabel={formatMessage(messages['new.password.label'])}
              placeholder="Enter new password"
            />

            <PasswordField
              name="confirmPassword"
              value={confirmPassword}
              handleChange={handleConfirmPasswordChange}
              handleFocus={handleOnFocus}
              errorMessage={formErrors.confirmPassword}
              showRequirements={false}
              floatingLabel={formatMessage(messages['confirm.password.label'])}
              placeholder="Confirm new password"
            />

            <StatefulButton
              id="submit-new-password"
              name="submit-new-password"
              type="submit"
              variant="brand"
              className="reset-password--button"
              state={props.status}
              labels={{
                default: formatMessage(messages['reset.password']),
                pending: '',
              }}
              onClick={handleSubmit}
              onMouseDown={(e) => e.preventDefault()}
            />
          </Form>
        </div>
        </div>
      </div>
    );
  }
  return null;
};

CustomResetPasswordPage.defaultProps = {
  status: null,
  token: null,
  errorMsg: null,
};

CustomResetPasswordPage.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  validateToken: PropTypes.func.isRequired,
  token: PropTypes.string,
  status: PropTypes.string,
  errorMsg: PropTypes.string,
};

/**
 * Replaces the redux `connect` used on sumac (verawood removed redux). Supplies the same props
 * the reset password reducer/saga provided, backed by the React Query hooks.
 */
const ConnectedCustomResetPasswordPage = (props) => {
  const [resetPasswordState, setResetPasswordState] = React.useState({
    status: props.status || TOKEN_STATE.PENDING,
    token: props.token || null,
    errorMsg: props.errorMsg || null,
    resetFailureCode: null,
  });
  const validateTokenStarted = React.useRef(false);
  const { mutate: validateResetToken } = useValidateToken();
  const { mutate: resetUserPassword } = useResetPassword();

  const passwordResetFailure = (errorCode) => {
    setResetPasswordState(state => ({ ...state, status: PASSWORD_RESET_ERROR, resetFailureCode: errorCode }));
  };

  const validateTokenAction = (token) => {
    // the component calls this while rendering, so only send the request once
    if (validateTokenStarted.current) {
      return;
    }
    validateTokenStarted.current = true;
    validateResetToken(token, {
      onSuccess: (data) => {
        if (data.is_valid) {
          setResetPasswordState(state => ({ ...state, status: TOKEN_STATE.VALID, token }));
        } else {
          passwordResetFailure(PASSWORD_RESET.INVALID_TOKEN);
        }
      },
      onError: (err) => {
        if (err.response && err.response.status === 429) {
          passwordResetFailure(PASSWORD_RESET.FORBIDDEN_REQUEST);
        } else {
          passwordResetFailure(PASSWORD_RESET.INTERNAL_SERVER_ERROR);
        }
      },
    });
  };

  const resetPasswordAction = (formPayload, token, params) => {
    setResetPasswordState(state => ({ ...state, status: 'pending' }));
    resetUserPassword({ formPayload, token, params }, {
      onSuccess: (data) => {
        if (data.reset_status) {
          setResetPasswordState(state => ({ ...state, status: 'success' }));
        } else if (data.token_invalid) {
          passwordResetFailure(PASSWORD_RESET.INVALID_TOKEN);
        } else {
          setResetPasswordState(state => ({ ...state, status: PASSWORD_VALIDATION_ERROR, errorMsg: data.err_msg }));
        }
      },
      onError: (err) => {
        const data = err.response?.data;
        if (data?.token_invalid) {
          passwordResetFailure(PASSWORD_RESET.INVALID_TOKEN);
        } else if (err.response && err.response.status === 429) {
          setResetPasswordState(state => ({ ...state, status: PASSWORD_RESET.FORBIDDEN_REQUEST }));
        } else if (data?.err_msg) {
          setResetPasswordState(state => ({ ...state, status: PASSWORD_VALIDATION_ERROR, errorMsg: data.err_msg }));
        } else {
          setResetPasswordState(state => ({ ...state, status: PASSWORD_RESET.INTERNAL_SERVER_ERROR }));
        }
      },
    });
  };

  return (
    <CustomResetPasswordPage
      {...props}
      {...resetPasswordState}
      resetPassword={resetPasswordAction}
      validateToken={validateTokenAction}
    />
  );
};

export default ConnectedCustomResetPasswordPage;
