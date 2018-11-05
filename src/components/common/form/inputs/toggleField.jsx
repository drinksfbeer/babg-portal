import React from 'react';
import PropTypes from 'prop-types';

// TODO FINISH THIS

const ToggleField = ({
  containerClass = 'cell',
  containerStyle = {},
  labelStyle = {},
  label,
  input,
  labelClass = '',
  meta: { error },
  errorStyle = {},
}) => {
  const randomId = Math.floor(Math.random() * 1000);
  const componentId = label.replace(' ', '') + randomId;
  return (
    <div
      className={`${containerClass}  switch`}
      style={{ ...containerStyle }}
    >
      {
        label &&
        <label
          // htmlFor="" need to figure this out
          style={{ ...labelStyle }}
          className={labelClass}
        >
          {label}
          {
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
        className="switch-input"
        // onClick={() => input.onChange(!input.value)}
        onChange={() => input.onChange(!input.value)}
        checked={input.value}
        id={componentId}
        style={{}}
        type="checkbox"
        name="exampleSwitch"
      />

      {label &&
        <label
          // htmlFor="" need to figure this out
          style={{ ...labelStyle }}
          className={`switch-paddle ${labelClass}`}
          htmlFor={componentId}
        >
          <span className="show-for-sr">
            {label}
          </span>
          {error &&
            <span
              className="errorMessage"
              style={{ ...errorStyle }}
            >
              {error}
            </span>
          }
        </label>
      }

    </div>
  );
};

ToggleField.defaultProps = {
  labelClass: '',
  errorStyle: {},
  containerClass: '',
  containerStyle: {},
  labelStyle: {},
  meta: {
    error: '',
  },
};

ToggleField.propTypes = {
  errorStyle: PropTypes.shape({}),
  labelClass: PropTypes.string,
  label: PropTypes.string.isRequired,
  input: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  containerClass: PropTypes.string,
  containerStyle: PropTypes.shape({}),
  labelStyle: PropTypes.shape({}),
  meta: PropTypes.shape({
    error: PropTypes.string,
  }),
};

export default ToggleField;
