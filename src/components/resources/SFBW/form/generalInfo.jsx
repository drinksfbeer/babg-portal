import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';

import {
  TextField,
  TextAreaField,
  ToggleField,
  FileStackField,
} from '../../../common/form/inputs/index';
import { normalizeSlug } from '../../../common/form/normalizers/index';
import { required } from '../../../common/form/validations/index';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';

const GeneralInfo = ({ isASubPage }) => (
  <div className="grid-container fluid">
    <div className="grid-x grid-margin-x grid-margin-y">

      <AdminFormHeaderItem
        title="Basic Information"
        materialIcon="info"
      />

      <Field
        name="mainPageName"
        label="Main Navbar Title"
        containerClass="item cell large-6"
        placeholder="Header Name"
        component={TextField}
        validate={[required]}
        key="header-name"
      />
      <Field
        name="mainPageSlug"
        label="Main Page Slug (url it will be at - write 'home' for homepage)"
        component={TextField}
        normalize={normalizeSlug}
        validate={[required]}
        containerClass="item cell large-6"
      />

      <Field
        containerClass="cell large-12"
        name="isASubPage"
        label="Sub Page of Main a Header Item"
        component={ToggleField}
      />

      {isASubPage && [
        <Field
          name="subPageName"
          label="Name For Sub Header and Sub Navbar Title"
          component={TextField}
          containerClass="item cell large-6"
        />,
        <Field
          name="subPageSlug"
          label="Sub Page Slug"
          component={TextField}
          normalize={normalizeSlug}
          containerClass="item cell large-6"
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
  isASubPage: PropTypes.bool,
};

GeneralInfo.defaultProps = {
  isASubPage: false,
};
export default GeneralInfo;
