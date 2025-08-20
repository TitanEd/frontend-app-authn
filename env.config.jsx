import { PLUGIN_OPERATIONS, DIRECT_PLUGIN } from "@openedx/frontend-plugin-framework";
import CustomLogistration from "./src/logistration/CustomLogistration";
import CustomForgotPage from "./src/forgot-password/CustomForgotPage";


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
        }
    }
}

export default config;
