import PropTypes from 'prop-types';
import React from 'react';
import Button from '../../button/button';

const HeroBanner = ({
  title,
  subtitle,
  buttonTitle1,
  buttonLink1 = '/',
  buttonIcon1,
  buttonTitle2,
  buttonLink2 = '/',
  buttonIcon2,
  backgroundImage,
  containerClass = '',
  minHeight,
  description,
}) => (
  <section
    className={`hero-banner ${containerClass}`}
    style={{
      background: `url('${backgroundImage}')`,
      minHeight,
    }}
  >
    <div className="content">
      <div className="text">

        {!title ?
          <h2 className="title">Title</h2> : <h2 className="title">{title}</h2>
        }
        {!subtitle ?
          <h4 className="sub-title">Subtitle</h4> : <h4 className="sub-title">{subtitle}</h4>
        }

        {description &&
          <p className="description">{description}</p>
        }
      </div>
      <div className="buttons">
        <div className="button-group text-center stacked-for-small align-center">
          {buttonLink1 &&
            <Button
              to={buttonLink1}
              icon={buttonIcon1}
              title={buttonTitle1}
              containerClass="white"
            />
          }
          {buttonLink2 &&
            <Button
              to={buttonLink2}
              icon={buttonIcon2}
              title={buttonTitle2}
              containerClass="white"
            />
          }
        </div>
      </div>
    </div>
  </section>
);
HeroBanner.propTypes = {
  minHeight: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  buttonTitle1: PropTypes.string,
  buttonLink1: PropTypes.string,
  buttonIcon1: PropTypes.string,
  buttonTitle2: PropTypes.string,
  buttonLink2: PropTypes.string,
  buttonIcon2: PropTypes.string,
  backgroundImage: PropTypes.string.isRequired,
  containerClass: PropTypes.string,
  description: PropTypes.string,
};

HeroBanner.defaultProps = {
  buttonTitle1: 'Button',
  buttonLink1: '/',
  buttonIcon1: 'beer',
  buttonTitle2: 'Button',
  buttonLink2: '/',
  buttonIcon2: 'beer',
  containerClass: '',
  minHeight: '50vh',
  description: 'Description',
};

export default HeroBanner;
