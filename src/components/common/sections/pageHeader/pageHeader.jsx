import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../../../common/icon/icon';

const PageHeader = ({
  title,
  subtitle,
  icon,
  backgroundImageUrl,
  containerClass = '',
}) => (
  <section
    className={`pageHeader ${containerClass}`}
    style={{ background: `url('${backgroundImageUrl}')` }}
  >
    <div className="content">
      <div className="text">

        {icon &&
          <Icon
            icon={icon}
          />
        }
        <h2 className="title">{title}</h2>
        <h4 className="subtitle">{subtitle}</h4>
      </div>
    </div>
  </section>
);

PageHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  backgroundImageUrl: PropTypes.string,
  containerClass: PropTypes.string,
  icon: PropTypes.string,
};

PageHeader.defaultProps = {
  containerClass: '',
  icon: '',
  title: 'title',
  subtitle: '',
  backgroundImageUrl: 'https://via.placeholder.com/1200x800',
};

export default PageHeader;
