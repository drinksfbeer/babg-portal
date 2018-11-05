import React from 'react';
import PropTypes from 'prop-types';

const FancyError = ({
  icon,
  title,
  error,
  stringify,
  tabs,
  containerStyle,
  contentStyle,
  titleStyle,
}) => (
  <div className="grid-container fluid" style={containerStyle}>
    <div
      className="grid-x grid-margin-x grid-margin-y grid-padding-y"
      style={contentStyle}
    >
      <div
        className="cell large-12 medium-12"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#E53935',
          ...titleStyle,
        }}
      >
        {
          icon &&
          <i
            className="material-icons"
            style={{
              marginRight: '0.5em',
              fontSize: '250%',
              userSelect: 'none',
            }}
          >
            {icon}
          </i>
        }
        <span style={{ fontWeight: 'bold' }}>
          {title}
        </span>
      </div>
      <pre
        className="cell large-12 medium-12"
        style={{ fontSize: '75%', color: '#616161' }}
      >
        {stringify ? JSON.stringify(error, null, tabs) : error}
      </pre>
    </div>
  </div>
);

FancyError.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  error: PropTypes.string || PropTypes.shape({}),
  stringify: PropTypes.bool,
  tabs: PropTypes.number,
  containerStyle: PropTypes.shape({}),
  contentStyle: PropTypes.shape({}),
  titleStyle: PropTypes.shape({}),
};

FancyError.defaultProps = {
  icon: 'error_outline',
  title: 'An unexpected error has occurred.',
  error: null,
  stringify: true,
  tabs: 2,
  containerStyle: {},
  contentStyle: {},
  titleStyle: {},
};

export default FancyError;
