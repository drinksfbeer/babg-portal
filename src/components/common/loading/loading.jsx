import React from 'react';
import PropTypes from 'prop-types';


const Loading = ({ inline }) => (
  <div
    style={{
      minHeight: inline ? undefined : '40vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <img alt="loading" src="https://i.imgur.com/zjM3rnQ.gif" width="40px" />
  </div>
);

Loading.propTypes = {
  inline: PropTypes.bool,
};
Loading.defaultProps = {
  inline: false,
};
export default Loading;
