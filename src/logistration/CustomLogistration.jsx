import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { sendPageEvent, sendTrackEvent } from '@edx/frontend-platform/analytics';
import { getAuthService } from '@edx/frontend-platform/auth';
import { injectIntl, useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Form,
  StatefulButton,
  Tab,
  Tabs,
} from '@openedx/paragon';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { FormGroup, PasswordField, RedirectLogistration } from '../common-components';
import { clearThirdPartyAuthContextErrorMessage, getThirdPartyAuthContext } from '../common-components/data/actions';
import {
  thirdPartyAuthContextSelector,
  tpaProvidersSelector,
} from '../common-components/data/selectors';
import messages from '../common-components/messages';
import ThirdPartyAuth from '../common-components/ThirdPartyAuth';
import ThirdPartyAuthAlert from '../common-components/ThirdPartyAuthAlert';
import {
  DEFAULT_STATE, LOGIN_PAGE, PENDING_STATE, REGISTER_PAGE, RESET_PAGE,
} from '../data/constants';
import {
  getActivationStatus, getAllPossibleQueryParams, getTpaHint, getTpaProvider,
  updatePathWithQueryParams,
} from '../data/utils';
import { LoginPage } from '../login';
import AccountActivationMessage from '../login/AccountActivationMessage';
import {
  backupLoginForm, backupLoginFormBegin, dismissPasswordResetBanner, loginRequest,
} from '../login/data/actions';
import { INVALID_FORM, TPA_AUTHENTICATION_FAILURE } from '../login/data/constants';
import LoginFailureMessage from '../login/LoginFailure';
import { RegistrationPage } from '../register';
import { backupRegistrationForm } from '../register/data/actions';
import ResetPasswordSuccess from '../reset-password/ResetPasswordSuccess';
import { Helmet } from 'react-helmet';

const CustomLogistration = (props) => {
  const {
    selectedPage,
    tpaProviders,
    backedUpFormData,
    loginErrorCode,
    loginErrorContext,
    loginResult,
    shouldBackupState,
    thirdPartyAuthContext: {
      providers,
      currentProvider,
      secondaryProviders,
      finishAuthUrl,
      platformName,
      errorMessage: thirdPartyErrorMessage,
    },
    thirdPartyAuthApiStatus,
    institutionLogin,
    showResetPasswordSuccessBanner,
    submitState,
    // Actions
    backupFormState,
    handleInstitutionLogin,
    getTPADataFromBackend,
  } = props;

  const tpaHint = getTpaHint();
  const { formatMessage } = useIntl();
  const activationMsgType = getActivationStatus();
  const queryParams = useMemo(() => getAllPossibleQueryParams(), []);

  const [key, setKey] = useState('');
  const [formFields, setFormFields] = useState({ ...backedUpFormData.formFields });
  const [errorCode, setErrorCode] = useState({ type: '', count: 0, context: {} });
  const [errors, setErrors] = useState({ ...backedUpFormData.errors });
  const navigate = useNavigate();
  const disablePublicAccountCreation = getConfig().ALLOW_PUBLIC_ACCOUNT_CREATION === false;
  const hideRegistrationLink = getConfig().SHOW_REGISTRATION_LINKS === false;

  const logoUrl = getConfig().LOGO_URL;

  useEffect(() => {
    const authService = getAuthService();
    if (authService) {
      authService.getCsrfTokenService().getCsrfToken(getConfig().LMS_BASE_URL);
    }
  });

  useEffect(() => {
    if (disablePublicAccountCreation) {
      navigate(updatePathWithQueryParams(LOGIN_PAGE));
    }
  }, [navigate, disablePublicAccountCreation]);

  useEffect(() => {
    sendPageEvent('login_and_registration', 'login');
  }, []);

  useEffect(() => {
    const payload = { ...queryParams };
    if (tpaHint) {
      payload.tpa_hint = tpaHint;
    }
    getTPADataFromBackend(payload);
  }, [getTPADataFromBackend, queryParams, tpaHint]);

  useEffect(() => {
    if (shouldBackupState) {
      backupFormState({
        formFields: { ...formFields },
        errors: { ...errors },
      });
    }
  }, [shouldBackupState, formFields, errors, backupFormState]);

  useEffect(() => {
    if (loginErrorCode) {
      setErrorCode(prevState => ({
        type: loginErrorCode,
        count: prevState.count + 1,
        context: { ...loginErrorContext },
      }));
    }
  }, [loginErrorCode, loginErrorContext]);

  useEffect(() => {
    if (thirdPartyErrorMessage) {
      setErrorCode((prevState) => ({
        type: TPA_AUTHENTICATION_FAILURE,
        count: prevState.count + 1,
        context: {
          errorMessage: thirdPartyErrorMessage,
        },
      }));
    }
  }, [thirdPartyErrorMessage]);

  const handleOnSelect = (tabKey, currentTab) => {
    if (tabKey === currentTab) {
      return;
    }
    sendTrackEvent(`edx.bi.${tabKey.replace('/', '')}_form.toggled`, { category: 'user-engagement' });
    props.clearThirdPartyAuthContextErrorMessage();
    if (tabKey === LOGIN_PAGE) {
      props.backupRegistrationForm();
      // Refresh TPA data for the new page
      const payload = { ...queryParams };
      if (tpaHint) {
        payload.tpa_hint = tpaHint;
      }
      // Add a small delay to ensure state updates before fetching new data
      setTimeout(() => {
        getTPADataFromBackend(payload);
      }, 100);
    } else if (tabKey === REGISTER_PAGE) {
      props.backupLoginForm();
    }
    setKey(tabKey);
  };

  const validateFormFields = (payload) => {
    const { emailOrUsername, password } = payload;
    const fieldErrors = { ...errors };

    if (emailOrUsername === '') {
      fieldErrors.emailOrUsername = formatMessage(messages['email.validation.message']);
    } else if (emailOrUsername.length < 2) {
      fieldErrors.emailOrUsername = formatMessage(messages['username.or.email.format.validation.less.chars.message']);
    }
    if (password === '') {
      fieldErrors.password = formatMessage(messages['password.validation.message']);
    }

    return { ...fieldErrors };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (showResetPasswordSuccessBanner) {
      props.dismissPasswordResetBanner();
    }

    const formData = { ...formFields };
    const validationErrors = validateFormFields(formData);
    if (validationErrors.emailOrUsername || validationErrors.password) {
      setErrors({ ...validationErrors });
      setErrorCode(prevState => ({ type: INVALID_FORM, count: prevState.count + 1, context: {} }));
      return;
    }

    // add query params to the payload
    const payload = {
      email_or_username: formData.emailOrUsername,
      password: formData.password,
      ...queryParams,
    };
    props.loginRequest(payload);
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormFields(prevState => ({ ...prevState, [name]: value }));
  };

  const handleOnFocus = (event) => {
    const { name } = event.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const trackForgotPasswordLinkClick = () => {
    sendTrackEvent('edx.bi.password-reset_form.toggled', { category: 'user-engagement' });
  };

  const isValidTpaHint = () => {
    const { provider } = getTpaProvider(tpaHint, providers, secondaryProviders);
    return !!provider;
  };

  const { provider, skipHintedLogin } = getTpaProvider(tpaHint, providers, secondaryProviders);

  if (tpaHint) {
    if (thirdPartyAuthApiStatus === PENDING_STATE) {
      return <Skeleton height={36} />;
    }

    if (skipHintedLogin) {
      window.location.href = getConfig().LMS_BASE_URL + provider.loginUrl;
      return null;
    }

    if (provider) {
      // For now, redirect to original login page for TPA
      return <LoginPage institutionLogin={institutionLogin} handleInstitutionLogin={handleInstitutionLogin} />;
    }
  }

  // If we need to show the original logistration, fall back to it
  if (institutionLogin || disablePublicAccountCreation) {
    return (
      <div>
        {institutionLogin && (
          <Tabs defaultActiveKey="" id="controlled-tab" onSelect={handleInstitutionLogin}>
            <Tab
              title={(
                <div className="d-flex">
                  <span className="ml-2">
                    {selectedPage === LOGIN_PAGE
                      ? formatMessage(messages['logistration.sign.in'])
                      : formatMessage(messages['logistration.register'])}
                  </span>
                </div>
              )}
              eventKey={LOGIN_PAGE}
            />
          </Tabs>
        )}
        <div id="main-content" className="main-content">
          {!institutionLogin && (
            <h3 className="mb-4.5">{formatMessage(messages['logistration.sign.in'])}</h3>
          )}
          <LoginPage institutionLogin={institutionLogin} handleInstitutionLogin={handleInstitutionLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="custom-logistration-container">

      <Helmet>
        <title>{formatMessage(messages['login.page.title'], { siteName: getConfig().SITE_NAME })}</title>
      </Helmet>

      { key && (
        <Navigate to={updatePathWithQueryParams(key)} replace />
      )}

      {/* Main Content */}
      <div className="main-content">
        {!institutionLogin && !isValidTpaHint() && hideRegistrationLink && (
          <h3 className="mb-4.5">
            {formatMessage(messages[selectedPage === LOGIN_PAGE ? 'logistration.sign.in' : 'logistration.register'])}
          </h3>
        )}

        {selectedPage === LOGIN_PAGE ? (
          // Login Page
          <>
            <RedirectLogistration
              success={loginResult.success}
              redirectUrl={loginResult.redirectUrl}
              finishAuthUrl={finishAuthUrl}
            />

            {providers && providers.length > 0 ? (
              // Social Login Enabled - Use split layout
              <div className="login-split-layout">
                {/* Logo and Heading at the top when social login is enabled */}
                <div className="logo-section">
                  <div className="titan-logo">
                    <img src={logoUrl} alt="TitanEd Logo" />
                  </div>
                </div>

                <h2 className="main-heading mt-2">Log In To Your Account</h2>

                {/* Login Form Wrapper */}
                <div className="login-form-wrapper">
                  {/* Left Section - Social Login */}
                  <div className="social-login-section">
                    {/* Social Login Providers from API */}
                    <div className="social-buttons">
                      <ThirdPartyAuth
                        currentProvider={currentProvider}
                        providers={providers}
                        secondaryProviders={secondaryProviders}
                        handleInstitutionLogin={handleInstitutionLogin}
                        thirdPartyAuthApiStatus={thirdPartyAuthApiStatus}
                        isLoginPage
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="divider">
                    <span className="divider-text">Or</span>
                  </div>

                  {/* Right Section - Traditional Login */}
                  <div className="traditional-login-section">
                    <h3 className="section-heading mb-4">Please Enter Your Details</h3>

                    {/* Error Messages and Success Banner */}
                    <div className="mb-4">
                      <LoginFailureMessage
                        errorCode={errorCode.type}
                        errorCount={errorCode.count}
                        context={errorCode.context}
                      />
                      <ThirdPartyAuthAlert
                        currentProvider={currentProvider}
                        platformName={platformName}
                      />
                      <AccountActivationMessage
                        messageType={activationMsgType}
                      />
                      {showResetPasswordSuccessBanner && <ResetPasswordSuccess />}
                    </div>

                    <Form id="sign-in-form" name="sign-in-form" onSubmit={handleSubmit}>
                      <FormGroup
                        name="emailOrUsername"
                        value={formFields.emailOrUsername}
                        autoComplete="on"
                        handleChange={handleOnChange}
                        handleFocus={handleOnFocus}
                        errorMessage={errors.emailOrUsername}
                        floatingLabel="Email or Username"
                        placeholder="Example@titaned.com"
                      />

                      <PasswordField
                        name="password"
                        value={formFields.password}
                        autoComplete="off"
                        showScreenReaderText={false}
                        showRequirements={false}
                        handleChange={handleOnChange}
                        handleFocus={handleOnFocus}
                        errorMessage={errors.password}
                        floatingLabel="Password"
                        placeholder="Enter password"
                      />

                      <StatefulButton
                        name="sign-in"
                        id="sign-in"
                        type="submit"
                        variant="brand"
                        className="login-btn w-100 mb-4"
                        state={submitState}
                        labels={{
                          default: 'Login',
                          pending: '',
                        }}
                        onClick={handleSubmit}
                        onMouseDown={(event) => event.preventDefault()}
                      />

                      <Link
                        id="forgot-password"
                        name="forgot-password"
                        className="forgot-password-link"
                        to={updatePathWithQueryParams(RESET_PAGE)}
                        onClick={trackForgotPasswordLinkClick}
                      >
                        Forgot password?
                      </Link>

                      <div className="text-center mt-4">
                        <span className="signup-text">Don't Have An Account? </span>
                        <Button
                          variant="link"
                          className="signup-link"
                          onClick={() => handleOnSelect(REGISTER_PAGE, selectedPage)}
                        >
                          Sign Up
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            ) : (
              // Social Login NOT Enabled - Use centered layout
              <div className="login-centered-layout">
                {/* Logo and Heading */}
                <div className="logo-section mb-4">
                  <div className="titan-logo">
                    <img src={logoUrl} alt="TitanEd Logo" />
                  </div>
                </div>

                <h2 className="main-heading mb-4">Log In To Your Account</h2>

                {/* Form Container */}
                <div className="login-form-container">
                  <h3 className="section-heading mb-4">Please Enter Your Details</h3>

                  {/* Error Messages and Success Banner */}
                  <div className="mb-4">
                    <LoginFailureMessage
                      errorCode={errorCode.type}
                      errorCount={errorCode.count}
                      context={errorCode.context}
                    />
                    <ThirdPartyAuthAlert
                      currentProvider={currentProvider}
                      platformName={platformName}
                    />
                    <AccountActivationMessage
                      messageType={activationMsgType}
                    />
                    {showResetPasswordSuccessBanner && <ResetPasswordSuccess />}
                  </div>

                  <Form id="sign-in-form" name="sign-in-form" onSubmit={handleSubmit}>
                    <FormGroup
                      name="emailOrUsername"
                      value={formFields.emailOrUsername}
                      autoComplete="on"
                      handleChange={handleOnChange}
                      handleFocus={handleOnFocus}
                      errorMessage={errors.emailOrUsername}
                      floatingLabel="Email or Username"
                      placeholder="Example@titaned.com"
                    />

                    <PasswordField
                      name="password"
                      value={formFields.password}
                      autoComplete="off"
                      showScreenReaderText={false}
                      showRequirements={false}
                      handleChange={handleOnChange}
                      handleFocus={handleOnFocus}
                      errorMessage={errors.password}
                      floatingLabel="Password"
                      placeholder="Enter password"
                    />

                    <StatefulButton
                      name="sign-in"
                      id="sign-in"
                      type="submit"
                      variant="brand"
                      className="login-btn w-100 mb-4"
                      state={submitState}
                      labels={{
                        default: 'Login',
                        pending: '',
                      }}
                      onClick={handleSubmit}
                      onMouseDown={(event) => event.preventDefault()}
                    />

                    <Link
                      id="forgot-password"
                      name="forgot-password"
                      className="forgot-password-link"
                      to={updatePathWithQueryParams(RESET_PAGE)}
                      onClick={trackForgotPasswordLinkClick}
                    >
                      Forgot password?
                    </Link>

                    <div className="text-center mt-4">
                      <span className="signup-text">Don't Have An Account? </span>
                      <Button
                        variant="link"
                        className="signup-link"
                        onClick={() => handleOnSelect(REGISTER_PAGE, selectedPage)}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            )}
          </>
        ) : (
          // Registration Page
          <>
            {providers && providers.length > 0 ? (
              // Social Login Enabled - Use split layout
              <div className="login-split-layout registration-page-with-social-login">
                {/* Logo and Heading at the top when social login is enabled */}
                <div className="logo-section">
                  <div className="titan-logo">
                    <img src={logoUrl} alt="TitanEd Logo" />
                  </div>
                </div>

                <h2 className="main-heading">Create An Account</h2>

                {/* Registration Form Wrapper */}
                <div className="registration-form-wrapper">
                  {/* Left Section - Social Login */}
                  <div className="social-login-section">
                    {/* Social Login Providers from API */}
                    <div className="social-buttons">
                      <ThirdPartyAuth
                        currentProvider={currentProvider}
                        providers={providers}
                        secondaryProviders={secondaryProviders}
                        handleInstitutionLogin={handleInstitutionLogin}
                        thirdPartyAuthApiStatus={thirdPartyAuthApiStatus}
                        isLoginPage={false}
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="divider">
                    <span className="divider-text">Or</span>
                  </div>

                  {/* Right Section - Traditional Registration Form */}
                  <div className="traditional-login-section">
                    <h3 className="section-heading mb-4">Please Enter Your Details</h3>

                    <div className="registration-form">
                      <RegistrationPage
                        institutionLogin={institutionLogin}
                        handleInstitutionLogin={handleInstitutionLogin}
                      />

                      {/* Already Have Account Link */}
                      <div className="text-center mt-4">
                        <span className="signup-text">Already Have An Account? </span>
                        <Button
                          variant="link"
                          className="signup-link"
                          onClick={() => handleOnSelect(LOGIN_PAGE, selectedPage)}
                        >
                          Login
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Social Login NOT Enabled - Use centered layout
              <div className="login-centered-layout">
                {/* Logo and Heading */}
                <div className="logo-section mb-4">
                  <div className="titan-logo">
                    <img src={logoUrl} alt="TitanEd Logo" />
                  </div>
                </div>

                <h2 className="main-heading mb-4">Create An Account</h2>

                {/* Form Container */}
                <div className="registration-form-container">
                  <h3 className="section-heading mb-4">Please Enter Your Details</h3>

                  <div className="registration-form">
                    <RegistrationPage
                      institutionLogin={institutionLogin}
                      handleInstitutionLogin={handleInstitutionLogin}
                    />

                    {/* Already Have Account Link */}
                    <div className="text-center mt-4">
                      <span className="signup-text">Already Have An Account? </span>
                      <Button
                        variant="link"
                        className="signup-link"
                        onClick={() => handleOnSelect(LOGIN_PAGE, selectedPage)}
                      >
                        Login
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

CustomLogistration.propTypes = {
  selectedPage: PropTypes.string,
  backupLoginForm: PropTypes.func.isRequired,
  backupRegistrationForm: PropTypes.func.isRequired,
  clearThirdPartyAuthContextErrorMessage: PropTypes.func.isRequired,
  backedUpFormData: PropTypes.shape({
    formFields: PropTypes.shape({}),
    errors: PropTypes.shape({}),
  }),
  loginErrorCode: PropTypes.string,
  loginErrorContext: PropTypes.shape({
    email: PropTypes.string,
    redirectUrl: PropTypes.string,
    context: PropTypes.shape({}),
  }),
  loginResult: PropTypes.shape({
    redirectUrl: PropTypes.string,
    success: PropTypes.bool,
  }),
  shouldBackupState: PropTypes.bool,
  showResetPasswordSuccessBanner: PropTypes.bool,
  submitState: PropTypes.string,
  thirdPartyAuthApiStatus: PropTypes.string,
  institutionLogin: PropTypes.bool.isRequired,
  thirdPartyAuthContext: PropTypes.shape({
    currentProvider: PropTypes.string,
    errorMessage: PropTypes.string,
    platformName: PropTypes.string,
    providers: PropTypes.arrayOf(PropTypes.shape({})),
    secondaryProviders: PropTypes.arrayOf(PropTypes.shape({})),
    finishAuthUrl: PropTypes.string,
  }),
  // Actions
  backupFormState: PropTypes.func.isRequired,
  dismissPasswordResetBanner: PropTypes.func.isRequired,
  loginRequest: PropTypes.func.isRequired,
  getTPADataFromBackend: PropTypes.func.isRequired,
  handleInstitutionLogin: PropTypes.func.isRequired,
};

CustomLogistration.defaultProps = {
  selectedPage: REGISTER_PAGE,
  backedUpFormData: {
    formFields: {
      emailOrUsername: '', password: '',
    },
    errors: {
      emailOrUsername: '', password: '',
    },
  },
  loginErrorCode: null,
  loginErrorContext: {},
  loginResult: {},
  shouldBackupState: false,
  showResetPasswordSuccessBanner: false,
  submitState: DEFAULT_STATE,
  thirdPartyAuthApiStatus: PENDING_STATE,
  thirdPartyAuthContext: {
    currentProvider: null,
    errorMessage: null,
    finishAuthUrl: null,
    providers: [],
    secondaryProviders: [],
  },
};

const mapStateToProps = state => {
  const loginPageState = state.login;
  return {
    backedUpFormData: loginPageState.loginFormData,
    loginErrorCode: loginPageState.loginErrorCode,
    loginErrorContext: loginPageState.loginErrorContext,
    loginResult: loginPageState.loginResult,
    shouldBackupState: loginPageState.shouldBackupState,
    showResetPasswordSuccessBanner: loginPageState.showResetPasswordSuccessBanner,
    submitState: loginPageState.submitState,
    thirdPartyAuthContext: thirdPartyAuthContextSelector(state),
    thirdPartyAuthApiStatus: state.commonComponents.thirdPartyAuthApiStatus,
  };
};

export default connect(
  mapStateToProps,
  {
    backupLoginForm,
    backupRegistrationForm,
    clearThirdPartyAuthContextErrorMessage,
    backupFormState: backupLoginFormBegin,
    dismissPasswordResetBanner,
    loginRequest,
    getTPADataFromBackend: getThirdPartyAuthContext,
  },
)(injectIntl(CustomLogistration));
