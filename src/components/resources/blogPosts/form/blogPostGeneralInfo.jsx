import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';

import {
  TextField,
  TextAreaField,
  FileStackField,
} from '../../../common/form/inputs/index';
import { normalizeSlug } from '../../../common/form/normalizers/index';
import { required } from '../../../common/form/validations/index';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';

const GeneralInfo = ({ activeChapter }) => (
  <div className="grid-container fluid">
    <div className="grid-x grid-margin-x grid-margin-y">

      <AdminFormHeaderItem
        title="Basic Information"
        materialIcon="info"
      />

      <Field
        name="name"
        label="Name"
        component={TextField}
        validate={[required]}
        containerClass="item cell large-6"
      />
      <Field
        name="slug"
        label="Slug (url it will be at - write 'home' for homepage)"
        component={TextField}
        normalize={normalizeSlug}
        validate={[required]}
        containerClass="item cell large-6"
      />
      {activeChapter &&
        <div className="cell">
          <b>Active on {activeChapter.name} Chapter Site</b>
        </div>
      }
    </div>

    <AdminFormHeaderItem
      title="Post Information"
    />
    <div className="grid-x grid-padding-x grid-padding-y">
      <div className="cell large-8 medium-8">
        <Field
          name="tags"
          label="Tags(Comma Separated)"
          component={TextField}
        />
        <Field
          name="description"
          label="Description"
          component={TextAreaField}
        />
      </div>
      <div className="cell large-4 medium-4">
        <Field
          name="image"
          label="Image"
          component={FileStackField}
        />
      </div>
    </div>
  </div>
);
GeneralInfo.propTypes = {
  activeChapter: PropTypes.shape({}),
};

GeneralInfo.defaultProps = {
  activeChapter: undefined,
};
export default GeneralInfo;
