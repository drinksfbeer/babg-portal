import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import CallOut from '../../callOut/callOut';

const CallOutWithImage = ({
  backgroundImage,
  bodyText,
  title,
  positionSelect,
  icon,
  buttonLink,
  buttonText,
  minHeight,
}) => (
  <section
    className={classNames({
      callOutWithImage: true,
      minHeight,
    })}
    style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImage})`,
      minHeight,
    }}
  >
    <div className="container">
      <div className="gridz">
        <div
          className={`span size-6 ${positionSelect === 'right' ? 'push' : ''} ${positionSelect === 'center' ? 'centered' : ''}`}
        >
          <CallOut
            icon={icon}
            subtitle={bodyText}
            title={title}
            buttonLink={buttonLink}
            buttonText={buttonText}
          />
        </div>
      </div>
    </div>
  </section>
);

CallOutWithImage.propTypes = {
  minHeight: PropTypes.string,
  backgroundImage: PropTypes.string,
  bodyText: PropTypes.string,
  title: PropTypes.string,
  positionSelect: PropTypes.string,
  buttonLink: PropTypes.string,
  buttonText: PropTypes.string,
  icon: PropTypes.string,
};

CallOutWithImage.defaultProps = {
  bodyText: 'Body Text',
  title: 'Title',
  backgroundImage: 'https://via.placeholder.com/1200',
  positionSelect: 'left',
  buttonLink: '/',
  buttonText: '',
  icon: '',
  minHeight: '',
};
export default CallOutWithImage;
