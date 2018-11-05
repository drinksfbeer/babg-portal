const crudState = () => ({
  list: {
    _list: [],
    loading: false,
    error: false,
    success: false,
  },
  form: {
    loading: false,
    error: false,
    success: false,
  },
  update: {
    loading: false,
    error: false,
    success: false,
  },
  delete: {
    loading: false,
    error: false,
    success: false,
  },
});

const initialState = {
  events: crudState(),
  pages: crudState(),
  SFBWpages: crudState(),
  SFBWsponsors: crudState(),
  blogPosts: crudState(),
  chapters: crudState(),
  members: crudState(),
  forms: crudState(),
  plans: [],
  coupons: [],
  locations: crudState(),
  notifications: crudState(),
  announcements: crudState(),
  settings: crudState(),
  publicEvents: crudState(),
  publicEventVersions: crudState(),
  // locations is empty for now, draw locations from member's locations to avoid too much fetching
  users: {
    ...crudState(),
    ...{
      auth: {
        user: null,
        authorized: false,
        loading: false,
        error: false,
      },
      locations: {
        loading: false,
        error: false,
      },
    },
  },

};

export default initialState;
