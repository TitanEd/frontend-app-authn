import { PLUGIN_OPERATIONS, DIRECT_PLUGIN } from "@openedx/frontend-plugin-framework";
import CustomLogistration from "./src/logistration/CustomLogistration";
import CustomForgotPage from "./src/forgot-password/CustomForgotPage";
import CustomResetPasswordPage from "./src/reset-password/CustomResetPasswordPage";
import CustomPasswordField from "./src/common-components/CustomPasswordField";
import CustomFormGroup from "./src/common-components/CustomFormGroup";


const config = {
    ...process.env,
    pluginSlots: {
        logistration_plugin_slot: {
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
        }
    }
}

export default config;
