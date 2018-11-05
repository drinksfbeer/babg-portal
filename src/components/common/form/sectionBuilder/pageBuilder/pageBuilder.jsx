import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';

import PageBuilderForm from './pageBuilderForm';

const PageBuilder = ({
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
        <button className="button">
          <i className="fas fa-save" style={{ marginRight: '5px' }} />
          <span>Save</span>
        </button>
      </div>
      <div>
        <FieldArray
          name="sections"
          component={PageBuilderForm}
          sectionsFromStore={sectionsFromStore}
        />
      </div>
    </div>
  );
};

PageBuilder.propTypes = {
  sectionsFromStore: PropTypes.arrayOf(PropTypes.shape({})),
  // changePageFormState: PropTypes.func.isRequired,
  // values: PropTypes.shape({}),
};

PageBuilder.defaultProps = {
  sectionsFromStore: [],
  // values: {},
};

export default PageBuilder;
