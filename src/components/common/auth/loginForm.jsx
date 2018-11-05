import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';

import FormContainer from '../../common/form/formContainer';
import { TextField } from '../../common/form/inputs/index';
import { required } from '../../common/form/validations/index';

class LoginForm extends React.Component {
  state = {
    error: '',
  }
  render() {
    const { asyncAction } = this.props;
    const { error } = this.state;

    return (
      <FormContainer
        submit={({ email, password }) => {
          asyncAction('authorize', {
            email,
            password,
          }, null, (err) => {
            if (err) {
              let errorMessage = 'An unknown error has occurred.';
              switch (err.err) {
                case 'unsupported_role': {
                  errorMessage = 'This account type is not supported yet.';
                  break;
                }

                case 'email_not_found': {
                  errorMessage = 'This account does not exist.';
                  break;
                }

                case 'incorrect_password': {
                  errorMessage = 'Password is incorrect.';
                  break;
                }

                default: break;
              }
              this.setState({ error: errorMessage });
            }
          });
        }}
        renderProps={() => (
          <div>
            {error &&
              <div
                style={{ color: 'red' }}
              >
                {error}
              </div>
            }
            <Field
              name="email"
              component={TextField}
              validate={[required]}
              label="email"
              type="text"
              containerClass="cell"
            />
            <Field
              name="password"
              component={TextField}
              validate={[required]}
              label="password"
              type="password"
              containerClass="cell"
            />
            <div>
              <button className="button" style={{ marginRight: '1em' }}>
                Log In
              </button>
              <Link className="inverted button" to="/forgot">
                Forgot Your Password?
              </Link>
            </div>
          </div>
        )}
      />
    );
  }
}

LoginForm.propTypes = {
  asyncAction: PropTypes.func.isRequired,
};

export default LoginForm;
