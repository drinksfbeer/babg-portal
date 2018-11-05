import React from 'react';
import PropTypes from 'prop-types';
// import { Field } from 'redux-form';
import formBuilderFields from './formBuilderFields';

const FormPreview = ({
  values,
}) => {
  const { sections = [] } = values;

  // empty sections message
  if (sections.length === 0) {
    return (
      <div className="section-item text-center">
        No Sections Yet
      </div>
    );
  }
  return (
    <div className="grid-x grid-padding-x grid-padding-y">
      <div className="cell">
        {sections.map((section, index) => {
          const { fieldType, question, ...additionalProps } = section;
          const foundField = formBuilderFields.find(field => field.name === fieldType);
          const isSectionHeader = fieldType === 'Section Header';
          if (!foundField && !isSectionHeader) {
                console.warn('Invalid section provided to form preview'); // eslint-disable-line
            return null;
          }
          const FieldComponent = foundField && foundField.component;
          if (!question) return null;
          return (
            <div
              key={index} // eslint-disable-line
            >
              {FieldComponent ? (
                <FieldComponent
                  input={{
                    value: '',
                    onChange: () => {},
                  }}
                  label={question}
                  {...additionalProps}
                  options={(additionalProps.options || '')
                    .split(',')
                    .map(option => ({
                      value: option,
                      title: option,
                    }))
                  }
                />
                  ) : (
                    <div className="section-item">
                      {question}
                    </div>
                  )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
FormPreview.propTypes = {
  values: PropTypes.shape({}),
};
FormPreview.defaultProps = {
  values: {},
};

export default FormPreview;
