import React from 'react';
import PropTypes from 'prop-types';

// options will come in as an array of  { value and title }

const SelectField = ({
  input,
  label,
  options,
  placeholder,
  optionStyle = {},
  lastOptionStyle = {},
  containerClass = '',
  containerStyle = {},
  inputStyle = {},
  labelStyle = {},
  labelClass = '',
  errorStyle = {},
  onSelect,
  disabled,
  description,
  meta: { touched, error },
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

    <select
      value={input.value}
      onChange={(e) => {
        input.onChange(e.target.value);
        if (onSelect) onSelect(e.target.value);
      }}
      style={{ opacity: disabled ? 0.5 : 1 }}
      disabled={disabled}
    >
      <option style={inputStyle} value="">
        {placeholder || label}
      </option>
      {options.map((option, i) => (
        <option
          style={{
            ...optionStyle,
            ...(i === options.length - 1 ? lastOptionStyle : {}),
          }}
          key={option.value}
          value={option.value}
        >
          {option.title || options.value}
        </option>
      ))}
    </select>
    {description &&
      <div className="description">{description}</div>
    }
  </div>
);

SelectField.defaultProps = {
  description: '',
  placeholder: '',
  labelClass: '',
  optionStyle: {},
  lastOptionStyle: {},
  containerClass: '',
  containerStyle: {},
  inputStyle: {},
  labelStyle: {},
  errorStyle: {},
  onSelect: null,
  meta: {
    touched: false,
    error: '',
  },
  options: [],
  disabled: false,
};
SelectField.propTypes = {
  description: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    title: PropTypes.string,
  })),
  placeholder: PropTypes.string,
  optionStyle: PropTypes.shape({}),
  lastOptionStyle: PropTypes.shape({}),
  containerClass: PropTypes.string,
  containerStyle: PropTypes.shape({}),
  inputStyle: PropTypes.shape({}),
  labelStyle: PropTypes.shape({}),
  errorStyle: PropTypes.shape({}),
  labelClass: PropTypes.string,
  onSelect: PropTypes.func,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  disabled: PropTypes.bool,
};

export default SelectField;
