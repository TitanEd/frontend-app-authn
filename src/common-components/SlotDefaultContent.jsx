import PropTypes from 'prop-types';

/**
 * PluginSlot merges its pluginProps into the default child element. Rendering the default
 * content through this component absorbs those props so they never reach a DOM element
 * (e.g. an `as: 'input'` prop turning a Form.Group into an <input>). The content is passed
 * as `defaultContent` rather than `children`, since pluginProps may carry a `children` key.
 */
const SlotDefaultContent = ({ defaultContent }) => defaultContent;

SlotDefaultContent.propTypes = {
  defaultContent: PropTypes.node.isRequired,
};

export default SlotDefaultContent;
