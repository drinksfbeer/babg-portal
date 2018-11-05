import React from 'react';
import PropTypes from 'prop-types';

const FullWidthImage = ({
  backgroundImageUrl,
  containerClass = '',
  height,
}) => (
  <section className={`fullWidthImage ${containerClass}`} style={{ background: `url('${backgroundImageUrl}')`, height }} />
);
FullWidthImage.propTypes = {
  backgroundImageUrl: PropTypes.string,
  containerClass: PropTypes.string,
  height: PropTypes.string,
};

FullWidthImage.defaultProps = {
  backgroundImageUrl: 'https://via.placeholder.com/1200x800',
  containerClass: '',
  height: '20vh',
};

export default FullWidthImage;
