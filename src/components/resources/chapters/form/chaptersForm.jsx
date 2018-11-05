import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';

import { TextField, FileStackField, IconPickerField } from '../../../common/form/inputs/index';
import { required } from '../../../common/form/validations/index';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';
import FormContainer from '../../../common/form/formContainer';

const ChaptersForm = ({ chapter }) => (
  <FormContainer
    record={chapter}
    submit={(results, actions, notifications) => {
      if (chapter) {
        const { _id, ...trimmedResults } = results;
        if (results.uuid === chapter.uuid) {
          delete trimmedResults.uuid;
        }
        if (results.name === chapter.name) {
          delete trimmedResults.name;
        }
        if (results.slug === chapter.slug) {
          delete trimmedResults.slug;
        }
        // this was done so as not to throw mongoose duplicate error
        // find a way to get rid of duplicates to reduce redundancies
        actions.crudAction({
          type: 'put',
          resource: 'chapters',
        }, {
          _id: chapter._id,
          changes: trimmedResults,
        }, (err, updatedChapter) => {
          if (err) {
            notifications.error('Error Occurred Updating Chapter');
          } else {
            notifications.success('Successfully Updated Chapter');
            actions.history.push(`/chapters/${updatedChapter.slug}`);
          }
        });
      } else {
        actions.crudAction({
          type: 'post',
          resource: 'chapters',
        }, {
          pkg: results,
        }, (err, newChapter) => {
          if (!err && newChapter) {
            notifications.success('Successfully Created Chapter');
            actions.history.push(`/chapters/${newChapter.slug}`);
          } else {
            notifications.error('Error Occurred Creating Chapter');
          }
        });
      }
    }}
    renderProps={() => (
      <div className="grid-x grid-padding-x grid-padding-y">
        <AdminFormHeaderItem
          title="New Chapter Info"
          materialIcon="info"
        />
        <div className="cell large-6 medium-6">
          <Field
            name="name"
            component={TextField}
            type="text"
            placeholder="ex: South Bay"
            label="name"
          />
          <Field
            name="slug"
            component={TextField}
            type="text"
            placeholder="ex: san-fran"
            label="slug"
            validate={[required]}
          />
          <Field
            name="subdomain"
            component={TextField}
            type="text"
            placeholder="subdomain"
            label="subdomain"
          />
        </div>
        <div className="cell large-6 medium-6">
          <Field
            name="image"
            component={FileStackField}
            type="text"
            placeholder="ex: https://via.placeholder.com/400x400"
            label="image"
            options={{
              imageMax: [1600, 800],
              imageMin: [1000, 500],
              transformations: {
                crop: {
                  aspectRatio: 2,
                  force: true,
                },
              },
            }}
          />
        </div>

        <AdminFormHeaderItem
          title="Styling"
          materialIcon="brush"
        />

        <Field
          name="color"
          component={TextField}
          type="text"
          placeholder="#6363ef"
          label="Chapter Color"
          containerClass="cell large-6"
        />

        <Field
          name="icon"
          component={IconPickerField}
          type="text"
          placeholder="anchor"
          label="Chapter Icon"
          containerClass="cell large-6"
        />

        <div className="cell">
          <button className="button">Submit</button>
        </div>
      </div>
    )}
  />
);

ChaptersForm.propTypes = {
  chapter: PropTypes.shape({}),
};

ChaptersForm.defaultProps = {
  chapter: null,
};

export default ChaptersForm;
