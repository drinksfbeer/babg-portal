import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import UsersList from '../list/adminUsersList';
import UsersNav from '../nav/adminUsersNav';

class UserDirectory extends React.Component {
  state = {
    filter: '',
  }

  changeUserDirectoryState = newState => this.setState(newState)

  render() {
    const { users } = this.props;
    const { search } = this.state;
    const memberId = this.props.users.length ? this.props.users[0].member._id : undefined;
    const filteredUsers = users
      .filter(user => !search || user.name.toLowerCase().includes(search.toLowerCase()));

    return ([
      <div
        key="addUserButton"
      >
        {
          memberId &&
          (
            <Link
              to={`/member/${memberId}/users/add`}
              key="addUser"
            >
              <button className="button">Add User</button>
            </Link>
          )
        }
      </div>,
      <UsersNav
        key="usersNav"
        changeUserDirectoryState={this.changeUserDirectoryState}
        {...this.state}
      />,
      <UsersList
        key="usersList"
        users={filteredUsers}
      />,
    ]);
  }
}

UserDirectory.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    member: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  })),
};

UserDirectory.defaultProps = {
  users: [],
};

export default UserDirectory;
