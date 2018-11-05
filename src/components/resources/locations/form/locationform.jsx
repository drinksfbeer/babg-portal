import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';

import { TextField, FileStackField } from '../../../common/form/inputs/index';
import { required } from '../../../common/form/validations/index';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';
import FormContainer from '../../../common/form/formContainer';
import { locationStages, locationOptions } from '../../../../refs/refs';

const toggleStyle = active => ({
  backgroundColor: active ? '#333' : '',
  color: active ? 'white' : 'rgba(0,0,0,0.4)',
  boxShadow: active ? '0 1.5px 3px rgba(0,0,0,0.35)' : undefined,
  fontWeight: active ? '900' : '400',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

class LocationsForm extends React.Component {
  constructor(props) {
    super(props);

    const { location } = props;

    this.state = {
      stage: location ? location.stage : locationStages[0].value,
      profileLocation: location ? location.profileLocation : true,
      selectedLocationOptions: location ? location.locationOptions : [],
    };
  }

  render() {
    const { stage, profileLocation, selectedLocationOptions } = this.state;
    const { location, profileLocationActive, member } = this.props;

    return (
      <FormContainer
        form="location"
        record={location}
        submit={(results, actions, notifications) => {
          if (!member) {
            console.warn('missing member prop'); // eslint-disable-line
            return null;
          }
          if (location) {
            const { _id, ...trimmedResults } = results;
            if (results.uuid === location.uuid) {
              delete trimmedResults.uuid;
            }
            if (results.name === location.name) {
              delete trimmedResults.name;
            }
            // this was done so as not to throw mongoose duplicate error
            // TODO find a way to get rid of duplicates to reduce redundancies
            return actions.crudAction({
              type: 'put',
              resource: 'locations',
            }, {
              _id: location._id,
              changes: {
                ...trimmedResults,
                stage,
                profileLocation,
                locationOptions: selectedLocationOptions,
              },
            }, (err) => {
              if (!err) {
                notifications.success('Successfully Updated Location');
              } else {
                notifications.error('Error Occurred Updating Location');
                console.warn('Error while updating location:', err); // eslint-disable-line
              }
            });
          }
          return actions.crudAction({
            type: 'post',
            resource: 'locations',
          }, {
            pkg: {
              ...results,
              stage,
              profileLocation,
              locationOptions: selectedLocationOptions,
              memberUuid: member.uuid,
              chapterUuid: member.chapterUuid,
            },
          }, (err, newLocation) => {
            if (!err && newLocation) {
              notifications.success('Successfully Created Location');
              actions.history.push(`/location/${newLocation._id}`);
            } else {
              notifications.error('Error Occurred Creating Location');
              console.warn('something wrong happened with new location creation:', err); // eslint-disable-line
            }
          });
        }}
        renderProps={() => (
          <div>
            <div className="grid-x grid-margin-x grid-margin-y">
              <AdminFormHeaderItem
                title="Location Info"
                materialIcon="edit_location"
              />
              <Field
                containerClass=" cell"
                name="name"
                component={TextField}
                type="text"
                label="Location name *"
                placeholder="enter location name"
                require={[required]}
              />
              <Field
                name="street"
                containerClass="large-7 medium-7 cell"
                component={TextField}
                type="text"
                label="street *"
                placeholder="Ex. 1234 India St"
                require={[required]}
              />
              <Field
                name="street2"
                containerClass="large-5 medium-5 cell"
                component={TextField}
                type="text"
                label="street 2"
                placeholder="Ex. unit 4"
                require={[required]}
              />
              <Field
                name="city"
                containerClass="large-5 medium-5 cell"
                component={TextField}
                type="text"
                label="city *"
                placeholder="Ex. San Diego"
                require={[required]}
              />
              <Field
                name="state"
                containerClass="large-2 medium-2 cell"
                component={TextField}
                type="text"
                label="state *"
                placeholder="Ex. CA"
                require={[required]}
              />
              <Field
                name="zip"
                containerClass="large-5 medium-5 cell"
                component={TextField}
                type="text"
                label="zip code *"
                placeholder="92102"
                require={[required]}
              />
              <Field
                name="hoursMonday"
                containerClass="large-3 medium-3 cell"
                component={TextField}
                type="text"
                label="Hours Monday"
                placeholder="3:00 - 8:00 PM"
              />
              <Field
                name="hoursTuesday"
                containerClass="large-3 medium-3 cell"
                component={TextField}
                type="text"
                label="Hours Tuesday"
                placeholder="3:00 - 8:00 PM"
              />
              <Field
                name="hoursWednesday"
                containerClass="large-3 medium-3 cell"
                component={TextField}
                type="text"
                label="Hours Wednesday"
                placeholder="3:00 - 8:00 PM"
              />
              <Field
                name="hoursThursday"
                containerClass="large-3 medium-3 cell"
                component={TextField}
                type="text"
                label="Hours Thursday"
                placeholder="3:00 - 8:00 PM"
              />
              <Field
                name="hoursFriday"
                containerClass="large-4 medium-4 cell"
                component={TextField}
                type="text"
                label="Hours Friday"
                placeholder="3:00 - 8:00 PM"
              />
              <Field
                name="hoursSaturday"
                containerClass="large-4 medium-4 cell"
                component={TextField}
                type="text"
                label="Hours Saturday"
                placeholder="3:00 - 8:00 PM"
              />
              <Field
                name="hoursSunday"
                containerClass="large-4 medium-4 cell"
                component={TextField}
                type="text"
                label="Hours Sunday"
                placeholder="3:00 - 8:00 PM"
              />
              <Field
                name="phone"
                containerClass="large-5 medium-5 cell"
                component={TextField}
                type="text"
                label="Location Phone Number"
                placeholder="619-777-1234"
              />
              <Field
                name="bannerImage"
                containerClass="large-6 medium-6 cell"
                component={FileStackField}
                label="Banner Image"
                options={{
                  imageMax: [1800, 1800],
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
            <div className="grid-x grid-margin-x" style={{ marginBottom: '1em' }}>
              <div className="cell">
                <div className="grid-x grid-padding-x grid-padding-y">
                  <div className="cell">
                    <b>What is the current operating stage of this location?</b>
                  </div>
                  {locationStages.map(locationStage => (
                    <div
                      key={locationStage.value}
                      className="cell large-4 medium-4 app-item text-center"
                      style={{
                        ...toggleStyle(stage === locationStage.value),
                        backgroundColor: stage === locationStage.value ? locationStage.color : '',
                      }}
                      onClick={() => this.setState({ stage: locationStage.value })}
                    >
                      <i className="material-icons" style={{ paddingRight: '10px' }}>
                        {locationStage.icon}
                      </i>
                      {locationStage.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid-x grid-margin-x" style={{ marginBottom: '1em' }}>
              {profileLocationActive &&
                <div className="cell">
                  <div className="grid-x grid-padding-x grid-padding-y ">
                    <div className="cell">
                      <b>Is this location a brewery location or is it only meant for events?</b>
                    </div>
                    <div
                      className="cell large-6 medium-6 app-item text-center"
                      style={toggleStyle(profileLocation)}
                      onClick={() => this.setState({ profileLocation: true })}
                    >
                      <i className="material-icons" style={{ paddingRight: '10px' }}>local_drink</i>
                        Brewery Location
                    </div>
                    <div
                      className="cell large-6 medium-6 app-item text-center"
                      onClick={() => this.setState({ profileLocation: false })}
                      style={toggleStyle(!profileLocation)}
                    >
                      <i className="material-icons" style={{ paddingRight: '10px' }}>today</i>
                        Event Only Venue
                    </div>
                  </div>
                </div>
              }
            </div>
            <div className="grid-x grid-margin-x">
              <div className="cell">
                <div className="grid-x grid-padding-x grid-padding-y">
                  <div className="cell">
                    <b>What options are available at this location?</b>
                  </div>
                  <div className="cell">
                    {locationOptions.map(option => (
                      <div key={option.value}>
                        <input
                          type="checkbox"
                          id={option.value}
                          value={option.value}
                          checked={selectedLocationOptions.includes(option.value)}
                          onChange={(event) => {
                            if (event.target.checked) {
                              // checkbox just transitioned from unchecked to checked
                              selectedLocationOptions.push(option.value);
                            } else {
                              // checkbox just transitioned from checked to unchecked
                              const index = selectedLocationOptions.indexOf(option.value);
                              if (index < 0) return;
                              selectedLocationOptions.splice(index, 1);
                            }
                            this.setState({ selectedLocationOptions });
                          }}
                        />
                        <label htmlFor={option.value}>
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="button"
              style={{
                marginTop: '20px',
              }}
            >
              Submit
            </button>
          </div>
        )}
      />
    );
  }
}

LocationsForm.propTypes = {
  location: PropTypes.shape({
    stage: PropTypes.string,
    profileLocation: PropTypes.bool,
    locationOptions: PropTypes.arrayOf(PropTypes.string),
  }),
  member: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
  }).isRequired,
  profileLocationActive: PropTypes.bool,
};

LocationsForm.defaultProps = {
  location: null,
  profileLocationActive: true,
};

export default LocationsForm;
