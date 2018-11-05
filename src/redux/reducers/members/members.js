import initialState from '../../initialState';
import crudReducers from '../default/crudReducer';

const memberCrudReducer = crudReducers('members');
const members = (state = initialState.members, action) => { // eslint-disable-line
  let newState;
  let index;

  switch (action.type) {
    // case 'CARD_DETAILS_UPDATED': {
    //   newState = state;
    //   index = newState.list._list.findIndex(member => member._id === action.pkg._id);
    //   newState.list._list[index] = { ...action.pkg };
    //   return { ...state, newState };
    // }

    case 'ADD_CARD':
    case 'DEFAULT_CARD': {
      newState = state;
      index = newState.list._list.findIndex(member => member._id === action.pkg._id);
      newState.list._list[index] = { ...action.pkg };
      return { ...state, newState };
    }

    case 'REMOVE_CARD': {
      newState = state;
      index = newState.list._list.findIndex(member => member._id === action.status._id);
      newState.list._list[index] = { ...action.status };
      return { ...state, newState };
    }

    case 'PLAN_ASSIGNED': {
      newState = state;
      index = newState.list._list.findIndex(member => member._id === action.pkg._id);
      newState.list._list[index] = { ...action.pkg };
      return { ...state, newState };
    }

    case 'COUPON_ASSIGNED': {
      newState = state;
      index = newState.list._list.findIndex(member => member._id === action.pkg._id);
      newState.list._list[index] = { ...action.pkg };
      return { ...state, newState };
    }

    default: {
      return memberCrudReducer(state, action);
    }
  }
};

export default members;
