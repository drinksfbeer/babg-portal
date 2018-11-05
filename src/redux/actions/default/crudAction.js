const hostname = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';

const storeType = {
  get: 'list',
  post: 'form',
  put: 'update',
  delete: 'delete',
};

const crudActionator = (type, resource) => ({
  url(query = '') {
    return `${hostname}/api/v1/${resource}${query ? `?${query}` : ''}`;
  },
  status(status, bool) {
    return {
      type: `${resource.toUpperCase()}_STATUS`,
      section: storeType[type.toLowerCase()],
      status,
      bool,
    };
  },
  success(data) {
    return {
      type: `${type.toUpperCase()}_${resource.toUpperCase()}_SUCCESS`,
      pkg: data,
    };
  },
  error(data) {
    return {
      type: '@@redux-form/UPDATE_SYNC_ERRORS',
      meta: {
        form: 'container',
      },
      payload: {
        syncErrors: data.err,
      },
    };
  },
});


// ex: {type:"put","resource:"articles",pkg:{_id:"..",changes:{..}}}
const crudAction = ({ type = 'get', resource, query }, pkg, callback) => (dispatch) => {
  const newAction = crudActionator(type, resource);
  dispatch(newAction.status('loading', true));
  dispatch(newAction.status('error', false));
  fetch(newAction.url(query), {
    method: type,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('pi'),
    },
    body: JSON.stringify(pkg),
  }).then((response) => {
    dispatch(newAction.status('loading', false));
    if (response.ok) {
      response.json().then((data) => {
        if (callback) {
          callback(null, data);
        }
        dispatch(newAction.success(data));
      });
    } else {
      response.json().then((data) => {
        if (callback) {
          callback(data);
        }
        dispatch(newAction.error(data));
      }).catch(err => console.log(err)); // eslint-disable-line
    }
  })
    .catch(error => console.log(error)); // eslint-disable-line
};


export default crudAction;
