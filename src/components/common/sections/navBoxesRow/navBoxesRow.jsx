import React from 'react';
import PropTypes from 'prop-types';
import NavBox from '../../navBoxes/navBox';


const NavBoxesRow = ({
  backgroundImage1,
  icon1,
  title1,
  callToAction1,
  link1,
  backgroundImage2,
  icon2,
  title2,
  callToAction2,
  link2,
  backgroundImage3,
  icon3,
  title3,
  callToAction3,
  link3,
  toggle1,
  toggle2,
  toggle3,
}) => (
  <section className="nav-boxes">

    <div className="container">
      <div
        className="gridz"
      >
        {backgroundImage1 && !toggle1 &&
          <NavBox
            containerClass="nav-box item size-4"
            image={backgroundImage1}
            title={title1}
            callToAction={callToAction1}
            icon={icon1}
            to={link1}
          />}

        {backgroundImage2 && !toggle2 &&
          <NavBox
            containerClass="nav-box item size-4"
            image={backgroundImage2}
            title={title2}
            callToAction={callToAction2}
            icon={icon2}
            to={link2}
          />}

        {backgroundImage3 && !toggle3 &&
          <NavBox
            containerClass="nav-box item size-4"
            image={backgroundImage3}
            title={title3}
            callToAction={callToAction3}
            icon={icon3}
            to={link3}
          />}
      </div>
    </div>
  </section>
);

NavBoxesRow.propTypes = {
  backgroundImage1: PropTypes.string,
  icon1: PropTypes.string,
  title1: PropTypes.string,
  callToAction1: PropTypes.string,
  backgroundImage2: PropTypes.string,
  icon2: PropTypes.string,
  title2: PropTypes.string,
  callToAction2: PropTypes.string,
  backgroundImage3: PropTypes.string,
  icon3: PropTypes.string,
  title3: PropTypes.string,
  callToAction3: PropTypes.string,
  toggle1: PropTypes.bool,
  toggle2: PropTypes.bool,
  toggle3: PropTypes.bool,
  link1: PropTypes.string,
  link2: PropTypes.string,
  link3: PropTypes.string,
};

NavBoxesRow.defaultProps = {
  backgroundImage1: 'https://via.placeholder.com/1200',
  icon1: 'beer',
  title1: 'Title',
  callToAction1: 'GO HERE',
  backgroundImage2: 'https://via.placeholder.com/1200',
  icon2: 'beer',
  title2: 'Title',
  callToAction2: 'SEE THIS',
  backgroundImage3: 'https://via.placeholder.com/1200',
  icon3: 'beer',
  title3: 'Title',
  callToAction3: 'DO THAT',
  toggle1: false,
  toggle2: false,
  toggle3: false,
  link1: '/',
  link2: '/',
  link3: '/',
};

export default NavBoxesRow;
