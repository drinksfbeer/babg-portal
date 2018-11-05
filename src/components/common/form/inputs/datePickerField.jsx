import React from 'react';
import PropTypes from 'prop-types';
import Flatpickr from 'react-flatpickr';
/*
  this input will output unix time stamp.
  Unix time stamp is way better than native javascript date object
*/

const DatePickerField = ({
  label,
  containerClass,
  input,
  placeholder,
  options,
  meta: { touched, error },
}) => (
  <div className={containerClass}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <label>
        {label}
        {
          (touched && error) &&
          <span className="errorMessage">
            {error}
          </span>
        }
      </label>
    </div>
    <Flatpickr
      data-enable-time={options.hasOwnProperty('enableTime') ? options.enableTime : true}
      options={{
        altInput: true,
        // defaultDate: input.value ? new Date(input.value) : null,
        ...options,
      }}
      value={input.value ? new Date(input.value) : null}
      placeholder={placeholder || label}
      onChange={v => input.onChange(Date.parse(v[0]))}
    />
  </div>
);

DatePickerField.propTypes = {
  label: PropTypes.string,
  containerClass: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  placeholder: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  options: PropTypes.shape({}),
};

DatePickerField.defaultProps = {
  label: '',
  containerClass: '',
  placeholder: '',
  meta: {
    touched: false,
    error: '',
  },
  options: {},
};

export default DatePickerField;
