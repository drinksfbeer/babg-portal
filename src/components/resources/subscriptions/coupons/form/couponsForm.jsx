import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import classNames from 'classnames';

import { TextField, SelectField } from '../../../../common/form/inputs';
import { required, couponCode } from '../../../../common/form/validations';
// import AdminFormHeaderItem from '../../../forms/header/adminFormHeaderItem';
import FormContainer from '../../../../common/form/formContainer';

const durationOptions = [
  { title: 'Forever', value: 'forever' },
  { title: 'Repeat for a number of months', value: 'repeating' },
];

const CouponsForm = ({
  coupon,
}) => (
  <FormContainer
    form="coupons"
    record={coupon}
    submit={(results, actions, notifications) => {
      const {
        id,
        percentOff,
        duration,
        numMonths,
      } = results;

      actions.asyncAction('createCoupon', {
        id,
        percentOff,
        duration,
        numMonths,
      }, null, (err, newCoupon) => {
        if (err || !newCoupon) {
          notifications.error('Error Creating Coupon');
        } else {
          notifications.success('Successfully Created Coupon');
          actions.history.push('/subscriptions/coupons');
        }
      });
    }}
    renderProps={values => (
      <div className="grid-container">
        <div className="grid-x grid-padding-x grid-padding-y align-center">
          <div className="cell large-8 medium-10 small-11">
            <Link to="/subscriptions/coupons">
              <span style={{ fontSize: '200%', marginRight: '5px' }}>
                &#8249;
              </span>
              <em>Back to Coupons</em>
            </Link>
            <h2>New Coupon</h2>
          </div>
          <div className="cell large-8 medium-10 small-11">
            <div className="grid-x grid-padding-x grid-padding-y">
              <div
                className="cell"
                style={{ color: '#B71C1C' }}
              >
                <strong>Warning:</strong> The coupon cannot be edited once created!
              </div>
              <Field
                name="id"
                label="Coupon Code"
                placeholder="one word, alphanumeric, underscores"
                type="text"
                component={TextField}
                validate={[required, couponCode]}
                containerClass="cell large-6 medium-6"
              />
              <Field
                name="percentOff"
                label="Percentage Off"
                placeholder="numbers only"
                type="number"
                inputProps={{
                  min: 1,
                  max: 100,
                }}
                component={TextField}
                validate={[required]}
                containerClass="cell large-6 medium-6"
              />
              <Field
                name="duration"
                label="Duration"
                placeholder="choose duration"
                component={SelectField}
                options={durationOptions}
                validate={[required]}
                containerClass={classNames({
                  cell: true,
                  'large-12': values.duration !== 'repeating',
                  'medium-12': values.duration !== 'repeating',
                  'large-6': values.duration === 'repeating',
                  'medium-6': values.duration === 'repeating',
                })}
              />
              {
                values.duration === 'repeating' &&
                <Field
                  name="numMonths"
                  label="Coupon Duration"
                  placeholder="number of months"
                  type="number"
                  inputProps={{
                    min: 0,
                    max: 999999,
                  }}
                  component={TextField}
                  validate={[required]}
                  containerClass="cell large-6 medium-6"
                />
              }
              <div className="cell">
                <button type="submit" className="button">
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

CouponsForm.propTypes = {
  coupon: PropTypes.shape({}),
};

CouponsForm.defaultProps = {
  coupon: null,
};

export default CouponsForm;
