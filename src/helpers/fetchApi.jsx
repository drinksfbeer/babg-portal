const HOST_NAME = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';

export const fetchApi = ({ url, body, method = 'GET' }, callback) => {
  const uri = HOST_NAME + url;
  fetch(uri, {
    method,
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        callback(null, data);
      });
    } else if (response.status === 400) {
      response.json().then((data) => {
        callback(data);
      });
    } else {
      callback({ err: 'response not ok' });
    }
  }).catch((error) => {
    console.log(error); // eslint-disable-line
    callback(error);
  });
};

export const fetchPromise = ({ url, body, method = 'GET' }) => new Promise((resolve, reject) => {
  const uri = HOST_NAME + url;
  fetch(uri, {
    method,
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        resolve(data);
      });
    } else if (response.status === 400) {
      response.json().then((data) => {
        reject({ err: data }); // eslint-disable-line
      });
    } else {
      reject({ err: 'response not ok' }); // eslint-disable-line
    }
  }).catch((error) => {
    console.log(error); // eslint-disable-line
    reject({ err: error }); // eslint-disable-line
  });
});
