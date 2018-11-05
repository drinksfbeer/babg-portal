import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import CallOut from '../../callOut/callOut';

const TextWithImage = ({
  image,
  flipped,
  stacked,
  icon,
  iconTheme,
  iconSize,
  subtitle,
  title,
  buttonLink,
  buttonText,
  hexCode,
}) => (
  <section
    className={classNames({
      textWithImage: true,
      flipped,
      stacked,
    })}
    style={{
      backgroundColor: hexCode || '',
    }}
  >
    <div className="container">
      <div className="gridz">
        <div className="span size-6 flex align-center justify-center ">

          <CallOut
            icon={icon}
            subtitle={subtitle}
            title={title}
            buttonLink={buttonLink}
            buttonText={buttonText}
            iconTheme={iconTheme}
            iconSize={iconSize}
          />
        </div>
        <div className="span size-6">
          {buttonLink ?
            <Link to={buttonLink} className="text-image"><img src={image} alt={title} /></Link> :
            <img src={image} alt={title} />
          }
        </div>
      </div>
    </div>
  </section>
);

TextWithImage.propTypes = {
  image: PropTypes.string,
  flipped: PropTypes.bool,
  stacked: PropTypes.bool,
  icon: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  buttonLink: PropTypes.string,
  buttonText: PropTypes.string,
  iconTheme: PropTypes.string,
  iconSize: PropTypes.string,
  hexCode: PropTypes.string,
};

TextWithImage.defaultProps = {
  flipped: false,
  stacked: false,
  image: 'https://via.placeholder.com/1200',
  buttonLink: '#',
  buttonText: 'Button',
  icon: 'beer',
  subtitle: 'Subtitle',
  title: 'Title',
  iconTheme: 'fa',
  iconSize: '2x',
  hexCode: '',
};


export default TextWithImage;
