import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';

import {
  TextField,
  TextAreaField,
  ToggleField,
  FileStackField,
  IconPickerField,
} from '../../../common/form/inputs/index';
import { normalizeSlug } from '../../../common/form/normalizers/index';
import { required } from '../../../common/form/validations/index';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';

const GeneralInfo = ({ activeOnHeader, activeChapter }) => (
  <div className="grid-container fluid">
    <div className="grid-x grid-margin-x grid-margin-y">

      <AdminFormHeaderItem
        title="Basic Information"
        materialIcon="info"
      />

      <Field
        name="name"
        label="Name (for internal reference)"
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

      <AdminFormHeaderItem
        title="Header Presence"
        materialIcon="description"
      />
      <Field
        containerClass="cell"
        name="activeOnHeader"
        label="Active On Header"
        component={ToggleField}
      />

      {activeOnHeader && [
        <Field
          name="headerTitle"
          label="Header Title"
          containerClass="item size-6"
          placeholder="About"
          component={TextField}
          validate={[required]}
          key="header-title"
        />,
        <Field
          name="headerIcon"
          label="Header Icon (font awesome)"
          containerClass="item size-6"
          placeholder="example: star"
          component={IconPickerField}
          key="header-icon"
          validate={[required]}
        />,
      ]}
    </div>
    <div className="grid-x grid-margin-y grid-padding-y">
      <AdminFormHeaderItem
        title="Meta Information"
        materialIcon="feedback"
      />
    </div>
    <div className="grid-x grid-padding-x grid-padding-y">
      <div className="cell large-8 medium-8">
        <Field
          name="metaTitle"
          label="Meta Title"
          component={TextField}
        />
        <Field
          name="metaDescription"
          label="Meta Description"
          component={TextAreaField}
        />
      </div>
      <div className="cell large-4 medium-4">
        <Field
          name="metaImage"
          label="Meta Image"
          component={FileStackField}
        />
      </div>
    </div>
  </div>
);
GeneralInfo.propTypes = {
  activeOnHeader: PropTypes.bool,
  activeChapter: PropTypes.shape({}),
};

GeneralInfo.defaultProps = {
  activeOnHeader: false,
  activeChapter: undefined,
};
export default GeneralInfo;
