import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from '../icon/icon';
import Button from '../button/button';

const NavBox = ({
  title,
  callToAction,
  to = '/',
  image,
  icon,
  containerClass,
}) => (
  <Link
    to={to}
    className={containerClass}
    style={{ backgroundImage: `url(${image})` }}
  >
    <div className="content flex text-center ">
      <div className="flex-item">
        <Icon icon={icon} />
      </div>
      <div className="flex-item">
        <h3 className="title">{title}</h3>
      </div>
      {callToAction &&
        <div className="flex-item">
          <Button
            title={callToAction}
            containerClass="white"
          />
        </div>
      }
    </div>
  </Link>
);

NavBox.propTypes = {
  title: PropTypes.string,
  callToAction: PropTypes.string,
  to: PropTypes.string,
  image: PropTypes.string,
  icon: PropTypes.string,
  containerClass: PropTypes.string,
};

NavBox.defaultProps = {
  title: '',
  callToAction: '',
  to: '/',
  image: '',
  icon: '',
  containerClass: '',
};

export default NavBox;
