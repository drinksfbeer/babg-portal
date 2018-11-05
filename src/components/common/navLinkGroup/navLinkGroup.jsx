import React from 'react';
import PropTypes from 'prop-types';
import { matchPath, withRouter } from 'react-router-dom';

const NavLinkGroup = ({
  links,
  location: {
    pathname,
  },
  history: {
    replace,
  },
}) => (
  <div className="page-builder-nav" >
    {links.map((link) => {
      const isActive = matchPath(pathname, {
          path: link.to,
          exact: link.exact,
      });
      return (
        <div
          onClick={() => replace(link.to)}
          className={`nav-button ${isActive ? 'active' : ''}`}
          key={link.to}
        >
          <i
            className="material-icons"
            style={{
              marginRight: '10px',
            }}
          >
            {link.icon}
          </i>
          {link.title}
        </div>
      );
    })}
  </div>
);

NavLinkGroup.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    exact: PropTypes.bool,
  })).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

NavLinkGroup.defaultProps = {
};
export default withRouter(NavLinkGroup);
