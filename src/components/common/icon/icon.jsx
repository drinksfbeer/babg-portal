import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Icon = ({
  icon,
  iconSize,
}) => {
  // even though `icon` is required (according to the `propTypes`), no error will be
  // thrown by `PropTypes` if an empty string is passed in, but `FontAwesomeIcon` will!
  if (!icon) return null;

  return (
    <FontAwesomeIcon icon={icon} size={iconSize} />
  );
};


Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  iconSize: PropTypes.string,
};

Icon.defaultProps = {
  iconSize: '1x',
};

export default Icon;
