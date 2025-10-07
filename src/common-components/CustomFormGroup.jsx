import React, { useState } from 'react';

import {
  Form, TransitionReplace,
} from '@openedx/paragon';
import PropTypes from 'prop-types';

const CustomFormGroup = (props) => {
  const [hasFocus, setHasFocus] = useState(false);

  const handleFocus = (e) => {
    setHasFocus(true);
    if (props.handleFocus) { props.handleFocus(e); }
  };
  const handleClick = (e) => {
    if (props.handleClick) { props.handleClick(e); }
  };
  const handleOnBlur = (e) => {
    setHasFocus(false);
    if (props.handleBlur) { props.handleBlur(e); }
  };

  return (
    <Form.Group className={`mb-2 ${props.className || ''}`}>
      <Form.Label>
        {props.floatingLabel}
        {props.required && <span className="required-asterisk"> *</span>}
      </Form.Label>
      <Form.Control
        as={props.as}
        readOnly={props.readOnly}
        type={props.type}
        aria-invalid={props.errorMessage !== ''}
        className="form-group__form-field"
        autoComplete={props.autoComplete}
        spellCheck={props.spellCheck}
        name={props.name}
        value={props.value}
        onFocus={handleFocus}
        onBlur={handleOnBlur}
        onClick={handleClick}
        onChange={props.handleChange}
        controlClassName={props.borderClass}
        trailingElement={props.trailingElement}
        isInvalid={props.errorMessage !== ''}
        placeholder={props.placeholder}
      >
        {props.options ? props.options() : null}
      </Form.Control>
      {props.helpText && props.helpText.length > 0 && (
        <Form.Text>
          {props.helpText.map((message, index) => (
            <span key={`help-text-${index.toString()}`}>
              {message}
              {index < props.helpText.length - 1 && <br />}
            </span>
          ))}
        </Form.Text>
      )}
      {props.errorMessage !== '' && (
        <Form.Control.Feedback type="invalid">
          {props.errorMessage}
        </Form.Control.Feedback>
      )}
      {props.children}
    </Form.Group>
  );
};

CustomFormGroup.defaultProps = {
  as: 'input',
  autoComplete: null,
  borderClass: '',
  children: null,
  className: '',
  errorMessage: '',
  handleBlur: null,
  handleChange: () => {},
  handleClick: null,
  handleFocus: null,
  helpText: [],
  options: null,
  placeholder: '',
  readOnly: false,
  required: false,
  spellCheck: null,
  trailingElement: null,
  type: 'text',
};

CustomFormGroup.propTypes = {
  as: PropTypes.string,
  autoComplete: PropTypes.string,
  borderClass: PropTypes.string,
  children: PropTypes.element,
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  floatingLabel: PropTypes.string.isRequired,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleClick: PropTypes.func,
  handleFocus: PropTypes.func,
  helpText: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  options: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  spellCheck: PropTypes.string,
  trailingElement: PropTypes.element,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default CustomFormGroup;
