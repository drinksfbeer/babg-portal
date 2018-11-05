import React from 'react';
import PropTypes from 'prop-types';

const HeaderBuilder = ({
  pages,
}) => (
  <div>
    {pages.map(page => (
      <div
        key={page._id}
        className="app-item"
      >
        {page.name}
      </div>
    ))}
  </div>
);
HeaderBuilder.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
};
HeaderBuilder.defaultProps = {
  pages: [],
};
export default HeaderBuilder;
