import crudAction from './default/crudAction';
import asyncAction from './async/asyncAction';

export default {
  crudAction,
  asyncAction,

  plans({ type, data }) {
    switch (type) {
      case 'SET_PLANS':
        return {
          type: 'SET_PLANS',
          items: data.items,
        };
      default:
        return {};
    }
  },
  coupons({ type, data }) {
    switch (type) {
      case 'SET_COUPONS':
        return {
          type: 'SET_COUPONS',
          items: data.items,
        };
      default:
        return {};
    }
  },
};

