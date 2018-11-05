/* eslint-disable */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { bindActionCreators } from 'redux';

import urlParams from '../../../helpers/queryParams';
import actions from '../../../redux/actions';
import FormContainer from '../../common/form/formContainer';
import Loading from '../../common/loading/loading';
import { TextField } from '../../common/form/inputs';
import { required, minLength6 } from '../../../helpers/validations';
import {BeerLogoWide} from '../../../assets/logoWide';

class Register extends React.Component {
	state = {
		error:'',
	};

	_onSubmit({ email, password, confirmPassword }) {
		console.log('actions : ', this.props.actions);

		const { asyncAction } = this.props.actions;
		const { history } = this.props;

		if(password !== confirmPassword){
			this.setState({ error: "Password Fields Must Match" });
			return;
		}

		const pkg = {
			email,
			password,
		};

		asyncAction(
			'newUser',
			{ pkg },
			"",
			(err,user) => {
				if(user && !err){
					history.push('/dashboard')
				} else {
					if(err && err.email === 'unique') {
						this.setState({ error:"This Email Has Already Been Registered" });
					} else if(err && err.custom) {
						this.setState({ error:err.custom });
					} else {
						this.setState({ error:"Unknown Error has Occurred" });
					}
				}
			}
		)
	}

	render(){
		const queryParams = urlParams();
		const { email } = queryParams;
		const { loading } = this.props.users.auth;
		const { error } = this.state;

		if(loading) {
			return (
				<Loading inline />
			)
		} else if(!email) {
			return (
				'An Error Has Occurred'
			);
		} else {
			return (
				<section className="register">
					<h2>You Have Been Invited to Join the SF Brewers Guild!</h2>
	        <p>
	          Your signup email is <i>{email}</i>
	        </p>

	        {error &&
            <div
              style={{ color: 'red' }}
            >
              {error}
            </div>
          }

					<div className="grid-container">
						<FormContainer
              submit={({
                password,
                confirmPassword,
              }) => {
              	this._onSubmit({ email, password, confirmPassword });
              }}
              renderProps={() => (
                <div className="grid-x grid-margin-x">
                  <Field
                    name="password"
                    component={TextField}
                    validate={[required,minLength6]}
                    label="Password"
                    type="password"
                    containerClass="cell large-4"
                  />

                  <Field
                    name="confirmPassword"
                    component={TextField}
                    validate={[required,minLength6]}
                    label="Confirm Password"
                    type="password"
                    containerClass="cell large-4"
                  />

                  <div className="cell">
                    <button className="button">Register</button>
                  </div>
                </div>
              )}
            />
					</div>
				</section>
			)
		}
	}
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

export default withRouter(connect (
  mapStateToProps,
  mapDispatchToProps
)(Register))
