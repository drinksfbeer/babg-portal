import initialState from '../../initialState';
import crudReducers from '../default/crudReducer';

const announcementCrudReducer = crudReducers('announcements');
const announcements = (state = initialState.announcements, action) => { // eslint-disable-line
  // override default `executePostResourceSuccess()` since it pushes `pkg` at the end of `_list`
  // since we order announcements by `created` in desc order, we add `pkg` to the beginning
  if (action.type === 'POST_ANNOUNCEMENTS_SUCCESS') {
    const newState = state;
    newState.list.success = true;
    newState.list._list.splice(0, 0, action.pkg); // instead of `push()`
    return { ...state, newState };
  }

  return announcementCrudReducer(state, action);
};

export default announcements;
