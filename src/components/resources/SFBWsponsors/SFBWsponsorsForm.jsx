import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import notifications from 'react-notification-system-redux';

import {
  TextField,
  TextAreaField,
  FileStackField,
  SelectField,
} from '../../common/form/inputs/index';
import { required } from '../../../helpers/validations';
import Actions from '../../../redux/actions/';
import FormContainer from '../../common/form/formContainer';
import AdminFormHeaderItem from '../forms/header/adminFormHeaderItem';

const sponsorLevels = [{
  title: 'Presenting',
  value: 'presenting',
}, {
  title: 'Official',
  value: 'official',
}, {
  title: 'Industry',
  value: 'industry',
}, {
  title: 'Supporting',
  value: 'supporting',
}, {
  title: 'Partners',
  value: 'partners',
}];

const SponsorsForm = ({
  SFBWsponsors, location, history, crudAction,
}) => {
  const foundSponsor = SFBWsponsors.find(sponsor => sponsor._id === location.pathname.split('/')[4]);
  return (


    <section className="sectionPadding">
      <div className="grid-container">

        <div className="grid-x grid-margin-y">

          <div className="cell">
            <AdminFormHeaderItem
              title="SFBW Sponsor Info"
              materialIcon="attach_money"
            />
          </div>
          <FormContainer
            form="SFBWsponsors"
            record={foundSponsor}
            submit={(results, actions, formNotifications) => {
              if (foundSponsor) {
                actions.crudAction(
                  {
                      type: 'put',
                      resource: 'SFBWsponsors',
                  },
                  {
                      _id: foundSponsor._id,
                      changes: results,
                  },
                  (error, data) => {
                    if (error || !data) {
                      formNotifications.error('Error Occurred Editing Sponsor');
                    } else {
                      formNotifications.success('Successfully Edited Sponsor');
                      actions.history.replace('/sfbw/sponsors');
                    }
                  },
                );
              } else {
                actions.crudAction(
                  {
                      type: 'post',
                      resource: 'SFBWsponsors',
                  },
                  { pkg: results },
                  (error, data) => {
                    if (error || !data) {
                      formNotifications.error('Error Occurred Creating Sponsor');
                    } else {
                      formNotifications.success('Successfully Created Sponsor');
                      actions.history.replace('/sfbw/sponsors');
                    }
                  },
                );
              }
            }}
            renderProps={() => (
              <section className="grid-x grid-padding-x">
                <Field
                  containerClass="cell"
                  component={TextField}
                  name="name"
                  label="Sponsor Name"
                  type="text"
                  validate={[required]}
                />
                <Field
                  containerClass="cell large-6"
                  component={TextField}
                  name="website"
                  label="Sponsor Website"
                  type="text"
                  validate={[required]}
                />
                <Field
                  containerClass="cell large-6"
                  component={SelectField}
                  options={sponsorLevels}
                  name="level"
                  label="Sponsor Level"
                  validate={[required]}
                />
                <Field
                  containerClass="cell"
                  component={FileStackField}
                  name="imageUrl"
                  label="Sponsor Image"
                  validate={[required]}
                />
                <Field
                  containerClass="cell"
                  component={TextAreaField}
                  name="description"
                  label="Sponsor Description"
                  type="text"
                  validate={[required]}
                />
                <div className="cell">

                  <div className="button-group">
                    <button
                      type="submit"
                      className="button"
                    >
                    Submit
                    </button>

                    {
                        foundSponsor &&
                        <button
                          type="button"
                          className="button alert"
                          onClick={
                            () => {
                              crudAction(
                                { type: 'delete', resource: 'SFBWsponsors' },
                                { _id: foundSponsor._id },
                                (error, data) => {
                                  if (error || !data) {
                                    notifications.error('Error Occurred Deleting Sponsor');
                                  } else {
                                    notifications.success('Successfully Deleted Sponsor');
                                    history.replace('/sfbw/sponsors');
                                  }
                                },
                              );
                            }
                          }
                        >
                          Delete Sponsor
                        </button>
                    }
                  </div>
                </div>
              </section>
            )
            }
          />
        </div>
      </div>
    </section>

  );
};

SponsorsForm.propTypes = {
  SFBWsponsors: PropTypes.arrayOf(PropTypes.shape({})),
  location: PropTypes.shape({}),
  history: PropTypes.shape({}),
  crudAction: PropTypes.func.isRequired,
};

SponsorsForm.defaultProps = {
  SFBWsponsors: [],
  location: {},
  history: {},
};

export default connect(
  state => ({
    SFBWsponsors: state.SFBWsponsors.list._list,
  }),
  dispatch => ({
    crudAction: bindActionCreators(Actions.crudAction, dispatch),
  }),
  null,
  { pure: false },
)(withRouter((SponsorsForm)));
