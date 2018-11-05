import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import { TextField, SelectField } from '../../../common/form/inputs/index';
import { required } from '../../../common/form/validations/index';
import FormContainer from '../../../common/form/formContainer';

const roleTypeEnums = {
  traditionalMember: 'Traditional Member',
  superMember: 'Super Member',
  lightMember: 'Light Member',
};

class AdminCreateUser extends React.Component {
  state = {
    roleType: roleTypeEnums.traditionalMember,
    userAdded: false,
  };

  render() {
    const roleTypeOptions = Object.keys(roleTypeEnums).map(key => (
      {
        title: roleTypeEnums[key],
        value: key,
      }
    ));

    const { error, roleType, userAdded } = this.state;
    const { asyncAction, member } = this.props;

    return (
      <div className="">
        <div className="grid-container">
          <div className="grid-x grid-padding-x grid-padding-y align-center">
            <div className="cell large-8 medium-10 small-11">
              <Link
                to={`/member/${this.props.member._id}/users`}
              >
                <span style={{ fontSize: '200%', marginRight: '5px' }}>&#8249;</span>
                <em>Back to User Directory</em>
              </Link>
              <h2>Add New User</h2>
            </div>

            <div className="cell large-8 medium-10 small-11">
              {
                !userAdded &&
                (
                  <FormContainer
                    submit={({
                      email,
                    }) => {
                      asyncAction('inviteUser', {
                        memberId: member.uuid,
                        email,
                        roleType,
                      }, null, (err) => {
                        if (err) {
                          this.setState({ error: 'Error Has Occurred With Adding New User' });
                        }
                      });
                    }}
                    renderProps={() => (
                      <div className="grid-x grid-margin-x">
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
                          label="Email"
                          type="text"
                          containerClass="cell large-4"
                        />

                        <SelectField
                          containerClass="cell large-4"
                          label="Role Type"
                          placeholder="Choose role type..."
                          options={roleTypeOptions}
                          input={{
                            value: roleType,
                            onChange: newVal => this.setState({
                              roleType: newVal,
                            }),
                          }}
                        />

                        <div className="cell">
                          <button className="button">Submit</button>
                        </div>
                      </div>
                    )}
                  />
                )
              }

              {
                userAdded &&
                (
                  <div>
                    <i>User has been added</i>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AdminCreateUser.propTypes = {
  member: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  }).isRequired,
  asyncAction: PropTypes.func.isRequired,
};

AdminCreateUser.defaultProps = {};

export default AdminCreateUser;
