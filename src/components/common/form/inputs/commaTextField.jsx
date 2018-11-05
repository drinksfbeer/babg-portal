import React from 'react';
import PropTypes from 'prop-types';
import commaStringToArray from '../../../../helpers/commaStringToArray';

const CommaTextField = ({
  containerClass = '',
  containerStyle = {},
  inputClass = '',
  labelClass = '',
  errorStyle = {},
  labelStyle = {},
  inputStyle = {},
  input,
  label,
  placeholder,
  type = 'text',
  meta: { touched, error },
}) => (
  <div
    className={containerClass}
    style={{
      // margin: '20px',
      ...containerStyle,
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          margin: '3px 0px',
          ...labelStyle,
        }}
        className={labelClass}
      >
        {label}
      </span>
      {touched &&
        error && (
          <span
            style={{
              color: '#ff1133',
              ...errorStyle,
            }}
          >
            {error}
          </span>
        )}
    </div>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: '5px',
      }}
    >
      {commaStringToArray(input.value).map(item => (
        <div
          key={item}
          style={{
            backgroundColor: '#333',
            padding: '7px 14px',
            borderRadius: '2px',
            color: 'white',
            marginRight: '3px',
            whiteSpace: 'nowrap',
          }}
        >
          {item}
        </div>
        ))}
    </div>
    <input
      {...input}
      style={{
        ...inputStyle,
      }}
      className={inputClass}
      placeholder={placeholder || label}
      type={type}
    />
  </div>
);

CommaTextField.defaultProps = {
  containerClass: '',
  inputClass: '',
  labelClass: '',
  containerStyle: {},
  errorStyle: {},
  labelStyle: {},
  inputStyle: {},
  placeholder: '',
  type: 'text',
  meta: {
    touched: false,
    error: '',
  },
};

CommaTextField.propTypes = {
  containerClass: PropTypes.string,
  inputClass: PropTypes.string,
  labelClass: PropTypes.string,
  containerStyle: PropTypes.shape({}),
  errorStyle: PropTypes.shape({}),
  labelStyle: PropTypes.shape({}),
  inputStyle: PropTypes.shape({}),
  input: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

export default CommaTextField;
