from tutor import hooks
from tutormfe.hooks import PLUGIN_SLOTS

hooks.Filters.ENV_PATCHES.add_item(
     (
         "mfe-env-config-runtime-definitions-authn",
         """
        // This file contains configuration for plugins and environment variables.
const { PLUGIN_OPERATIONS, DIRECT_PLUGIN } = await import('@openedx/frontend-plugin-framework');
const { default: CustomLogistration } = await import('./src/logistration/CustomLogistration');
const { default: CustomForgotPage } = await import('./src/forgot-password/CustomForgotPage');
const { default: CustomResetPasswordPage } = await import('./src/reset-password/CustomResetPasswordPage');
const { default: CustomPasswordField } = await import('./src/common-components/CustomPasswordField');
const { default: CustomFormGroup } = await import('./src/common-components/CustomFormGroup');
const { default: CustomSocialAuthProviders } = await import('./src/common-components/CustomSocialAuthProviders');

{% raw %}

const getPluginSlots = () => {
return {

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

  };
};

// Load environment variables from .env file
config.pluginSlots = getPluginSlots();

{% endraw %}
"""
     ))
