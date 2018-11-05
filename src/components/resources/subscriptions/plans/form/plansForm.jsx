import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
// import classNames from 'classnames';

import {
  TextField,
  ToggleField,
  SelectField,
} from '../../../../common/form/inputs';
import { required } from '../../../../common/form/validations';
// import AdminFormHeaderItem from '../../../forms/header/adminFormHeaderItem';
import FormContainer from '../../../../common/form/formContainer';

const PlansForm = ({
  plan,
}) => (
  <FormContainer
    form="plans"
    record={plan}
    submit={(results, actions, notifications) => {
      const { nickname } = results;

      if (plan) {
        const { active } = results;
        actions.asyncAction('updatePlan', {
          id: plan.id,
          nickname,
          active,
        }, null, (error, updatedPlan) => {
          if (error || !updatedPlan) {
            notifications.error('Error Updating Plan');
          } else {
            notifications.success('Successfully Updated Plan');
            actions.history.push('/subscriptions/plans');
          }
        });
      } else {
        const { amount, interval } = results;
        actions.asyncAction('createPlan', {
          nickname,
          amount: parseInt(amount, 10) * 100,
          interval,
        }, null, (error, newPlan) => {
          if (error || !newPlan) {
            notifications.error('Error Creating Plan');
          } else {
            notifications.success('Successfully Created Plan');
            actions.history.push('/subscriptions/plans');
          }
        });
      }
    }}
    renderProps={values => (
      <div className="grid-container">
        <div className="grid-x grid-padding-x grid-padding-y align-center">
          <div className="cell large-8 medium-10 small-11">
            <Link to="/subscriptions/plans">
              <span style={{ fontSize: '200%', marginRight: '5px' }}>
                &#8249;
              </span>
              <em>Back to Plans</em>
            </Link>
            <h2>
              {plan ? 'Edit Plan' : 'Create New Plan'}
            </h2>
          </div>
          {
            plan &&
            <div className="cell large-8 medium-10 small-11">
              <em>
                <strong>Note:</strong> Deactivating will keep current subscriptions
                active, but will prevent other members from subscribing to this plan.
                <br />
                You cannot change the billing frequency and amount at this point.
              </em>
            </div>
          }
          <div className="cell large-8 medium-10 small-11">
            <div className="grid-x grid-padding-x grid-padding-y">
              {
                !plan &&
                <div
                  className="cell large-12 medium-12"
                  style={{ color: '#B71C1C' }}
                >
                  <strong>Warning:</strong> The amount cannot be changed
                  once the plan is created!
                </div>
              }
              <Field
                name="nickname"
                label="Plan Name"
                type="text"
                component={TextField}
                validate={[required]}
                containerClass="cell large-12 medium-12"
              />
              <Field
                name="interval"
                label="Billing Frequency"
                placeholder="select the billing frequency"
                component={SelectField}
                options={[{
                  value: 'month',
                  title: 'Monthly',
                }, {
                  value: 'year',
                  title: 'Yearly',
                }]}
                validate={[required]}
                containerClass="cell large-12 medium-12"
                disabled={!!plan}
              />
              {
                values.interval &&
                <Field
                  name="amount"
                  label="Amount"
                  placeholder={values.interval === 'year' ? '$ / yr.' : '$ / mo.'}
                  type="number"
                  inputProps={{
                    min: 0,
                    max: 999999999,
                    disabled: !!plan,
                  }}
                  component={TextField}
                  validate={[required]}
                  containerClass="cell large-12 medium-12"
                />
              }
              {
                plan &&
                <Field
                  name="active"
                  label="Active"
                  component={ToggleField}
                  containerClass="cell large-1"
                />
              }
              <div className="cell">
                <button className="button">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  />
);

PlansForm.propTypes = {
  plan: PropTypes.shape({}),
};

PlansForm.defaultProps = {
  plan: null,
};

export default PlansForm;
