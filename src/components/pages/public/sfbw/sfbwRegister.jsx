import { Field } from 'redux-form';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import { TextField, FileStackField } from '../../../common/form/inputs/index';
import { email, required, minLength6 } from '../../../common/form/validations/index';
import FormContainer from '../../../common/form/formContainer';

class Register extends React.Component {
  state = {
    error: '',
  };

  render() {
    const { asyncAction } = this.props;
    const { error } = this.state;

    return (
      <FormContainer
        form="register"
        submit={({
          email,
          password,
          confirmPassword,
          company,
          image,
        }) => {
          if (password !== confirmPassword) {
            const errorMessage = 'The passwords do not match.';
            this.setState({ error: errorMessage });
            return;
          }
          asyncAction('registerAgent', {
              email,
              password,
            company: {
                name: company,
                image,
            },
          }, null, (err) => {
            if (err) {
              const errorMessage = 'An unknown error has occurred.';
              this.setState({ error: errorMessage });
            }
          });
        }}
        renderProps={() => (
          <div className="grid-x">
            {error &&
              <div
                style={{ color: 'red' }}
              >
                {error}
              </div>
            }
            <Field
              name="email"
              label="Email Address"
              type="email"
              component={TextField}
              validate={[required, email]}
              placeholder="enter email address"
              containerClass="cell"
            />
            <Field
              name="password"
              label="Password"
              type="password"
              component={TextField}
              validate={[required, minLength6]}
              placeholder="enter password"
              containerClass="cell"
            />
            <Field
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              component={TextField}
              validate={[required, minLength6]}
              placeholder="enter password again"
              containerClass="cell"
            />
            <Field
              name="company"
              label="Company Name"
              type="text"
              component={TextField}
              validate={[required]}
              placeholder="Company Name"
              containerClass="cell"
            />
            <Field
              name="image"
              label="Company Logo"
              component={FileStackField}
              containerClass="cell"
              description="800 x 800 px minimum. File types jpg - png. Circle logo recommended, clipped out on a transparent png"
              options={{
                imageMax: [1600, 1600],
                imageMin: [800, 800],
                transformations: {
                  crop: {
                    aspectRatio: 1,
                    force: true,
                  },
                },
              }}
            />
            <div className="cell">
              <button className="button sfbwRegister" style={{ marginRight: '1em' }}>
                Sign Up
              </button>
            </div>
            <div className="options">
              <h6>Already have an account? <Link to="/login/sfbw">Log In Here</Link></h6>
            </div>
          </div>
        )}
      />
    );
  }
}

Register.propTypes = {
  asyncAction: PropTypes.func.isRequired,
};

export default Register;
