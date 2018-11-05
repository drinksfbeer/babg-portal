import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fontAwesomeIcons } from '../../../../refs/refs';

const HeaderItem = ({
  toggled,
  toggleItem,
  setInactive,
  to,
  icon,
  title,
  active,
  additionalClass,
  style,
  activeStyle,
  exact,
  subItems,
}) => {
  if (!active) return null;

  const isFontAwesomeIcon = Array.isArray(icon) || fontAwesomeIcons.includes(icon);

  return (
    <li>
      <NavLink
        activeClassName="header-item-active"
        className={`header-item ${additionalClass}`}
        style={style || {}}
        activeStyle={activeStyle}
        onClick={() => {
          setInactive();
          toggleItem();
        }}
        to={to || '/'}
        exact={exact}
      >
        {
          isFontAwesomeIcon &&
          <FontAwesomeIcon
            icon={icon}
            style={{ marginLeft: '3px', marginRight: '8px' }}
          />
        }
        {
          !isFontAwesomeIcon &&
          <i className="material-icons">
            {icon}
          </i>
        }
        <span className="title">
          {title}
        </span>
      </NavLink>
      {
        (subItems && subItems.length > 0) &&
        <ul
          className={classNames({
            subItems: true,
            'toggled-open': toggled,
            'toggled-closed': !toggled,
          })}
        >
          {subItems && subItems.map((item) => {
            const isFontAwesomeIconSubItem = Array.isArray(item.icon) ||
              fontAwesomeIcons.includes(item.icon);
            return (
              <li key={item.to}>
                <NavLink
                  key={item.to}
                  className="sub-header-item"
                  to={item.to}
                  onClick={setInactive}
                  exact={item.exact}
                >
                  {
                    isFontAwesomeIconSubItem &&
                    <FontAwesomeIcon icon={item.icon} />
                  }
                  {
                    !isFontAwesomeIconSubItem &&
                    <i className="material-icons">
                      {item.icon}
                    </i>
                  }
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
        }
    </li>
  );
};

HeaderItem.propTypes = {
  setInactive: PropTypes.func.isRequired,
  toggled: PropTypes.bool,
  toggleItem: PropTypes.func,
  to: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string), // for FontAwesome
    PropTypes.string,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  active: PropTypes.bool,
  additionalClass: PropTypes.string,
  style: PropTypes.shape({}),
  activeStyle: PropTypes.shape({}),
  exact: PropTypes.bool,
  subItems: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]).isRequired,
    to: PropTypes.string.isRequired,
    exact: PropTypes.bool,
  })),
};

HeaderItem.defaultProps = {
  toggled: false,
  toggleItem: () => {},
  active: false,
  additionalClass: '',
  style: {},
  activeStyle: {},
  exact: false,
  subItems: [],
  to: '',
};

export default HeaderItem;
