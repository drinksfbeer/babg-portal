import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import notifications from 'react-notification-system-redux';

import Actions from '../../../../redux/actions';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import AccountsList from '../../../resources/accounts/list/accountsList';
import AccountsForm from '../../../resources/accounts/form/accountsForm';

const AccountsContainer = ({
  match,
  user,
  users,
  // chapters,
  members,
  asyncAction,
  success,
  error,
}) => (
  <div>
    <SectionHeader
      title="User Accounts"
      icon="account_circle"
      replaceHistory
      sections={[{
        title: 'User Accounts',
        icon: 'account_circle',
        to: '/accounts',
      }, {
        title: 'Create New Account',
        icon: 'person_add',
        to: '/accounts/new',
      }]}
    />
    <Route
      exact
      path="/accounts"
      render={() => (
        <div className="sectionPadding">
          <AccountsList
            userId={user._id}
            role={user.role}
            users={users}
            // chapters={chapters}
            members={members}
            asyncAction={asyncAction}
            notifications={{
              success: msg => success({ title: msg }),
              error: msg => error({ title: msg }),
            }}
          />
        </div>
      )}
    />
    <Route
      exact
      path="/account/:id"
      render={() => {
        const { id } = match.params;
        const account = users.find(u => u._id === id);
        if (!account) return null;
        delete account.password;
        return (
          <AccountsForm
            user={user}
            role={user.role}
            account={account}
            // chapters={chapters}
            members={members}
          />
        );
      }}
    />
    <Route
      exact
      path="/accounts/new"
      render={() => (
        <AccountsForm
          user={user}
          role={user.role}
          // chapters={chapters}
          members={members}
        />
      )}
    />
  </div>
);

AccountsContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  user: PropTypes.shape({}), // this is the currently logged in user
  users: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  })), // this is the list of all users (depending on `user.role`)
  // chapters: PropTypes.arrayOf(PropTypes.shape({})),
  members: PropTypes.arrayOf(PropTypes.shape({})),
  asyncAction: PropTypes.func,
  success: PropTypes.func,
  error: PropTypes.func,
};

AccountsContainer.defaultProps = {
  match: {
    params: {
      id: '',
    },
  },
  user: {},
  users: [],
  // chapters: [],
  members: [],
  asyncAction: () => {},
  success: () => {},
  error: () => {},
};

export default connect(
  state => ({
    user: state.users.auth.user,
    users: state.users.list._list,
    // chapters: state.chapters.list._list,
    members: state.members.list._list,
  }),
  dispatch => ({
    asyncAction: bindActionCreators(Actions.asyncAction, dispatch),
    success: bindActionCreators(notifications.success, dispatch),
    error: bindActionCreators(notifications.error, dispatch),
  }),
  null,
  { pure: false },
)(AccountsContainer);
