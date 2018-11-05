import initialState from '../../initialState';

const coupons = (state = initialState.coupons, action) => { // eslint-disable-line
  let items;
  let foundIndex;
  let localState;

  switch (action.type) {
    case 'SET_COUPONS': {
      items = action.items || [];
      return [...items];
    }

    case 'COUPON_CREATED': {
      state.push(action.pkg);
      return [...state];
    }

    case 'COUPON_UPDATED': {
      localState = state;
      foundIndex = localState.findIndex(coupon => coupon.id === action.pkg.id);
      localState[foundIndex] = { ...action.pkg };
      return [...localState];
    }

    case 'COUPON_DELETED': {
      localState = state;
      foundIndex = localState.findIndex(coupon => coupon.id === action.pkg.id);
      if (~foundIndex) { // eslint-disable-line
        localState.splice(foundIndex, 1);
      }
      return [...localState];
    }

    default: {
      return [...state];
    }
  }
};

export default coupons;
