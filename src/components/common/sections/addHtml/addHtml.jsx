import React from 'react';
import PropTypes from 'prop-types';

const addHtml = ({
  input,
}) => (
  <div dangerouslySetInnerHTML={{ __html: `${input}` }} /> // eslint-disable-line
);

addHtml.propTypes = {
  input: PropTypes.string,
};

addHtml.defaultProps = {
  input: '',
};


export default addHtml;
