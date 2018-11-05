import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import classNames from 'classnames';

import {
  TextField,
  TextAreaField,
  SelectField,
  FileStackField,
} from '../../../common/form/inputs';
import FormContainer from '../../../common/form/formContainer';
import { required } from '../../../../helpers/validations';

// announcement visibility options
const audienceOptions = {
  master: [
    {
      value: 'members-all',
      title: 'All Members from Every Chapter',
    },
    {
      value: 'members-specific',
      title: 'Only Members from a Specific Chapter',
    },
    {
      value: 'enthusiasts-all',
      title: 'All Enthusiasts from Every Chapter',
    },
    {
      value: 'enthusiasts-specific',
      title: 'Only Enthusiasts from a Specific Chapter',
    },
  ],
  chapter: [
    {
      value: 'members',
      title: 'All Members in This Chapter',
    },
    {
      value: 'enthusiasts',
      title: 'All Enthusiasts in This Chapter',
    },
  ],
};

const AnnouncementsForm = ({
  form,
  announcement,
  chapters,
  chapter,
  role,
  onSuccess, // callback when `crudAction` is successful (no-op is default)
}) => {
  const parsedAnnouncement = announcement ? JSON.parse(JSON.stringify(announcement)) : null;

  // when editing a previously existing announcement as a master admin, we need to change
  // the `audience` value back with either '-all` or '-specific' appended at the end
  // (since it was removed when posting to the db)
  if (role === 'master' && parsedAnnouncement) {
    const { audience, chapterUuid } = parsedAnnouncement;

    // turns out this renders a couple times, so in order to prevent `audience` from having
    // a value like 'members-all-all-all-all', we check if it exists (hence the `indexOf`)
    if (audience && chapterUuid && audience.indexOf('-specific') < 0) {
      parsedAnnouncement.audience = `${audience}-specific`;
    } else if (audience && !chapterUuid && audience.indexOf('-all') < 0) {
      parsedAnnouncement.audience = `${audience}-all`;
    }
  }

  return (
    <FormContainer
      form={form}
      record={parsedAnnouncement}
      submit={(results, actions, notifications) => {
        const parsedResults = JSON.parse(JSON.stringify(results)); // deep-copy
        const notSpecificAudience = parsedResults.audience.indexOf('-specific') < 0;
        parsedResults.audience = parsedResults.audience
          .split('-all')
          .join('')
          .split('-specific')
          .join('');

        // if the user is a master admin and set the visibility to all members or enthusiasts,
        // remove the `chapterUuid` key (doesn't hurt if it wasn't set in the first place either)
        if (role === 'master' && notSpecificAudience) {
          parsedResults.chapterUuid = '';
        }

        // if the user is a chapter admin, insert their chapter's `uuid` into the payload
        if (role === 'chapter') {
          parsedResults.chapterUuid = chapter.uuid || '';
        }

        if (announcement) { // update previously existing anonuncement
          actions.crudAction({
            type: 'put',
            resource: 'announcements',
          }, {
            _id: announcement._id,
            changes: parsedResults,
          }, (error, newAnnouncement) => {
            if (!error && newAnnouncement) {
              onSuccess();
              notifications.success('Announcement Updated Successfully!');
            } else {
              notifications.error('Error Occurred Updating Announcement');
            }
          });
        } else { // create new announcement
          actions.crudAction({
            type: 'post',
            resource: 'announcements',
          }, {
            pkg: parsedResults,
          }, (error, newAnnouncement) => {
            if (!error && newAnnouncement) {
              onSuccess();
              actions.clearForm();
              notifications.success('Announcement Posted Successfully!');
            } else {
              notifications.error('Error Occurred Posting Announcement');
            }
          });
        }
      }}
      renderProps={values => (
        <div className="grid-x">
          <div
            className={classNames({
              cell: true,
              'large-auto': parsedAnnouncement,
              'large-8': !parsedAnnouncement,
              'medium-auto': parsedAnnouncement,
              'medium-8': !parsedAnnouncement,
            })}
          >
            <Field
              name="title"
              component={TextField}
              type="text"
              label="Title*"
              validate={[required]}
            />
            <div className="grid-x">
              <div className="cell large-auto medium-auto">
                <Field
                  name="audience"
                  component={SelectField}
                  label="Visibility*"
                  placeholder="choose visibility"
                  options={audienceOptions[role] || []}
                  validate={[required]}
                />
              </div>
              {
                (values.audience && values.audience.indexOf('-specific') > -1) &&
                <div
                  className="cell large-auto medium-auto"
                  style={{ marginLeft: '2em' }}
                >
                  <Field
                    name="chapterUuid"
                    component={SelectField}
                    label="Specified Chapter*"
                    placeholder="select a chapter"
                    options={chapters.map(c => ({
                      value: c.uuid,
                      title: c.name,
                    }))}
                    validate={[required]}
                  />
                </div>
              }
            </div>
            {
              parsedAnnouncement &&
              <Field
                name="image"
                component={FileStackField}
                label="Image"
              />
            }
            <Field
              name="body"
              component={TextAreaField}
              label="Body*"
              placeholder="What are the details?"
              validate={[required]}
            />
            <div className="cell">
              <button type="submit" className="button">
                Submit
              </button>
            </div>
          </div>
          {
            !parsedAnnouncement &&
            <div
              className="cell large-4 medium-4"
              style={{ paddingLeft: '2em' }}
            >
              <Field
                name="image"
                component={FileStackField}
                label="Image"
              />
            </div>
          }
        </div>
      )}
    />
  );
};

AnnouncementsForm.propTypes = {
  form: PropTypes.string,
  announcement: PropTypes.shape({}),
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  chapter: PropTypes.shape({}),
  role: PropTypes.string,
  onSuccess: PropTypes.func,
};

AnnouncementsForm.defaultProps = {
  form: 'container',
  announcement: null,
  chapters: [],
  chapter: {},
  role: '',
  onSuccess: () => {},
};

export default AnnouncementsForm;
