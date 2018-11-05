import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import swal from 'sweetalert';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';
import FormContainer from '../../../common/form/formContainer';
import {
  TextField,
  SelectField,
  MultiSelectField,
} from '../../../common/form/inputs';
import { required, email } from '../../../../helpers/validations';
import { userRoles, userPermissions } from '../../../../refs/refs';

const AccountsForm = ({
  user: {
    _id: userId,
    role,
    memberUuid,
  },
  account,
  chapters,
  members,
  sponsors,
}) => (
  <FormContainer
    form="accounts"
    record={account}
    submit={async (results, actions, notifications) => {
      const payload = JSON.parse(JSON.stringify(results)); // deep-copy

      // do some object key clean-up depending on role
      // (accounting for the case, where, if the user selected the 'chapter' role, selected
      // a chapter, then changed role to 'member', then selected a member; both
      // `chapterUuid` and `memberUuid` will be present in `results`, which we don't want!)
      switch (payload.role) {
        case 'master': {
          if (!account) { // creating new account
            delete payload.chapterUuid;
            delete payload.memberUuid;
            delete payload.permissions;
          } else { // editing existiing account
            // if we deleted the keys while in edit mode, they'll simply be left alone!
            // (the API only updates the keys that are sent within the `pkg` object)
            payload.chapterUuid = null;
            payload.memberUuid = null;
            payload.permissions = [];
          }
          break;
        }

        case 'chapter': {
          if (!account) {
            delete payload.memberUuid;
            // chapter admin shouldn't have any configurable permissions!
            delete payload.permissions;
          } else {
            payload.memberUuid = null;
            payload.permissions = [];
          }
          break;
        }

        case 'enthusiast': {
          if (!account) {
            delete payload.memberUuid;
          } else {
            payload.memberUuid = null;
          }
          break;
        }

        case 'member':
        case 'staff': {
          if (!account) {
            delete payload.chapterUuid;
          } else {
            payload.chapterUuid = null;
          }
          break;
        }

        case 'agent': {
          if (Array.isArray(payload.permissions) && !payload.permissions.includes('sponsor')) {
            payload.sponsorId = null;
          }
          break;
        }

        default: break;
      }

      // check to make sure the passwords match
      // (if editing, if it's blank, that's totally okay since the validators are removed)
      if (payload.password !== payload.confirmPassword) {
        notifications.error('Passwords do not match!');
        return;
      }
      delete payload.confirmPassword;

      // confirm with the user that they willing to set the user's role as master admin
      const dangerouslySettingMaster = ((account && account.role !== 'master')
      && results.role === 'master') || (!account && results.role === 'master');
      if (dangerouslySettingMaster) {
        const confirmation = await swal({
          title: 'WARNING',
          text: 'You are about to promote this account a master admin. They will have ' +
            'full administrative access to the guild and can even delete your account!',
          icon: 'warning',
          buttons: ['Cancel', 'I Understand'],
          dangerMode: true,
        });
        if (!confirmation) return;
      }

      if (account) {
        // delete crap from the update payload
        delete payload.__v;
        delete payload._id;
        delete payload.id;
        delete payload.salt;
        delete payload.member;
        delete payload.created;
        delete payload.hasRegistered;
        delete payload.hasBeenInvited;
        if (JSON.stringify(account.permissions) === JSON.stringify(payload.permissions)) {
          // stringifying the array is the fastest way to check all elements
          // of an array -- hacky af, but it works luls
          // and if they don't end up equaling (e.g., elements are out of order),
          // it's not a big deal that the order updates in the db anyways
          delete payload.permissions;
        }
        if (account.email === payload.email) delete payload.email;
        if (account.role === payload.role) delete payload.role;
        if (account.chapterUuid === payload.chapterUuid) delete payload.chapterUuid;
        if (account.memberUuid === payload.memberUuid) delete payload.memberUuid;
        if (!payload.password) delete payload.password;

        // check if anything is left to update
        if (Object.keys(payload).length < 1) {
          notifications.error('There\'s nothing to update!');
          return;
        }

        // proceed with the update
        actions.asyncAction('updateUser', {
          adminId: userId,
          _id: account._id,
          pkg: payload,
        }, null, (err, response) => {
          if (err || !response) {
            if (err.err === 'email_in_use') {
              notifications.error('Email already exists, please enter another one.');
              return;
            }
            notifications.error('Error Occurred Creating User');
          } else {
            notifications.success('Successfully Updated User');
            actions.history.push('/accounts');
          }
        });
      } else {
        actions.asyncAction('createUser', {
          adminId: userId,
          pkg: payload,
        }, null, (err, response) => {
          if (err || !response) {
            if (err.err === 'email_in_use') {
              notifications.error('Email already exists, please enter another one.');
              return;
            }
            notifications.error('Error Occurred Creating User');
          } else {
            notifications.success('Successfully Created User');
            actions.history.push('/accounts');
          }
        });
      }
    }}
    renderProps={(values) => {
      const isMaster = role === 'master';
      const isChapter = role === 'chapter';
      const isMember = role === 'member';
      const isEditingSelf = account && userId === account._id;

      // display warning to user if they are setting the role as master admin
      const dangerouslySettingMaster = ((account && account.role !== 'master')
      && values.role === 'master') || (!account && values.role === 'master');

      const roleOptions = [];
      if (isMaster) {
        roleOptions.push({ value: 'master', title: userRoles.master });
      }
      if (isMaster || isChapter) {
        roleOptions.push({ value: 'chapter', title: userRoles.chapter });
      }
      if (isMaster || isChapter || isMember) {
        roleOptions.push({ value: 'member', title: userRoles.member });
      }
      roleOptions.push({ value: 'staff', title: userRoles.staff });
      if (isMaster) {
        roleOptions.push({ value: 'agent', title: userRoles.agent });
      }
      if (isMaster || isChapter) {
        roleOptions.push({ value: 'enthusiast', title: userRoles.enthusiast });
      }

      let permissionOptions = [];
      if (values.role) {
        permissionOptions = userPermissions
        .filter(permission => permission.roles.includes(values.role))
        .map(permission => ({
            value: permission.value,
            title: permission.label,
        }));
      }

      return (
        <div className="grid-container sectionPadding">
          <div className="grid-x grid-padding-x grid-padding-y align-center">
            <div className="cell ">
              <Link to="/accounts">
                <span style={{ fontSize: '200%', marginRight: '5px' }}>
                  &#8249;
                </span>
                <em>Back to Accounts</em>
              </Link>
              {/* <h2>
                {account ? 'Edit Account' : 'Create New Account'}
              </h2> */}
            </div>

            <AdminFormHeaderItem
              title={account ? 'Edit Account' : 'Create New Account'}
              materialIcon="person"
            />
            {
              isEditingSelf &&
              <div className="cell">
                <em style={{ color: '#C62828' }}>
                  <strong>Notice:</strong> Some settings are not editable since this
                  is the currently logged in account.
                </em>
              </div>
            }
            {
              account &&
              <div className="cell">
                <em>
                  <strong>Note:</strong> If you do not wish to change this account&#39;s
                  password, you may leave the password fields blank.
                </em>
              </div>
            }
            <div className="cell ">
              <div className="grid-x grid-padding-x grid-padding-y">
                <Field
                  name="email"
                  label="Email Address"
                  type="text"
                  component={TextField}
                  validate={[required, email]}
                  containerClass="cell large-12 medium-12"
                />
                <Field
                  name="password"
                  label="Password"
                  type="password"
                  component={TextField}
                  validate={account ? null : [required]}
                  containerClass="cell large-6 medium-6"
                />
                <Field
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  component={TextField}
                  validate={account && !values.password ? null : [required]}
                  containerClass="cell large-6 medium-6"
                />
                {
                  dangerouslySettingMaster &&
                  <div className="cell large-12 medium-12" style={{ textAlign: 'center' }}>
                    <em style={{ color: 'red' }}>
                      <strong>WARNING:</strong> You are about to promote this account to a&nbsp;
                      <u>MASTER ADMIN</u>. They will have full administrative access to the
                      guild and can even delete your account!
                    </em>
                  </div>
                }
                <Field
                  name="role"
                  label="Type"
                  placeholder="select account type"
                  component={SelectField}
                  options={roleOptions}
                  validate={[required]}
                  disabled={isEditingSelf}
                  containerClass="cell large-12 medium-12"
                />
                {
                  (!isEditingSelf && values.role && ['chapter', 'enthusiast'].includes(values.role)) &&
                  <Field
                    name="chapterUuid"
                    label="Chapter"
                    placeholder="select a chapter"
                    component={SelectField}
                    options={chapters.map(chapter => ({
                      value: chapter.uuid,
                      title: chapter.name,
                    }))}
                    validate={[required]}
                    containerClass="cell large-12 medium-12"
                  />
                }
                {
                  (!isEditingSelf && values.role && ['member', 'staff'].includes(values.role)) &&
                  <Field
                    name="memberUuid"
                    label="Member"
                    placeholder="select a member"
                    component={SelectField}
                    options={(() => {
                      let selectableMembers = [];
                      if (isMaster || isChapter) selectableMembers = members;
                      if (isMember) {
                        const userMember = members.find(member => member.uuid === memberUuid);
                        selectableMembers.push(userMember);
                      }
                      return selectableMembers.map(member => ({
                        value: member.uuid,
                        title: chapters.length > 0 ?
                          `${member.name} (${chapters.find(ch => ch.uuid === member.chapterUuid).name})` :
                          member.name,
                      })).sort((a, b) => {
                        if (a.title < b.title) return -1;
                        if (a.title > b.title) return 1;
                        return 0;
                      });
                    })()}
                    validate={[required]}
                    containerClass="cell large-12 medium-12"
                  />
                }
                {
                  (!isEditingSelf && values.role && permissionOptions.length > 0) &&
                  <Field
                    name="permissions"
                    label="Permissions"
                    placeholder="select granted permissions"
                    component={MultiSelectField}
                    options={permissionOptions}
                    containerClass="cell large-12 medium-12"
                  />
                }
                {
                  (Array.isArray(values.permissions) && values.permissions.includes('sponsor')) &&
                  <Field
                    name="sponsorId"
                    label="Sponsor"
                    placeholder="select a sponsor"
                    component={SelectField}
                    options={sponsors.map(sponsor => ({
                      title: `${sponsor.name} (${sponsor.level})`,
                      value: sponsor._id,
                    }))}
                    validate={[required]}
                    containerClass="cell large-12 medium-12"
                  />
                }
                <div className="cell">
                  <button type="submit" className="button">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }}
  />
);

AccountsForm.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    memberUuid: PropTypes.string,
  }).isRequired,
  account: PropTypes.shape({}),
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  members: PropTypes.arrayOf(PropTypes.shape({})),
  sponsors: PropTypes.arrayOf(PropTypes.shape({})),
};

AccountsForm.defaultProps = {
  account: null,
  chapters: [],
  members: [],
  sponsors: [],
};

export default AccountsForm;
