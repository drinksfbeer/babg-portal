import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
  ToggleField,
  TextField,
  FileStackField,
  DatePickerField,
  SelectField,
  QuillField,
  DefaultField,
} from '../../../common/form/inputs/index';
import { categories } from '../../../../refs/refs';
import { required } from '../../../../helpers/validations';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';
import FormContainer from '../../../common/form/formContainer';

const EventsForm = ({
  event,
  member,
  user,
}) => {
  if (!member) return null;
  return (
    <FormContainer
      record={event}
      submit={(results, actions) => {
        if (event) {
          actions.crudAction({
            type: 'put',
            resource: 'events',
          }, {
            _id: event._id,
            changes: results,
          }, (err, modifiedEvent) => {
            if (!err && modifiedEvent) {
              actions.history.replace(`/event/${modifiedEvent._id}`);
            } else {
              console.warn('something wrong happened updating results') // eslint-disable-line
            }
          });
        } else {
          actions.crudAction({
            type: 'post',
            resource: 'events',
          }, {
            pkg: results,
          }, (err, newEvent) => {
            if (!err && newEvent) {
              actions.history.replace(`/event/${newEvent._id}`);
            } else {
              // TODO properly show user error
              console.warn('something wrong happened with new event creation'); // eslint-disable-line
            }
          });
        }
      }}
      renderProps={values => (
        <div className="grid-x grid-padding-x grid-padding-y">
          <AdminFormHeaderItem
            title="Event Info"
            materialIcon="event_note"
          />
          {
            (user.role === 'master' || user.role === 'chapter') &&
            <div className="featured cell">
              <div className="grid-x grid-padding-x">
                <Field
                  containerClass="cell large-4"
                  name="featured"
                  label="Featured"
                  component={ToggleField}
                />
                <Field
                  containerClass="cell large-4"
                  name="chapterFeatured"
                  label="Chapter Featured"
                  component={ToggleField}
                />
                <Field
                  containerClass="cell large-4"
                  name="marquee"
                  label="Marquee"
                  component={ToggleField}
                />
              </div>
            </div>
          }
          <Field
            containerClass="cell"
            name="title"
            component={TextField}
            type="text"
            label="Event title *"
            placeholder="enter event title"
            require={[required]}
          />
          <Field
            name="startDate"
            containerClass="large-6 medium-6 cell"
            component={DatePickerField}
            label="Event start date *"
            placeholder="choose start date"
            require={[required]}
            options={{
              disable: [
              function limitStartDate(date) {
                return (new Date() > date);
              },
              ],
            }}
          />
          <Field
            name="endDate"
            containerClass="large-6 medium-6 cell"
            component={DatePickerField}
            label="Event end date *"
            placeholder="choose end date"
            require={[required]}
            options={{
              disable: [
              function limitEndDate(date) {
                return (new Date() > date);
              },
              ],
            }}
          />
          <Field
            containerClass=" cell"
            name="image"
            description="Event images should be 16 / 9 aspect ratio, and minimum 1200 x 680px recommened 1920 x 1080px. The ratio matches Facebook's event image. The images you upload should be photos — no overlaid text or graphics."
            component={FileStackField}
            label="event photo"
            options={{
              imageMax: [1920, 1080],
              imageMin: [1200, 680],
              transformations: {
                crop: {
                  aspectRatio: 16 / 9,
                  force: true,
                },
              },
            }}
          />
          <Field
            containerClass="cell"
            name="locationUuid"
            component={SelectField}
            label="select a event location * "
            placeholder="select location"
            options={(member || { locations: [] }).locations.map(loc => ({
              value: loc.uuid,
              title: loc.name,
            })).concat({
              value: 'new',
              title: '+ Create New Location',
            })}
            optionStyle={{ fontSize: '85%' }}
            lastOptionStyle={{ color: 'rgba(0,0,0,0.6)' }}
          />
          {values.locationUuid === 'new' &&
            <div className="cell">
              <div className="grid-x grid-margin-x grid-margin-y ">
                <Field
                  name="location.memberUuid"
                  component={DefaultField}
                  defaultValue={member.uuid}
                />
                <Field
                  name="location.profileLocation"
                  component={DefaultField}
                  defaultValue={false}
                />
                <Field
                  containerClass="cell"
                  name="location.name"
                  component={TextField}
                  type="text"
                  label="Location Name"
                  placeholder="enter new location name"
                  require={[required]}
                />
                <Field
                  containerClass="large-7 medium-7 cell"
                  name="location.street"
                  component={TextField}
                  type="text"
                  label="street"
                  placeholder="Ex. 1234 India St"
                  require={[required]}
                />
                <Field
                  containerClass="large-5 medium-5 cell"
                  name="location.street2"
                  component={TextField}
                  type="text"
                  label="street 2"
                  placeholder="Ex. unit 2"
                />
                <Field
                  containerClass="large-5 medium-6 cell"
                  name="location.city"
                  component={TextField}
                  type="text"
                  label="city"
                  placeholder="Ex. San Diego"
                  require={[required]}
                />
                <Field
                  containerClass="large-2 medium-2 cell"
                  name="location.state"
                  component={TextField}
                  type="text"
                  label="state"
                  placeholder="Ex. CA"
                  require={[required]}
                />
                <Field
                  containerClass="large-4 medium-4 cell"
                  name="location.zip"
                  component={TextField}
                  type="text"
                  label="zip"
                  placeholder="Ex. 92102"
                  require={[required]}
                />
              </div>
            </div>
          }

          <Field
            containerClass="cell"
            name="body"
            component={QuillField}
            label="Event details *"
            placeholder="enter event details here"
            height="280px"
            require={[required]}
          />
          <Field
            containerClass="cell"
            name="category"
            component={SelectField}
            options={categories.map(category => ({ value: category, title: category }))}
            label="Event category *"
            placeholder="choose category"
            require={[required]}
          />
          <Field
            containerClass="large-6 medium-6 cell"
            type="text"
            name="eventUrl"
            placeholder="enter event url"
            component={TextField}
            label="event url"
          />
          <Field
            containerClass="large-6 medium-6 cell"
            type="text"
            name="ticketUrl"
            placeholder="enter ticket url"
            component={TextField}
            label="Event ticket url"
          />
          <div className="cell">
            <button className="button" type="submit">Submit</button>
          </div>
        </div>
      )}
    />
  );
};

EventsForm.propTypes = {
  member: PropTypes.shape({
    name: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  }).isRequired,
  event: PropTypes.shape({}),
  user: PropTypes.shape({}),
};

EventsForm.defaultProps = {
  event: null,
  user: {},
};

export default connect(
  (state) => {
    const { user } = state.users.auth;
    return {
      user,
    };
  },
  null,
  null,
  { pure: false },
)(EventsForm);
