import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icon from '../../../common/icon/icon';

const AdminFormHeaderItem = ({
  containerStyle,
  title,
  titleStyle,
  description,
  descriptionStyle,
  containerClass,
  onClick,
  icon,
  materialIcon,
  fontAwesomeIcon,
}) => (

  <div className={`cell ${containerClass}`} style={containerStyle}>
    <header className="field-header">
      <h4 style={titleStyle}>
        {
          materialIcon &&
          <i className="material-icons">
            {materialIcon}
          </i>
        }
        {
          fontAwesomeIcon &&
          <FontAwesomeIcon
            icon={fontAwesomeIcon}
          />
        }
        <span>
          {title}
        </span>
      </h4>
      {
        description &&
        <span className="description" style={descriptionStyle}>
          <FontAwesomeIcon
            icon="info-circle"
          />
          {description}
        </span>
      }
      {icon && onClick ? (
        <span className="icon-click" onClick={onClick}>
          <Icon icon={icon} />
        </span>
      ) : (
        <Icon icon={icon} />
      )}
    </header>
  </div>

);

AdminFormHeaderItem.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.string,
  materialIcon: PropTypes.string,
  fontAwesomeIcon: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  containerClass: PropTypes.string,
  containerStyle: PropTypes.shape({}),
  title: PropTypes.string.isRequired,
  titleStyle: PropTypes.shape({}),
  description: PropTypes.string,
  descriptionStyle: PropTypes.shape({}),
};

AdminFormHeaderItem.defaultProps = {
  onClick: () => {},
  icon: '',
  materialIcon: '',
  fontAwesomeIcon: '',
  containerClass: '',
  containerStyle: {},
  titleStyle: {},
  description: null,
  descriptionStyle: {},
};
export default AdminFormHeaderItem;
