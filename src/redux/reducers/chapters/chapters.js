import initialState from '../../initialState';

import crudReducers from '../default/crudReducer';

// const isDevelopment = process.env.NODE_ENV === 'development';
const chapterCrudReducer = crudReducers('chapters');
const chapters = (state = initialState.chapters, action) => { // eslint-disable-line
  // if (isDevelopment) console.log(action); // eslint-disable-line
  return chapterCrudReducer(state, action);
};

export default chapters;
