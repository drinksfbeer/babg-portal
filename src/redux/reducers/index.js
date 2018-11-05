import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { reducer as snacks } from 'react-notification-system-redux';

import users from './users/users';
import chapters from './chapters/chapters';
import members from './members/members';
import plans from './plans/plans';
import coupons from './coupons/coupons';
import locations from './locations/locations';
import events from './events/events';
import pages from './pages/pages';
import notifications from './notifications/notifications';
import announcements from './announcements/announcements';
import forms from './forms/forms';
import blogPosts from './blogPosts/blogPosts';
import settings from './settings/settings';
import SFBWpages from './SFBWpages/SFBWpages';
import SFBWsponsors from './SFBWsponsors/SFBWsponsors';
import publicEvents from './publicEvents/publicEvents';
import publicEventVersions from './publicEventVersions/publicEventVersions';

const rootReducer = combineReducers({
  users,
  form, // this is redux form
  snacks,
  members,
  plans,
  coupons,
  chapters,
  locations,
  events,
  pages,
  SFBWpages,
  SFBWsponsors,
  blogPosts,
  notifications,
  forms, // this is the form builder stuff
  announcements,
  settings,
  publicEvents,
  publicEventVersions,
});

export default rootReducer;
