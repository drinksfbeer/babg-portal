import React from 'react';
import PropTypes from 'prop-types';
import Sections from '../../../common/sections/index';

const PageDetails = ({ page }) => {
  if (!page) return null;
  return (
    <div
      className="app-item"
      style={{
        margin: '10px',
      }}
    >
      {page.sections && page.sections.map((section, i) => {
        const { component, ...sectionProps } = section;
        const Section = Sections[component];
        const SectionComponent = Section && Section.component;
        if (!SectionComponent) return null;

        return (
          <SectionComponent
            key={i} // eslint-disable-line
            {...sectionProps}
          />
        );
      })}
    </div>
  );
};

PageDetails.propTypes = {
  page: PropTypes.shape({
    sections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }),
};

PageDetails.defaultProps = {
  page: null,
};

export default PageDetails;
