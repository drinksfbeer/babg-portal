import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import fileDownload from 'js-file-download';
import swal from 'sweetalert';

import { fetchPromise } from '../../../../helpers/fetchApi';
import Loading from '../../../common/loading/loading';

const hostname = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';

class FormSubmissions extends React.Component {
  state = {
    loading: false,
    submissions: [],
  }

  componentDidMount() {
    this.fetchSubmissions();
  }

  fetchSubmissions() {
    const { match: { params: { id } } } = this.props;
    this.setState({ loading: true });
    fetchPromise({
      url: `/api/v1/submissions?formUuid=${id}`,
    }).then(submissions => this.setState({ submissions, loading: false }))
      .catch((error) => {
        console.log(error); // eslint-disable-line
        this.setState({ loading: false });
      });
  }

  async downloadCSV() {
    const {
      match: {
        params: {
          id,
        },
      },
    } = this.props;

    try {
      const response = await axios.get(`${hostname}/api/v1/submissions-export`, {
        params: {
          formUuid: id,
        },
      });

      // get file name from response headers
      // (EDIT: jk--atm, CORS doesn't allow the `Content-Disposition` header to appear)
      // const contentDisposition = response.headers['content-disposition'];
      // console.log('response:', response); // eslint-disable-line
      // console.log('contentDisposition:', contentDisposition); // eslint-disable-line
      // const fileName = contentDisposition.slice(contentDisposition.indexOf('filename='));
      const fileName = `${id}-${Date.now()}.csv`;

      // initiate download
      fileDownload(response.data, fileName);
    } catch (error) {
      swal({
        title: 'Failed to export to CSV.',
        text: JSON.stringify(error),
      });
    }
  }

  render() {
    const { loading, submissions } = this.state;
    return (
      <div className="grid-container">
        <div className="grid-x grid-padding-x grid-padding-y">
          <div
            className="cell"
            style={{
              paddingTop: '2em',
              paddingBottom: '0',
              textAlign: 'right',
            }}
          >
            <button
              className="button small"
              onClick={() => this.downloadCSV()}
            >
              Export to CSV
            </button>
          </div>
          <div className="cell">
            {loading && <Loading />}
            <div className="grid-x grid-padding-x grid-padding-y grid-margin-x grid-margin-y">
              {submissions.map((submission) => {
                const { results: rawResults } = submission;
                const resultsList = Object.keys(rawResults);
                return (
                  <div
                    key={submission._id}
                    className="app-item cell"
                  >
                    <div
                      style={{
                        color: 'grey',
                        fontStyle: 'italic',
                      }}
                    >
                      Submitted: {moment(submission.created).format('LLL')}
                    </div>
                    {resultsList.map((rawResult) => {
                      const resultValue = rawResults[rawResult];

                      return (
                        <div
                          key={rawResult}
                          className="grid-x"
                          style={{
                              borderBottom: 'solid rgba(0, 0, 0, 0.1) 1px',
                              margin: '3px 0px',
                          }}
                        >
                          <div className="cell large-2 medium-2">
                            <strong>{rawResult}:</strong>
                          </div>
                          <div className="cell large-10 medium-10">
                            {(() => {
                              switch (typeof resultValue) {
                                case 'number': return moment(resultValue).format('LLL');
                                case 'boolean': return resultValue ? 'Yes' : 'No';
                                default: return resultValue;
                              }
                            })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FormSubmissions.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default FormSubmissions;
