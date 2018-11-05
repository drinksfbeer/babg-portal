import React from 'react';
import PropTypes from 'prop-types';

const TextAreaField = ({
  input,
  label,
  placeholder,
  rows,
  containerClass = '',
  containerStyle = {},
  meta: { touched, error },
}) => (
  <div
    className={containerClass}
    style={{ ...containerStyle }}
  >
    {label &&
      <label>{label}</label>
    }
    {touched &&
      error && (
        <span className="errorMessage">
          {error}
        </span>
      )}
    <textarea
      {...input}
      className="textarea-normal"
      rows={rows}
      placeholder={placeholder || label}
    />
  </div>
);

TextAreaField.defaultProps = {
  placeholder: '',
  rows: 4,
  meta: {
    touched: false,
    error: '',
  },
  containerClass: '',
  containerStyle: {},
  label: '',
};

TextAreaField.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  containerClass: PropTypes.string,
  containerStyle: PropTypes.shape({}),
};

export default TextAreaField;
