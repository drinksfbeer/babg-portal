import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import qs from 'qs';
import axios from 'axios';

import Loading from '../loading/loading';
import FormContainer from '../form/formContainer';
import { TextField } from '../form/inputs';
import { required, email } from '../form/validations';

const hostname = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';
const url = path => hostname + path;
const friendlyStatuses = {
  missing_parameters: 'An internal client error has occurred. Please try again later.',
  user_not_found: 'The email you have entered does not belong to any account.',
  token_currently_active: 'We have already emailed you your password reset instructions.',
  token_generation_error: 'An internal server error has occurred. Please try again later.',
  token_expired: 'This reset request has expired. Please request a new one.',
  token_not_found: 'This is an invalid reset request. Please request a new one.',
  token_used: 'This reset request has already been fulfilled. Please request a new one.',
  default: 'An error has occurred. Please try again later.',
};

const generateToken = async (emailAddress) => {
  try {
    const response = await axios.post(url('/api/v1/users/forgot'), {
      email: emailAddress,
    });
    if (!response.data.status) {
      // any non-200 status code message will raise in exception (handled in catch block)
      return { success: false, ...response.data };
    }

    return { success: true };
  } catch (error) {
    // error: { response: { config, data: { err }, headers, request, status, statusText } }
    if (error.response.status === 400) {
      const { err } = error.response.data;
      const friendlyStatus = friendlyStatuses[err] || friendlyStatuses.default;
      return { success: false, err: friendlyStatus };
    }
    return { success: false, ...error };
  }
};

// if `newPassword` is left `null`, then the API will only verify the token
const verifyToken = async (token, newPassword) => {
  try {
    const response = await axios.post(url('/api/v1/users/verify'), { token, newPassword });
    if (response.data.status !== 'successful') {
      return { success: false, ...response.data };
    }

    return { success: true };
  } catch (error) {
    if (error.response.status === 400) {
      const { err } = error.response.data;
      const friendlyStatus = friendlyStatuses[err] || friendlyStatuses.default;
      return { success: false, err: friendlyStatus };
    }
    return { success: false, ...error };
  }
};

class Forgot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 'blank',
      token: '',
      message: '',
      errors: '',
    };
  }

  async componentDidMount() {
    const { authorized, history } = this.props;
    const { location } = history;

    if (authorized) {
      history.replace('/dashboard');
      return;
    }

    // check if user came from the password reset email
    // (since the route will have the `/forgot?token=...` part)
    if (location.search) {
      const { search } = location;
      const params = qs.parse(search.substr(1)); // char 0 is the '?'

      // check if ?token=... exists
      // (also a valid token is 80 chars in length)
      if (params.token && params.token.length === 80) {
        const { token } = params;
        await this.setStateAsync({ currentPage: 'loading' });

        // verify that the token is correct before showing user the new password page
        const verifyResult = await verifyToken(token);
        if (!verifyResult.success) { // token is invalid
          const errors = verifyResult.err ||
            verifyResult.message ||
            friendlyStatuses.default;
          history.replace('/forgot');
          this.setState({ // eslint-disable-line
            currentPage: 'emailForm',
            errors,
          });
        } else { // token is valid
          this.setState({ // eslint-disable-line
            currentPage: 'newPasswordForm',
            token,
          });
        }
      } else {
        // if not, boot them back to '/forgot' (i.e., clear the URL params)
        history.replace('/forgot');
      }

      return;
    }

    this.setState({ currentPage: 'emailForm' }); // eslint-disable-line
  }

  setStateAsync(state) {
    return new Promise(resolve => this.setState(state, resolve));
  }

  renderPage(page) {
    switch (page) {
      default:
      case 'blank': {
        return <div />;
      }

      case 'loading': {
        return (
          <div className="grid-x grid-padding-y">
            <div className="cell">
              <Loading inline />
            </div>
          </div>
        );
      }

      case 'message': {
        const { message } = this.state;

        return (
          <div className="grid-x grid-padding-y">
            <div className="cell">
              {message}
            </div>
          </div>
        );
      }

      case 'emailForm': {
        const { errors } = this.state;

        return (
          <div className="grid-x grid-padding-y">
            {
              !errors &&
              <div className="cell">
                Please enter the email address associated with the account you wish to recover.
              </div>
            }
            {
              errors &&
              <div className="cell" style={{ color: 'red' }}>
                {errors}
              </div>
            }
            <Field
              name="email"
              className="cell"
              component={TextField}
              type="text"
              label="email"
              placeholder="enter email"
              validate={[required, email]}
              containerClass="cell large-12 medium-12"
            />
            <div className="cell">
              <button className="button" type="submit" style={{ marginRight: '1em' }}>
                Submit
              </button>
              <Link className="inverted button" to="/login">
                Cancel
              </Link>
            </div>
          </div>
        );
      }

      case 'newPasswordForm': {
        const { errors } = this.state;

        return (
          <div className="grid-x grid-padding-y">
            {
              !errors &&
              <div className="cell">
                Almost done! Please enter in a new password.
              </div>
            }
            {
              errors &&
              <div className="cell" style={{ color: 'red' }}>
                {errors}
              </div>
            }
            <Field
              name="password"
              component={TextField}
              type="password"
              label="password"
              placeholder="enter password"
              validate={[required]}
              containerClass="cell large-12 medium-12"
            />
            <button className="button" type="submit">
              Save
            </button>
          </div>
        );
      }

      case 'complete': {
        return (
          <div className="grid-x grid-padding-y">
            <div className="cell" style={{ marginBottom: '1em' }}>
              All done! You can now log in with your new password.
            </div>
            <Link to="/login">
              <button className="button">
                Back to Login
              </button>
            </Link>
          </div>
        );
      }
    }
  }

  render() {
    const { history } = this.props;
    const { currentPage } = this.state;

    return (
      <FormContainer
        form="forgot"
        submit={async (values) => {
          switch (currentPage) {
            case 'emailForm': {
              await this.setStateAsync({ currentPage: 'loading' });
              const generateResult = await generateToken(values.email);
              if (!generateResult.success) {
                const errors = generateResult.err ||
                  generateResult.message ||
                  friendlyStatuses.default;
                this.setState({
                  currentPage: 'emailForm',
                  errors,
                });
              } else {
                this.setState({
                  currentPage: 'message',
                  message: `An email has been sent to ${values.email} with instructions ` +
                    'to reset your password!',
                  errors: '',
                });
              }
              break;
            }

            case 'newPasswordForm': {
              const { token } = this.state;
              const { password } = values;
              await this.setStateAsync({ currentPage: 'loading' });
              const resetResult = await verifyToken(token, password);
              if (!resetResult.success) {
                const errors = resetResult.err ||
                  resetResult.message ||
                  friendlyStatuses.default;
                this.setState({
                  currentPage: 'newPasswordForm',
                  errors,
                });
              } else {
                this.setState({
                  currentPage: 'complete',
                  message: '',
                  errors: '',
                });
              }
              break;
            }

            case 'completed': {
              history.replace('/login');
              break;
            }

            default: break;
          }
        }}
        renderProps={() => (
          <div
            className="grid-container"
            style={{
              paddingLeft: '0',
              paddingRight: '0',
            }}
          >
            {this.renderPage(currentPage)}
          </div>
        )}
      />
    );
  }
}

Forgot.propTypes = {
  authorized: PropTypes.bool,
  history: PropTypes.shape({}),
};

Forgot.defaultProps = {
  authorized: false,
  history: {},
};

export default connect(
  state => ({
    authorized: state.users.auth.authorized,
  }),
  null,
  null,
  { pure: false },
)(Forgot);
