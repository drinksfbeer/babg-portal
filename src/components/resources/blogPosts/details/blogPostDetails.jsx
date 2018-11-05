import React from 'react';
import PropTypes from 'prop-types';
import Sections from '../../../common/sections/index';

const BlogPostDetails = ({ blogPost }) => {
  if (!blogPost) return null;
  return (
    <div
      className="app-item"
      style={{
        margin: '10px',
      }}
    >
      {blogPost.sections && blogPost.sections.map((section, i) => {
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

BlogPostDetails.propTypes = {
  blogPost: PropTypes.shape({
    sections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }),
};

BlogPostDetails.defaultProps = {
  blogPost: null,
};

export default BlogPostDetails;
