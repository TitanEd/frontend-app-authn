import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { AppProvider } from '@edx/frontend-platform/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Navigate, Route, Routes } from 'react-router-dom';

import {
  EmbeddedRegistrationRoute, NotFoundPage, registerIcons, UnAuthOnlyRoute, Zendesk,
} from './common-components';
import configureStore from './data/configureStore';
import {
  AUTHN_PROGRESSIVE_PROFILING,
  LOGIN_PAGE,
  PAGE_NOT_FOUND,
  PASSWORD_RESET_CONFIRM,
  RECOMMENDATIONS,
  REGISTER_EMBEDDED_PAGE,
  REGISTER_PAGE,
  RESET_PAGE,
} from './data/constants';
import { updatePathWithQueryParams } from './data/utils';
import { ForgotPasswordPage } from './forgot-password';
import Logistration from './logistration/Logistration';
import { ProgressiveProfiling } from './progressive-profiling';
import { RecommendationsPage } from './recommendations';
import { RegistrationPage } from './register';
import { ResetPasswordPage } from './reset-password';

import './index.scss';

registerIcons();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set staleTime to 5 minutes
      staleTime: 5 * 60 * 1000,
      // Set cacheTime to 60 minutes
      cacheTime: 60 * 60 * 1000,
    },
  },
});

const MainApp = () => (
  <AppProvider store={configureStore()}>
    <QueryClientProvider client={queryClient}>
      {getConfig().ZENDESK_KEY && <Zendesk />}
      <Switch>
        <Route exact path="/">
          <Redirect to={updatePathWithQueryParams(REGISTER_PAGE)} />
        </Route>
        <UnAuthOnlyRoute exact path={LOGIN_PAGE} render={() => <Logistration selectedPage={LOGIN_PAGE} />} />
        <UnAuthOnlyRoute exact path={REGISTER_PAGE} component={Logistration} />
        <UnAuthOnlyRoute exact path={RESET_PAGE} component={ForgotPasswordPage} />
        <Route exact path={PASSWORD_RESET_CONFIRM} component={ResetPasswordPage} />
        <Route exact path={AUTHN_PROGRESSIVE_PROFILING} component={ProgressiveProfiling} />
        <Route exact path={RECOMMENDATIONS} component={RecommendationsPage} />
        <Route path={PAGE_NOT_FOUND} component={NotFoundPage} />
        <Route path="*">
          <Redirect to={PAGE_NOT_FOUND} />
        </Route>
      </Switch>
    </QueryClientProvider>
  </AppProvider>
);

export default MainApp;