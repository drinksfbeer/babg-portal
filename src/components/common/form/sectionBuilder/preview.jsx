import React from 'react';
import Sections from '../../sections/index';

const Preview = ({ sectionsFromStore }) => {
  if (!sectionsFromStore) return null;
  return (sectionsFromStore.map((section, i) => {
    const { component, ...sectionProps } = section;
    const Section = Sections[component];
    const SectionComponent = Section && (Section.displayComponent || Section.component);
    if (!SectionComponent) return null;

    return (
      <SectionComponent
        key={i} // eslint-disable-line
        {...sectionProps}
      />
    );
  }));
};

export default Preview;
