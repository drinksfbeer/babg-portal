import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fontAwesomeIcons } from '../../../refs/refs';

const SectionHeader = ({
  title,
  icon,
  sections,
  history,
  replaceHistory,
  location: { pathname },
}) => {
  const isFontAwesomeIcon = Array.isArray(icon) || fontAwesomeIcons.includes(icon);

  return (
    <section className="sectionHeader">
      <div
        className="top"
        // style={{ backgroundColor: `${currentChapter.color}` }}
      >
        {
          isFontAwesomeIcon &&
          <FontAwesomeIcon
            icon={icon}
            style={{ marginRight: '10px' }}
          />
        }
        {
          !isFontAwesomeIcon &&
          <i className="material-icons">
            {icon}
          </i>
        }
        <strong>
          {title}
        </strong>
      </div>
      {sections.length > 0 &&
        <div className="bottom">
          {sections
            .filter(section => !section.inactive)
            .map(section =>
              ((section.title === 'Back' || replaceHistory) ? (
                <div
                  className={`navLink ${pathname === section.to ? 'active' : ''}`}
                  key={section.title}
                  onClick={() => (section.title === 'Back' ? history.goBack() : history.replace(section.to))}
                  style={{
                    color: section.color,
                  }}
                >
                  <i className="material-icons">
                    {section.icon}
                  </i>
                  <strong>
                    {section.title}
                  </strong>
                </div>
              ) : (
                <NavLink
                  className="navLink"
                  exact={section.exact}
                  activeClassName="active"
                  to={section.to || '/'}
                  key={section.title}
                  style={{
                    color: section.color,
                  }}
                >
                  <i className="material-icons">
                    {section.icon}
                  </i>
                  <strong>
                    {section.title}
                  </strong>
                </NavLink>
              )
              ))
          }
        </div>
      }
    </section>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  sections: PropTypes.arrayOf(PropTypes.shape({
    inactive: PropTypes.bool,
    to: PropTypes.string,
    color: PropTypes.string,
    title: PropTypes.string.isRequired,
    exact: PropTypes.bool,
  })),
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  replaceHistory: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

SectionHeader.defaultProps = {
  icon: '',
  replaceHistory: false,
  location: {
    pathname: '',
  },
  sections: [],
};

export default withRouter(SectionHeader);
