import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import swal from 'sweetalert';

import AdminFormHeaderItem from '../../../forms/header/adminFormHeaderItem';

const deletePlan = async ({
  asyncAction,
  crudAction,
  notifications,
  userId,
  plan,
}) => {
  const confirmation = await swal({
    title: 'Really delete this plan?',
    text: `"${plan.nickname}" will be permanently deleted and no members will be able ` +
      'to be subscribed to this plan again.\n\nAdditionally, all currently ' +
      'subscribed members will be removed from this plan and be automatically ' +
      'refunded their prorated amounts.',
    buttons: ['Cancel', 'Yes, delete it!'],
    dangerMode: true,
  });
  if (!confirmation) return; // eslint-disable-line
  asyncAction('deletePlan', {
    adminId: userId,
    planId: plan.id,
  }, null, (err, response) => {
    if (err || !response) {
      notifications.error('Error Occurred Deleting Plan');
    } else {
      notifications.success('Successfully Deleted Plan');
      crudAction({ resource: 'members' });
    }
  });
};

const PlansList = ({
  userId,
  plans,
  asyncAction,
  crudAction,
  success,
  error,
}) => {
  const alphabeticalPlans = plans.sort((a, b) => a.nickname > b.nickname);

  return (
    <div className="grid-container fluid">
      <div className="grid-x grid-margin-y grid-margin-x grid-padding-y">
        <AdminFormHeaderItem
          title="Subscription Plans"
          containerStyle={{ marginBottom: '0' }}
          materialIcon="assignment"
        />
        <div
          className="cell"
          style={{
            marginTop: '0',
            // marginBottom: '0',
            paddingTop: '0',
            paddingBottom: '0',
          }}
        >
          <Link to="/subscriptions/plans/new">
            <button className="button small">
              New Plan
            </button>
          </Link>
        </div>
      </div>
      <div className="grid-x grid-margin-y grid-margin-x grid-padding-x grid-padding-y large-up-3">
        {alphabeticalPlans.map(plan => (
          <div
            key={plan.id}
            className={classNames({
              cell: true,
              'app-item': true,
              planListItem: true,
              active: plan.active,
              inactive: !plan.active,
            })}
          >
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                fontSize: '200%',
                color: 'rgba(0, 0, 0, 0.7)',
                lineHeight: '100%',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={() => deletePlan({
                asyncAction,
                crudAction,
                notifications: {
                  success,
                  error,
                },
                userId,
                plan,
              })}
            >
              &times;
            </div>
            <Link to={`/subscriptions/plan/${plan.id}`}>
              <div className="nickname">
                {plan.nickname}
              </div>
              <div>
                ${(plan.amount / 100).toFixed(2)} / {plan.interval === 'year' ? 'yr.' : 'mo.'}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

PlansList.propTypes = {
  userId: PropTypes.string,
  plans: PropTypes.arrayOf(PropTypes.shape({})),
  crudAction: PropTypes.func,
  asyncAction: PropTypes.func,
  success: PropTypes.func,
  error: PropTypes.func,
};

PlansList.defaultProps = {
  userId: '',
  plans: [],
  crudAction: () => {},
  asyncAction: () => {},
  success: () => {},
  error: () => {},
};

export default PlansList;
