const isDevelopment = process.env.NODE_ENV === 'development';
const hostname = isDevelopment ? 'http://localhost:3001' : '';

// accounts for development environment
const url = path => hostname + path;

// initializes with action type and store section affected, activated with status and bool
const status = (type, section) => (stat, bool) => ({
  type,
  section,
  status: stat,
  bool,
});

// initializes with action type and activated with a pkg
const success = type => pkg => ({
  type,
  pkg,
});

// initializes with action type and affected form, activated with error pkg {err:{...}}
const error = (type, form) => pkg => ({
  type,
  meta: { form },
  payload: { syncErrors: pkg.err },
});

const options = method => pkg => ({
  method,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('pi'),
  },
  body: pkg ? JSON.stringify(pkg) : undefined,
});

const actions = {
  authorize: {
    url: url('/api/v1/auth'),
    status: status('USERS_STATUS', 'auth'),
    success: success('AUTHORIZE_USER'),
    error: error('@@redux-form/UPDATE_SYNC_ERRORS', 'login'),
    options: options('POST'),
  },
  registerAgent: {
    url: url('/api/v1/registerAgent'),
    status: status('USERS_STATUS', 'auth'),
    success: success('AUTHORIZE_USER'),
    options: options('POST'),
  },
  token: {
    url: url('/api/v1/token'),
    status: status('USERS_STATUS', 'auth'),
    success: success('AUTHORIZE_USER'),
    options: options('GET'),
  },
  newLocation: {
    url: url('/api/v1/locations'),
    status: status('POST_LOCATION', 'locations'),
    // success: success('INSERT_LOCATION'),
    success: success('POST_LOCATIONS_SUCCESS'),
    options: options('POST'),
  },
  editLocation: {
    url: url('/api/v1/locations'),
    status: status('PUT_LOCATION', 'locations'),
    success: success('EDIT_LOCATION'),
    options: options('PUT'),
  },
  deleteLocation: {
    url: url('/api/v1/locations'),
    status: status('DELETE_LOCATION', 'locations'),
    // success: success('REMOVE_LOCATION'),
    success: success('DELETE_LOCATIONS_SUCCESS'),
    options: options('DELETE'),
  },
  createUser: {
    url: url('/api/v1/users'),
    status: status('CREATE_USER', 'users'),
    success: success('POST_USERS_SUCCESS'),
    options: options('POST'),
  },
  inviteUser: {
    url: url('/api/v1/users-invite'),
    status: status('INVITE_USER', 'auth'),
    success: success('USER_INVITED'),
    options: options('POST'),
  },
  newUser: {
    url: url('/api/v1/users-register'),
    status: status('USER_STATUS', 'auth'),
    success: success('AUTHORIZE_USER'),
    options: options('POST'),
  },
  updateUser: {
    url: url('/api/v1/users'),
    status: status('UPDATE_USER', 'users'),
    success: success('PUT_USERS_SUCCESS'),
    options: options('PUT'),
  },
  deleteUser: {
    url: url('/api/v1/users'),
    status: status('DELETE_USER', 'users'),
    success: success('DELETE_USERS_SUCCESS'),
    options: options('DELETE'),
  },
  newEvent: {
    url: url('/api/v1/events'),
    status: status('POST_EVENT', 'events'),
    success: success('ADD_EVENT'),
    options: options('POST'),
  },
  editEvent: {
    url: url('/api/v1/events'),
    status: status('PUT_EVENT', 'events'),
    success: success('UPDATE_EVENT'),
    options: options('PUT'),
  },
  deleteEvent: {
    url: url('/api/v1/events'),
    status: status('DELETE_EVENT', 'events'),
    success: success('REMOVE_EVENT'),
    options: options('DELETE'),
  },
  createPlan: {
    url: url('/api/v1/plans'),
    status: status('CREATE_PLAN', 'plans'),
    success: success('PLAN_CREATED'),
    options: options('POST'),
  },
  updatePlan: {
    url: url('/api/v1/plans'),
    status: status('UPDATE_PLAN', 'plans'),
    success: success('PLAN_UPDATED'),
    options: options('PUT'),
  },
  deletePlan: {
    url: url('/api/v1/plans'),
    status: status('DELETE_PLAN', 'plans'),
    success: success('PLAN_DELETED'),
    options: options('DELETE'),
  },
  assignPlan: {
    url: url('/api/v1/plans-assign'),
    status: status('ASSIGN_PLAN', 'plans'),
    success: success('PLAN_ASSIGNED'),
    options: options('PUT'),
  },
  // updateCardDetails: {
  //   url: url('/api/v1/plans-update-payment'),
  //   status: status('UPDATE_CARD_DETAILS', 'plans'),
  //   success: success('CARD_DETAILS_UPDATED'),
  //   options: options('PUT'),
  // },
  addCard: {
    url: url('/api/v1/cards'),
    status: status('POST_CARD', 'cards'),
    success: success('ADD_CARD'),
    options: options('POST'),
  },
  setPrimaryCard: {
    url: url('/api/v1/cards-default'),
    status: status('PUT_CARD_DEFAULT', 'cards'),
    success: success('DEFAULT_CARD'),
    options: options('PUT'),
  },
  deleteCard: {
    url: url('/api/v1/cards'),
    status: status('DELETE_CARD', 'cards'),
    success: status('REMOVE_CARD'),
    options: options('DELETE'),
  },
  createCoupon: {
    url: url('/api/v1/coupons'),
    status: status('CREATE_COUPON', 'coupons'),
    success: success('COUPON_CREATED'),
    options: options('POST'),
  },
  assignCoupon: {
    url: url('/api/v1/coupons-assign'),
    status: status('ASSIGN_COUPON', 'coupons'),
    success: success('COUPON_ASSIGNED'),
    options: options('PUT'),
  },
  deleteCoupon: {
    url: url('/api/v1/coupons'),
    status: status('DELETE_COUPON', 'coupons'),
    success: success('COUPON_DELETED'),
    options: options('DELETE'),
  },
  getAllPublicEvents: {
    url: url('/api/v1/publicEvents-all'),
    status: status('PUBLICEVENTS_STATUS', 'list'),
    success: success('GET_PUBLICEVENTS_SUCCESS'),
    options: options('GET'),
  },
  getAllPublicEventVersions: {
    url: url('/api/v1/publicEvents-all/version'),
    status: status('PUBLICEVENTVERSIONS_STATUS', 'list'),
    success: success('GET_PUBLICEVENTVERSIONS_SUCCESS'),
    options: options('GET'),
  },
  getPublicEventVersion: {
    url: url('/api/v1/publicEvents/version'),
    status: status('PUBLICEVENTVERSIONS_STATUS', 'list'),
    success: success('GET_PUBLICEVENTVERSIONS_SUCCESS'),
    options: options('GET'),
  },
  approvePublicEvent: {
    url: url('/api/v1/publicEvents/approve'),
    status: status('PUBLICEVENTVERSIONS_STATUS', 'list'),
    success: success('PUT_PUBLICEVENTVERSIONS_SUCCESS'),
    options: options('PUT'),
  },
  rejectPublicEvent: {
    url: url('/api/v1/publicEvents/reject'),
    status: status('PUBLICEVENTVERSIONS_STATUS', 'list'),
    success: success('PUT_PUBLICEVENTVERSIONS_SUCCESS'),
    options: options('PUT'),
  },
  resubmitPublicEvent: {
    url: url('/api/v1/publicEvents'),
    status: status('PUBLICEVENTS_STATUS', 'list'),
    success: success('PUT_PUBLICEVENTS_SUCCESS'), // PUT to replace the old entry
    options: options('POST'), // yes, this is a POST type
  },
  adminUpdatePublicEvent: {
    url: url('/api/v1/publicEvents-admin'),
    status: status('PUBLICEVENTS_STATUS', 'list'),
    success: success('PUT_PUBLICEVENTS_SUCCESS'),
    options: options('PUT'),
  },
};

const asyncAction = (key, pkg, query = '', cb) => (dispatch) => {
  const newAction = actions[key];
  dispatch(newAction.status('loading', true));
  dispatch(newAction.status('error', false));
  fetch(newAction.url + (query ? `?${query}` : ''), newAction.options(pkg))
    .then((response) => {
      dispatch(newAction.status('loading', false));

      if (response.ok) {
        response.json().then((data) => {
          dispatch(newAction.success(data));
          if (cb) {
            cb(null, data);
          }
        });
      } else {
        response.json().then((data) => {
          if (newAction.error) {
            dispatch(newAction.error(data));
          } else {
            if (isDevelopment) { // eslint-disable-line no-lonely-if
              console.log('No error handling given for async action'); // eslint-disable-line
            }
          }
          if (cb) {
            cb(data || { err: 'could not handle async action' });
          }
        });
      }
    })
    // figure out how to deal with server error
    .catch((error) => { // eslint-disable-line
      if (cb) {
        cb({ err: error });
      }
    });
};

export default asyncAction;
