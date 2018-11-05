import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

import AdminFormHeaderItem from '../../../forms/header/adminFormHeaderItem';

const renderCouponDescriptionText = (coupon) => {
  const {
    percent_off: percentOff,
    duration,
    duration_in_months: durationInMonths,
  } = coupon;
  const monthsPlurality = duration === 'repeating' && durationInMonths === 1 ?
    'month' :
    'months';
  let description = `${percentOff}% off `;
  description += duration === 'forever' ? 'forever' : 'for ';
  description += duration === 'repeating' ? `${durationInMonths} ${monthsPlurality}` : '';

  return description;
};

const deleteCoupon = async (asyncAction, id) => {
  const confirmation = await swal({
    title: 'Really delete this coupon?',
    text: 'Deleting this coupon will not remove it from previously applied subscriptions ' +
      'until the next billing cycle of each member.',
    buttons: ['Cancel', 'Yes, delete it!'],
    dangerMode: true,
  });
  if (confirmation) {
    asyncAction('deleteCoupon', {
      id,
    }, null, (err) => {
      if (err) {
        swal({
          title: 'An error occurred while deleting this coupon.',
          text: JSON.stringify(err),
        });
      } else {
        swal({ title: 'Coupon deleted successfully!' });
      }
    });
  }
};

const CouponsList = ({ coupons, asyncAction }) => {
  const alphabeticalCoupons = coupons.sort((a, b) => a.nickname > b.nickname);

  return (
    <div className="grid-container fluid">
      <div className="grid-x grid-margin-x grid-margin-y grid-padding-y">
        <AdminFormHeaderItem
          title="Coupons"
          containerStyle={{ marginBottom: '0' }}
          materialIcon="card_giftcard"
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
          <Link to="/subscriptions/coupons/new">
            <button className="button small">
              New Coupon
            </button>
          </Link>
        </div>
      </div>
      <div className="grid-x grid-margin-y grid-margin-x grid-padding-x grid-padding-y large-up-3">
        {alphabeticalCoupons.map(coupon => (
          <div key={coupon.id} className="cell app-item planListItem">
            {/* <Link to={`/subscriptions/coupon/${coupon.id}`}> */}
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
              onClick={() => deleteCoupon(asyncAction, coupon.id)}
            >
              &times;
            </div>
            <div className="nickname">
              {coupon.id}
            </div>
            <div>
              {renderCouponDescriptionText(coupon)}
            </div>
            {/* </Link> */}
          </div>
        ))}
      </div>
    </div>
  );
};

CouponsList.propTypes = {
  coupons: PropTypes.arrayOf(PropTypes.shape({})),
  asyncAction: PropTypes.func,
};

CouponsList.defaultProps = {
  coupons: [],
  asyncAction: () => {},
};

export default CouponsList;
