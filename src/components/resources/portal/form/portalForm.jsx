import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
// import { connect } from 'react-redux';
import { FileStackField } from '../../../common/form/inputs';
import { required } from '../../../common/form/validations';
import FormContainer from '../../../common/form/formContainer';
import AdminFormHeaderItem from '../../../resources/forms/header/adminFormHeaderItem';
import FancyError from '../../../common/fancyError/fancyError';

const PortalForm = ({
  user,
  // member,
  pages,
  settings,
}) => {
  // this only will modify the `pages` collection, for now
  // (since it's the only setting in this section)
  const loginPage = pages.filter(page => page.hasOwnProperty('loginImage'))[0] || ''; // eslint-disable-line
  return (
    <div>
      <FormContainer
        form="defaultEventBannerImage"
        record={settings}
        submit={(results, actions, notifications) => {
          // only the member account associated with the master admin can make changes
          if (user.role === 'master') {
            actions.crudAction({
              type: 'put',
              resource: 'settings',
            }, {
              _id: settings[0]._id,
              changes: results,
            }, (error, updatedSettings) => {
              if (!error && updatedSettings) {
                notifications.success('Successfully Updated Portal');
              } else {
                notifications.error('Error Occurred Updating Portal');
                // console.warn('Error occurred updating portal settings:', error);
              }
            });
          } else {
            notifications.error('Insufficient User Permissions');
          }
        }}
        renderProps={() => {
          if (user.role !== 'master') {
            return (
              <FancyError
                title="Insufficient Privileges"
                error="You have insufficient privileges to modify any of these settings."
                stringify={false}
                contentStyle={{ textAlign: 'center' }}
                titleStyle={{ justifyContent: 'center' }}
              />
            );
          }

          return (
            <div className="grid-x grid-padding-x grid-padding-y grid-margin-x grid-margin-y">
              <AdminFormHeaderItem
                title="Event Default Banner Image"
                description="Set a default Event Banner Image if one was not provided by event submission"
              />
              <div className="cell large-4 medium-4">
                <Field
                  name="defaultEventBannerImage"
                  label="Event Banner"
                  component={FileStackField}
                  validate={[required]}
                />
              </div>
              <div className="cell">
                <button className="button">
                  Submit
                </button>
              </div>
            </div>
          );
        }}
      />
      <FormContainer
        form="portal"
        record={loginPage}
        submit={(results, actions, notifications) => {
          // only the member account associated with the master admin can make changes
          if (user.role === 'admin') {
            actions.crudAction({
              type: 'put',
              resource: 'pages',
            }, {
              _id: loginPage._id,
              changes: results,
            }, (error, updatedPage) => {
              if (!error && updatedPage) {
                notifications.success('Successfully Updated Portal');
              } else {
                notifications.error('Error Occurred Updating Portal');
                // console.warn('Error occurred updating portal settings:', error);
              }
            });
          } else {
            notifications.error('Insufficient User Permissions');
          }
        }}
        renderProps={() => {
          if (user.role !== 'master') {
            return (
              <FancyError
                title="Insufficient Privileges"
                error="You have insufficient privileges to modify any of these settings."
                stringify={false}
                contentStyle={{ textAlign: 'center' }}
                titleStyle={{ justifyContent: 'center' }}
              />
            );
          }

          return (
            <div className="grid-x grid-padding-x grid-padding-y grid-margin-x grid-margin-y">
              <AdminFormHeaderItem
                title="Sign-In Page"
                description="These settings solely affect the portal&apos;s sign-in page."
                materialIcon="web"
              />
              <div className="cell large-4 medium-4">
                <Field
                  name="loginImage"
                  label="Left Column Image*"
                  component={FileStackField}
                  validate={[required]}
                />
              </div>
              <div className="cell">
                <button className="button">
                  Submit
                </button>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

PortalForm.propTypes = {
  user: PropTypes.shape({}),
  // member: PropTypes.shape({}).isRequired,
  pages: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
  })),
  // isAdmin: PropTypes.bool,
  settings: PropTypes.shape({}),
};

PortalForm.defaultProps = {
  user: {},
  pages: [],
  // isAdmin: false,
  settings: {},
};

// export default connect(
//   null,
//   null,
//   null,
//   { pure: false },
// )(PortalForm);
export default PortalForm;
