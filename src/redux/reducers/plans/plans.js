import initialState from '../../initialState';

const plans = (state = initialState.plans, action) => { // eslint-disable-line
  let items;
  let foundIndex;
  let localState;

  switch (action.type) {
    case 'SET_PLANS': {
      items = action.items || [];
      return [...items];
    }

    case 'PLAN_CREATED': {
      state.push(action.pkg);
      return [...state];
    }

    case 'PLAN_UPDATED': {
      localState = state;
      foundIndex = localState.findIndex(plan => plan.id === action.pkg.id);
      localState[foundIndex] = { ...action.pkg };
      return [...localState];
    }

    case 'PLAN_DELETED': {
      localState = state;
      foundIndex = localState.findIndex(plan => plan.id === action.pkg.id);
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

export default plans;
