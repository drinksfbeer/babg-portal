import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Button from '../button/button';
import Icon from '../icon/icon';

const CallOut = ({
  icon,
  iconSize,
  iconTheme,
  subtitle,
  title,
  buttonLink,
  buttonIcon,
  buttonText,
  horizontal,
  left,
  right,
}) => (

  <div className={classNames({
    callOut: true,
    horizontal,
    left,
     right,
  })}
  >
    <div className="top">
      {icon &&
        <Icon icon={icon} theme={iconTheme} iconSize={iconSize} />
      }
      <div className="title h3">
        {title}
      </div>
      {subtitle &&
        <div className="subtitle h5">
          {subtitle}
        </div>
      }
    </div>
    {buttonLink && buttonText &&
      <Button
        to={buttonLink}
        icon={buttonIcon}
        title={buttonText}
      />
    }
  </div>

);

CallOut.propTypes = {
  icon: PropTypes.string,
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  buttonLink: PropTypes.string,
  buttonIcon: PropTypes.string,
  buttonText: PropTypes.string,
  horizontal: PropTypes.bool,
  left: PropTypes.bool,
  right: PropTypes.bool,
  iconTheme: PropTypes.string,
  iconSize: PropTypes.string,

};

CallOut.defaultProps = {
  icon: '',
  buttonLink: '',
  buttonIcon: '',
  buttonText: '',
  horizontal: false,
  left: false,
  right: false,
  iconTheme: 'fa',
  iconSize: 'lg',
};

export default CallOut;
