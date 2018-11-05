import initialState from '../../initialState';

import crudReducers from '../default/crudReducer';

const formCrudReducer = crudReducers('forms');
const forms = (state = initialState.forms, action) => { // eslint-disable-line
  switch (action.type) {
    default:
      return formCrudReducer(state, action);
  }
};

export default forms;
