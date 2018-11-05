import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';

import VisualBuilderForm from './visualBuilderForm';

const SectionBuilder = ({

  sectionsFromStore,
}) => {
  if (!sectionsFromStore) {
    console.warn('missing sections part'); // eslint-disable-line no-console
  }
  return (
    <div>
      <div
        style={{
          marginTop: '30px',
          borderBottom: 'solid rgba(0,0,0,0.2) 1px',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h4>Sections</h4>
        <button
          style={{
            backgroundColor: '#333',
            color: 'white',
            padding: '10px 45px',
            border: 'none',
            fontWeight: '800',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <i className="fas fa-save" style={{ marginRight: '5px' }} />
          <span>Save</span>
        </button>
      </div>
      <div>
        <FieldArray
          name="sections"
          component={VisualBuilderForm}
          sectionsFromStore={sectionsFromStore}
        />
      </div>
    </div>
  );
};

SectionBuilder.propTypes = {
  sectionsFromStore: PropTypes.arrayOf(PropTypes.shape({})),
  // changePageFormState: PropTypes.func.isRequired,
  // values: PropTypes.shape({}),
};

SectionBuilder.defaultProps = {
  sectionsFromStore: [],
  // values: {},
};

export default SectionBuilder;
