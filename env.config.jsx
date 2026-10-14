import React from 'react';
import { PLUGIN_OPERATIONS, DIRECT_PLUGIN } from "@openedx/frontend-plugin-framework";
import CustomLogistration from "./src/logistration/CustomLogistration";
import CustomForgotPage from "./src/forgot-password/CustomForgotPage";
import CustomResetPasswordPage from "./src/reset-password/CustomResetPasswordPage";
import CustomPasswordField from "./src/common-components/CustomPasswordField";
import CustomFormGroup from "./src/common-components/CustomFormGroup";
import { APP_CONFIG_INITIALIZED, getConfig, subscribe } from '@edx/frontend-platform';
import CustomSocialAuthProviders from "./src/common-components/CustomSocialAuthProviders";

// Google Tag Manager and the support chat of the site (Control Hub -> Add-ons -> Integration):
// the LMS serves them as one small script (control-hub integrations/api.py). The other forks
// load it from src/customHeaderExtras.jsx; the sign-in pages have no header, so it is done here.
subscribe(APP_CONFIG_INITIALIZED, () => {
    try {
        const lmsBaseUrl = getConfig().LMS_BASE_URL;
        if (!lmsBaseUrl || window.telsSiteIntegrationsRequested || window.top !== window.self) { return; }
        window.telsSiteIntegrationsRequested = true;
        const script = document.createElement('script');
        script.async = true;
        script.src = `${lmsBaseUrl}/integrations/site.js`;
        document.head.appendChild(script);
    } catch (e) {
        // No access to the top window (embedded by another site): nothing to load.
    }
});


const config = {
    ...process.env,
    pluginSlots: {
        logistration_plugin_slot: {
            keepDefault: false,
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget: {
                        id: "login_page_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props) => (
                            <CustomLogistration {...props} />
                        )
                    }
                }
            ]
        },
        forgot_password_plugin_slot: {
            keepDefault: false,
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget: {
                        id: "forgot_password_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props) => (
                            <CustomForgotPage {...props} />
                        )
                    }
                }
            ]
        },
        reset_password_plugin_slot: {
            keepDefault: false,
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget: {
                        id: "reset_password_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props) => (
                            <CustomResetPasswordPage {...props} />
                        )
                    }
                }
            ]
        },
        password_field_plugin_slot: {
            keepDefault: false,
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget: {
                        id: "password_field_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props) => (
                            <CustomPasswordField {...props} />
                        )
                    }
                }
            ]
        },
        form_group_plugin_slot: {
            keepDefault: false,
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget: {
                        id: "form_group_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props) => (
                            <CustomFormGroup {...props} />
                        )
                    }
                }
            ]
        },
        social_auth_providers_plugin_slot: {
            keepDefault: false,
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget: {
                        id: "social_auth_providers_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props) => (
                            <CustomSocialAuthProviders {...props} />
                        )
                    }
                }
            ]
        }
    }
}

export default config;
