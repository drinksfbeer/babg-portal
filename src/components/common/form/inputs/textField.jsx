import React from 'react';
import PropTypes from 'prop-types';

const TextField = ({
  containerClass = '',
  containerStyle = {},
  inputClass = '',
  labelClass = '',
  errorStyle = {},
  labelStyle = {},
  inputStyle = {},
  inputProps,
  input,
  label,
  placeholder,
  type = 'text',
  meta: { touched, error },
  description,
  disabled,
}) => (
  <div
    className={containerClass}
    style={{ ...containerStyle }}
  >
    {label &&
      <label
        // htmlFor="" need to figure this out
        style={{ ...labelStyle }}
        className={labelClass}
      >
        {label}
        {touched &&
          error && (
            <span
              className="errorMessage"
              style={{ ...errorStyle }}
            >
              {error}
            </span>
          )}
      </label>
    }

    <input
      {...input}
      style={{
        opacity: disabled ? 0.5 : 1,
        ...inputStyle,
      }}
      className={inputClass}
      placeholder={placeholder || label}
      type={type}
      disabled={disabled}
      {...inputProps}
    />
    {description &&
      <div className="description">{description}</div>
    }
  </div>
);

TextField.defaultProps = {
  description: '',
  containerClass: 'cell',
  inputClass: '',
  labelClass: '',
  containerStyle: {},
  errorStyle: {},
  labelStyle: {},
  inputStyle: {},
  inputProps: {},
  placeholder: '',
  type: 'text',
  meta: {
    touched: false,
    error: '',
  },
  label: '',
  disabled: false,
};

TextField.propTypes = {
  description: PropTypes.string,
  containerClass: PropTypes.string,
  inputClass: PropTypes.string,
  labelClass: PropTypes.string,
  containerStyle: PropTypes.shape({}),
  errorStyle: PropTypes.shape({}),
  labelStyle: PropTypes.shape({}),
  inputStyle: PropTypes.shape({}),
  inputProps: PropTypes.shape({}),
  input: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  disabled: PropTypes.bool,
};

export default TextField;
