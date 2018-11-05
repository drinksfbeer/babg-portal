import initialState from '../../initialState';

import crudReducers from '../default/crudReducer';

const blogPostCrudReducer = crudReducers('blogPosts');

const blogPosts = (state = initialState.blogPosts, action) => { // eslint-disable-line
  return blogPostCrudReducer(state, action);
};

export default blogPosts;
