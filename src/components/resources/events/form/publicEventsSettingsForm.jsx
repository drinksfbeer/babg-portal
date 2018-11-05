import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';
import FormContainer from '../../../common/form/formContainer';
import {
  ToggleField,
  TextField,
  QuillField,
  DatePickerField,
} from '../../../common/form/inputs';
import { required, requiredText } from '../../../common/form/validations';
import FancyError from '../../../common/fancyError/fancyError';

const PublicEventSettingsForm = ({
  settings,
  user,
}) => (
  <FormContainer
    form="publicEventSettings"
    record={{
      ...settings,
      publicEventUniqueFee: settings.publicEventUniqueFee ?
        settings.publicEventUniqueFee / 100 : 0,
      publicEventWeekLongFee: settings.publicEventUniqueFee ?
        settings.publicEventWeekLongFee / 100 : 0,
    }}
    submit={(results, actions, notifications) => {
      if (user.role !== 'master') {
        notifications.error('Insufficient User Permissions');
        return;
      }

      const {
        publicEventUniqueFee,
        publicEventWeekLongFee,
      } = results;

      actions.crudAction({
        type: 'put',
        resource: 'settings',
      }, {
        _id: settings._id,
        adminId: user._id,
        changes: {
          ...results,
          publicEventUniqueFee: Math.floor(publicEventUniqueFee * 100),
          publicEventWeekLongFee: Math.floor(publicEventWeekLongFee * 100),
        },
      }, (err, updatedSettings) => {
        if (err || !updatedSettings) {
          notifications.error('Error Occurred Updating Settings');
        } else {
          notifications.success('Successfully Updated Settings');
        }
      });
    }}
    renderProps={(values) => {
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
        <div className="grid-x grid-padding-x grid-padding-y">
          <AdminFormHeaderItem
            title="Festival Configuration"
            description="These settings affect the festival as a whole."
          />
          <Field
            name="festivalStartDate"
            label="Festival Start Date *"
            placeholder="choose start date"
            component={DatePickerField}
            containerClass="large-6 medium-6 cell"
            options={{
              enableTime: false,
              altFormat: 'F j, Y',
              dateFormat: 'F j, Y',
              disable: [
                function limitStartDate(date) {
                  return new Date() > date;
                },
              ],
            }}
            validate={[requiredText]}
          />
          <Field
            name="festivalEndDate"
            label="Festival End Date *"
            placeholder="choose end date"
            component={DatePickerField}
            containerClass="large-6 medium-6 cell"
            options={{
              enableTime: false,
              altFormat: 'F j, Y',
              dateFormat: 'F j, Y',
              disable: [
                function limitStartDate(date) {
                  return new Date() > date;
                },
              ],
            }}
            validate={[requiredText]}
          />
          <div className="cell" style={{ paddingTop: 0 }}>
            <span className="description">
              <em>
                <strong>Note:</strong> Users will only be able to submit events between
                these two dates.
              </em>
            </span>
          </div>
          <AdminFormHeaderItem
            title="Event Submissions Configuration"
            description="These settings affect how the public can post events. Modifying these settings will only affect events created after the change. Pre-existing events will not be affected."
          />
          <Field
            name="publicEventEnabled"
            label="Submissions Allowed"
            component={ToggleField}
            containerClass="cell large-2 medium-2"
            require={[required]}
          />
          <Field
            name="publicEventUniqueFee"
            label="Unique Event Submission Fee (US$)"
            placeholder="35.00"
            component={TextField}
            containerClass="cell large-2 medium-2"
            type="number"
            min={0}
            validate={[required]}
          />
          <Field
            name="publicEventWeekLongFee"
            label="Week-Long Event Submission Fee (US$)"
            placeholder="50.00"
            component={TextField}
            containerClass="cell large-2 medium-2"
            type="number"
            min={0}
            validate={[required]}
          />
          <Field
            name="publicEventUniqueMaxTime"
            label="Max Unique Event Time Span (Hours)"
            placeholder="10"
            component={TextField}
            containerClass="cell large-2 medium-2"
            type="number"
            min={0}
            max={24}
            validate={[required]}
          />
          {
            !values.publicEventEnabled &&
            <React.Fragment>
              <Field
                name="publicEventClosedTitle"
                label="Closed Notice Title"
                component={TextField}
                containerClass="cell"
                validate={[required]}
              />
              <Field
                name="publicEventClosedText"
                label="Closed Notice Description"
                component={TextField}
                containerClass="cell"
                validate={[required]}
              />
            </React.Fragment>
          }
          <Field
            name="publicEventNotice"
            label="Submission Notice"
            component={QuillField}
            containerClass="cell"
            quillStyle={{ marginBottom: '0' }}
          />
          <div className="cell">
            <button type="submit" className="button">
              Submit
            </button>
          </div>
        </div>
      );
    }}
  />
);

PublicEventSettingsForm.propTypes = {
  settings: PropTypes.shape({
    festivalStartDate: PropTypes.number,
    festivalEndDate: PropTypes.number,
    publicEventEnabled: PropTypes.bool,
    publicEventUniqueFee: PropTypes.number,
    publicEventWeekLongFee: PropTypes.number,
    publicEventUniqueMaxTime: PropTypes.number,
    publicEventNotice: PropTypes.string,
    publicEventClosedTitle: PropTypes.string,
    publicEventClosedText: PropTypes.string,
  }),
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
};

PublicEventSettingsForm.defaultProps = {
  settings: {},
  user: {},
};

export default PublicEventSettingsForm;
