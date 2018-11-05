import { Field } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import {
  TextField,
  DefaultField,
  SelectField,
  FileStackField,
  TextAreaField,
} from '../../../common/form/inputs/index';
import { required } from '../../../common/form/validations/index';
import { licenseTypes } from '../../../../refs/refs';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';
import FormContainer from '../../../common/form/formContainer';

const MembersForm = ({
  member,
  chapter,
  chapters,
  isAdmin,
}) => (
  <FormContainer
    form="members"
    record={member}
    submit={(results, actions, notifications) => {
      if (member) {
        const trimmedResults = results;
        if (results.uuid === member.uuid) {
          delete trimmedResults.uuid;
        }
        if (results.name === member.name) {
          delete trimmedResults.name;
        }
        actions.crudAction({
          type: 'put',
          resource: 'members',
        }, {
          _id: member._id,
          changes: trimmedResults,
        }, (err, modifiedMember) => {
          if (!err && modifiedMember) {
            notifications.success('Successfully Updated Member');
            actions.history.push(`/member/${modifiedMember._id}`);
          } else {
            notifications.error('Error Occurred Updating Member');
          }
        });
      } else {
        actions.crudAction({
          type: 'post',
          resource: 'members',
        }, {
          pkg: results,
        }, (err, newMember) => {
          if (!err && newMember) {
            notifications.success('Successfully Created Member');
            actions.history.push(`/member/${newMember._id}`);
          } else {
            notifications.error('Error Occurred Updating Member');
          }
        });
      }
    }}
    renderProps={() => (
      <div className="grid-x grid-padding-x grid-margin-x grid-margin-y">


        <div className="cell">
          <div className="grid-x grid-padding-x">

            <AdminFormHeaderItem
              title="Basic Information"
              materialIcon="info"
            />

            <div className="cell large-6">
              {isAdmin && (chapter ? (
                <Field
                  name="chapterUuid"
                  component={DefaultField}
                  defaultValue={chapter.uuid}
                  validate={[required]}
                />
              ) : (
                <Field
                  component={SelectField}
                  options={chapters.map(chap => ({
                    value: chap.uuid,
                    title: chap.name,
                  }))}
                  name="chapterUuid"
                  label="choose a chapter*"
                  validate={[required]}
                />
              ))}
              <Field
                name="name"
                component={TextField}
                placeholder="name"
                label="Name*"
                validate={[required]}
              />
              <Field
                name="tagline"
                component={TextField}
                placeholder="tagline"
                label="Tagline"
              />
              <Field
                name="description"
                component={TextAreaField}
                placeholder="description"
                label="Description"
              />
              <Field
                name="licenseCode"
                component={SelectField}
                placeholder="select a license type"
                label="License Type"
                options={licenseTypes.map(license => ({
                  value: license.value,
              title: `${license.value} – ${license.label}`,
                }))}
              />
            </div>
            <div className="cell large-6">
              <Field
                name="image"
                component={FileStackField}
                label="Logo Image*"
                validate={[required]}
                description="800 x 800px minimum. File types jpg - png. Circle logo recommended, clipped out on a transparent png"
                options={{
                  imageMax: [1600, 1600],
                  imageMin: [800, 800],
                  transformations: {
                    crop: {
                      aspectRatio: 1,
                      force: true,
                    },
                  },
                }}
              />
            </div>

          </div>
        </div>

        <AdminFormHeaderItem
          title="Social Links"
          materialIcon="mood"
        />
        <div className="cell">
          <div className="grid-x grid-padding-x large-up-3">
            <Field
              name="website"
              component={TextField}
              placeholder="website url"
              label="Website"
              classContainer=""
            />
            <Field
              name="email"
              component={TextField}
              placeholder="email address"
              label="Email"
            />
            <Field
              name="facebook"
              component={TextField}
              placeholder="facebook url"
              label="Facebook"
            />
            <Field
              name="twitter"
              component={TextField}
              placeholder="twitter url"
              label="Twitter"
            />
            <Field
              name="instagram"
              component={TextField}
              placeholder="instagram url"
              label="Instagram"
            />
          </div>
        </div>

        <AdminFormHeaderItem
          title="Media Assets"
          materialIcon="insert_photo"
        />
        <div className="cell large-6">
          <Field
            name="video"
            component={TextField}
            placeholder="Video URL (youtube/vimeo/mp4 link)"
            label="Member Video"
          />
        </div>
        <div className="cell large-6">
          <Field
            name="bannerImage"
            component={FileStackField}
            label="Banner Image"
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
          title="Additional Facts"
          materialIcon="assignment"
        />
        <div className="cell">
          <div className="grid-x grid-padding-x large-up-3">
            <Field
              name="foundingDate"
              component={TextField}
              placeholder="ex: 1998"
              label="Founding Date"
            />
            <Field
              name="annualBarrelage"
              component={TextField}
              placeholder="400 bbls"
              label="Annual Barrelage"
            />
            <Field
              name="Founders"
              component={TextField}
              placeholder="ex: George Washington, Benjamin Franklin"
              label="Founders"
            />
          </div>
        </div>
        <div className="cell">
          <button className="button">Submit</button>
        </div>
      </div>
    )}
  />
);

MembersForm.propTypes = {
  member: PropTypes.shape({
    chapterUuid: PropTypes.string,
  }),
  chapter: PropTypes.shape({}),
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  isAdmin: PropTypes.bool,
};

MembersForm.defaultProps = {
  member: null,
  chapter: null,
  chapters: [],
  isAdmin: false,
};

export default connect(
  state => ({
    chapters: state.chapters.list._list,
  }),
  null,
  null,
  { pure: false },
)(MembersForm);
