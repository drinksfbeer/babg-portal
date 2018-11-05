import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import classNames from 'classnames';
import { SelectField } from '../../../../common/form/inputs';
import { required } from '../../../../common/form/validations';
import FormContainer from '../../../../common/form/formContainer';
import CardsList from '../../cards/list/cardsList';

const AssignPlansForm = ({
  member,
  member: {
    _id: memberId, // eslint-disable-line
    stripeCustomerId,
    stripePlanId,
    stripeCouponId,
    stripeCards,
  },
  plans,
  coupons,
  asyncAction,
  isModal,
  close,
}) => {
  const contentCellClassNames = classNames({
    cell: true,
    'large-8': !isModal,
    'large-12': isModal,
    'medium-10': !isModal,
    'medium-12': isModal,
    'small-11': !isModal,
    'small-12': isModal,
  });

  if (!stripeCustomerId || stripeCards.length < 1) {
    return (
      <div className="grid-container">
        <div className="grid-x grid-padding-y align-center">
          <div className={contentCellClassNames}>
            <h2>Set Subscription</h2>
          </div>
          <div className={contentCellClassNames}>
            This member has not yet entered in their payment details.
            They must do so before assigning them to a subscription plan.
          </div>
          <div className={contentCellClassNames} style={{ marginBottom: '1em' }}>
            Alternatively, you may manually attach a payment method on their behalf.
          </div>
          {
            !isModal &&
            <div className="cell large-6 medium-6 small-12">
              <CardsList
                member={member}
                asyncAction={asyncAction}
                isEmbedded
              />
            </div>
          }
          {
            isModal &&
            <CardsList
              member={member}
              asyncAction={asyncAction}
              isEmbedded
            />
          }
        </div>
      </div>
    );
  }

  return (
    <FormContainer
      form="assignPlans"
      record={{
        stripePlanId,
        stripeCouponId,
      }}
      submit={(results, actions, notifications) => { // eslint-disable-line
        const {
          stripeCouponId: couponId,
          stripePlanId: planId,
        } = results;
        const planDidChange = planId !== stripePlanId;
        const couponDidChange = couponId !== stripeCouponId;

        if (planDidChange) {
          actions.asyncAction('assignPlan', {
            memberId,
            planId,
          }, null, (planErr) => {
            if (planErr) {
              notifications.error('Error Occurred Setting Plan');
            } else {
              notifications.success('Successfully Set Plan');

              if (couponDidChange) {
                actions.asyncAction('assignCoupon', {
                  memberId,
                  couponId,
                }, null, (couponErr) => {
                  if (couponErr) {
                    notifications.error('Error Occurred Applying Coupon');
                  } else {
                    notifications.success('Successfully Applied Coupon');
                    if (isModal) close();
                  }
                });
                return;
              }
              if (isModal) close();
            }
          });
        }
      }}
      renderProps={() => {
        const filteredPlans = plans.filter(plan => plan.active);
        const activePlanOptions = filteredPlans.map(plan => ({
          title: `${plan.nickname} ($${(plan.amount / 100).toFixed(2)} / ` +
            `${plan.interval === 'year' ? 'yr.' : 'mo.'})`,
          value: plan.id,
        }));
        const couponOptions = coupons.map((coupon) => {
          const {
            id,
            percent_off: percentOff,
            duration,
            duration_in_months: durationInMonths,
          } = coupon;
          const monthsPlurality = duration === 'repeating' && durationInMonths === 1 ?
            'month' :
            'months';
          let title = `${id} (${percentOff}% off `;
          title += duration === 'forever' ? 'forever)' : 'for ';
          title += duration === 'repeating' ? `${durationInMonths} ${monthsPlurality})` : '';

          return {
            title,
            value: coupon.id,
          };
        });

        return (
          <div className="grid-container">
            <div
              className={classNames({
                'grid-x': true,
                'grid-padding-x': !isModal,
                'grid-padding-y': true,
                'align-center': true,
              })}
            >
              <div className={contentCellClassNames}>
                {
                  !isModal &&
                  <Link to="/guild/members">
                    <span style={{ fontSize: '200%', marginRight: '5px' }}>
                      &#8249;
                    </span>
                    <em>Back to Members Directory</em>
                  </Link>
                }
                <h2>Set Subscription</h2>
              </div>
              <div className={contentCellClassNames}>
                <div className="grid-x grid-padding-x">
                  <Field
                    name="stripePlanId"
                    label="Subscription Plan"
                    placeholder="choose a plan"
                    component={SelectField}
                    validator={[required]}
                    options={activePlanOptions}
                    containerClass="cell large-6 medium-6"
                  />
                  <Field
                    name="stripeCouponId"
                    label="Coupon"
                    placeholder="apply a coupon"
                    component={SelectField}
                    options={couponOptions}
                    containerClass="cell large-6 medium-6"
                  />
                  <div className="cell">
                    <button type="submit" className="button">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

AssignPlansForm.propTypes = {
  member: PropTypes.shape({
    _id: PropTypes.string,
    stripeCustomerId: PropTypes.string,
    stripePlanId: PropTypes.string,
    stripeCouponId: PropTypes.string,
  }).isRequired,
  plans: PropTypes.arrayOf(PropTypes.shape({})),
  coupons: PropTypes.arrayOf(PropTypes.shape({})),
  asyncAction: PropTypes.func,
  isModal: PropTypes.bool,
  close: PropTypes.func,
};

AssignPlansForm.defaultProps = {
  plans: [],
  coupons: [],
  asyncAction: () => {},
  isModal: false,
  close: () => {},
};

export default AssignPlansForm;
