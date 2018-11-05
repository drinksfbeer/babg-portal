import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from '../icon/icon';


const Button = ({
  title,
  to,
  href,
  icon,
  containerClass = '',
  onClick,
}) => {
  const body = (
    <div className="button__inner">
      {to &&
        <Link
          to={to}
        >
          {icon &&
            <Icon icon={icon} />
          }
          <span>{title}</span>
        </Link>
      }
      {href &&
        <a
          href={href}
          alt={title}
          target="_blank"
          rel="noopener noreferrer"
        >
          {icon &&
            <Icon icon={icon} />
          }
          <span>{title}</span>
        </a>
      }

    </div>
  );
  if (to) {
    return (
      <button
        title={title}
        aria-label={title}
        className={`button ${containerClass}`}
        alt={title}
      >
        {body}
      </button>
    );
  }
  if (href) {
    return (
      <button
        className={`button ${containerClass}`}
        title={title}
        aria-label={title}
        alt={title}
      >
        {body}
      </button>
    );
  }
  return (
    <button
      className={`button no-link ${containerClass}`}
      onClick={onClick}
    >
      <div className="inside">
        {icon &&
          <Icon icon={icon} />
        }
        <span>{title}</span>
      </div>
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string,
  icon: PropTypes.string,
  containerClass: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  icon: '',
  containerClass: '',
  to: '',
  href: '',
  onClick: () => {},
};

export default Button;
