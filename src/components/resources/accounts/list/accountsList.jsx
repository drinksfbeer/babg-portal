import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import swal from 'sweetalert';

import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';
import FancyTabs from '../../../common/fancyTabs/fancyTabs';
import TextField from '../../../common/form/inputs/textField';
import { userRoles } from '../../../../refs/refs';

class AccountsList extends React.Component {
  state = {
    tabs: [],
    tabIndex: 0,
    search: '', // eslint-disable-line
  };

  componentDidMount() {
    this.setTabs();
  }

  componentWillReceiveProps(nextProps) {
    this.setTabs(nextProps.users);
  }

  setTabs(users = this.props.users) {
    const { role } = this.props;
    const isMaster = role === 'master';
    const isChapter = role === 'chapter';
    // const isMember = role === 'member';
    const tabs = [];

    // calculate number of users per role
    const numUsersByRole = users.reduce((num, user) => {
      if (num.hasOwnProperty(user.role)) num[user.role]++; // eslint-disable-line
      return num;
    }, {
      master: 0,
      chapter: 0,
      member: 0,
      staff: 0,
      agent: 0,
      enthusiast: 0,
    });

    // fill in `tabs` array depending on `user.role`
    tabs.push({
      value: 'all',
      label: 'All',
      sublabel: `(${users.length})`,
    });
    if (isMaster) {
      tabs.push({
        value: 'master',
        label: userRoles.master,
        sublabel: `(${numUsersByRole.master})`,
      });
    }
    if (isMaster || isChapter) {
      tabs.push({
        value: 'chapter',
        label: userRoles.chapter,
        sublabel: `(${numUsersByRole.chapter})`,
      });
    }
    tabs.push({
      value: 'member',
      label: userRoles.member,
      sublabel: `(${numUsersByRole.member})`,
    });
    tabs.push({
      value: 'staff',
      label: userRoles.staff,
      sublabel: `(${numUsersByRole.staff})`,
    });
    if (isMaster) { // only master admins can manage agents
      tabs.push({
        value: 'agent',
        label: userRoles.agent,
        sublabel: `(${numUsersByRole.agent})`,
      });
    }
    if (isMaster || isChapter) {
      tabs.push({
        value: 'enthusiast',
        label: userRoles.enthusiast,
        sublabel: `(${numUsersByRole.enthusiast})`,
      });
    }

    this.setState({ tabs });
  }

  render() {
    const {
      userId,
      role,
      users,
      chapters,
      members,
      asyncAction, // eslint-disable-line
      notifications, // eslint-disable-line
    } = this.props;
    const {
      tabs,
      tabIndex,
      search,
    } = this.state;
    const isAdmin = ['master', 'chapter'].includes(role);

    // apply filters/search terms
    const filterType = tabs.length > 0 ? tabs[tabIndex].value : 'all';
    let filteredUsers = users;
    if (filterType !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === filterType);
    }
    if (search) {
      const searchString = search.toLowerCase().replace(' ', '');
      filteredUsers = users.filter((user) => {
        let indexableStrings = `${user.email}|`;
        if (['chapter', 'enthusiast'].includes(user.role)) {
          indexableStrings += `${chapters.find(chapter => chapter.uuid === user.chapterUuid).name}|`;
        }
        if (['member', 'staff'].includes(user.role)) {
          const member = members.find(m => m.uuid === user.memberUuid);
          const chapter = chapters.find(ch => ch.uuid === member.chapterUuid) || { name: '' };
          indexableStrings += `${member.name}|${chapter.name}`;
        }
        return indexableStrings.toLowerCase().replace(' ', '').indexOf(searchString) > -1;
      });
    }

    return (
      <div className="accountsList grid-x grid-padding-x grid-padding-y align-center">
        <AdminFormHeaderItem
          title="Account Management"
          materialIcon="people"
        />
        <FancyTabs
          containerClass="cell large-12 medium-12 small-12"
          contentClass="table"
          tabStyle={{ fontSize: '16px' }}
          tabs={tabs}
          index={tabIndex}
          onChange={tabIndex => this.setState({ tabIndex })}
        >
          <div className="grid-x grid-padding-x align-right">
            <div
              className="cell large-3 medium-3 small-12"
              style={{ paddingLeft: '0', paddingRight: '0' }}
            >
              <TextField
                input={{
                  value: search,
                  onChange: event => this.setState({
                    search: event.target.value,
                  }),
                }}
                placeholder="search for a user by email or association"
              />
            </div>
          </div>
          <div className="grid-x grid-padding-x heading">
            <div className="cell large-3 medium-3">
              Email Address
            </div>
            <div className="cell large-2 medium-2">
              Type
            </div>
            <div className="cell large-3 medium-3">
              Association
            </div>
            <div className="cell large-2 medium-2">
              Registration
            </div>
            <div className="cell large-2 medium-2" />
          </div>
          {filteredUsers.map(user => (
            <div key={user._id} className="grid-x grid-padding-x user">
              <div className="cell large-3 medium-3 email">
                {user.email}
              </div>
              <div
                className={classNames({
                  cell: true,
                  'large-2': true,
                  'medium-2': true,
                  role: true,
                  [user.role]: true,
                })}
              >
                {userRoles[user.role] || user.role || 'Unknown'}
              </div>
              {
                !isAdmin &&
                <div className="cell large-3 medium-3 association">
                  {members.length > 0 ? members[0].name : ''}
                </div>
              }
              {
                (isAdmin && (user.role === 'master' || user.role === 'agent')) &&
                <div className="cell large-3 medium-3" />
              }
              {
                (isAdmin && (user.role === 'chapter' || user.role === 'enthusiast')) &&
                <div className="cell large-3 medium-3 association chapterName">
                  {(() => {
                    const chapter = chapters.find(ch => ch.uuid === user.chapterUuid);
                    return (
                      <Link to={`/chapters/${chapter.slug}`}>
                        {chapter.name}
                      </Link>
                    );
                  })()}
                </div>
              }
              {
                (isAdmin && (user.role === 'member' || user.role === 'staff')) &&
                <div className="cell large-3 medium-3 association">
                  {(() => {
                    const member = members.find(m => m.uuid === user.memberUuid);
                    const chapter = chapters.find(ch => ch.uuid === member.chapterUuid);
                    return [
                      <Link key={`${user._id}-0`} to={`/chapters/${chapter.slug}`}>
                        <span
                          className="chapterName"
                          style={{ opacity: '0.5' }}
                        >
                          {chapter.name}
                        </span>
                      </Link>,
                      <span
                        key={`${user._id}-1`}
                        style={{
                          padding: '0 0.5em',
                          opacity: '0.5',
                          userSelect: 'none',
                        }}
                      >
                        &#x226B;
                      </span>,
                      <Link key={`${user._id}-2`} to={`/member/${member._id}`}>
                        <span>
                          {member.name}
                        </span>
                      </Link>,
                    ];
                  })()}
                </div>
              }
              <div
                className={classNames({
                  cell: true,
                  'large-2': true,
                  'medium-2': true,
                  status: true,
                  registration: true,
                  active: user.hasRegistered,
                })}
              >
                <i className="material-icons">
                  {user.hasRegistered ? 'done' : 'schedule'}
                </i>
                <span>
                  {user.hasRegistered ? 'Completed' : 'Pending'}
                </span>
              </div>
              <div className="cell large-2 medium-2" style={{ textAlign: 'center' }}>
                <Link
                  className="button"
                  style={{ marginRight: '0.5em' }}
                  to={`/account/${user._id}`}
                >
                  Edit
                </Link>
                <button
                  className="button alert"
                  onClick={async () => {
                    if (user._id !== userId) {
                      const deleteAlert = await swal({
                        title: `Are you sure you want to delete ${user.email}?`,
                        text: 'This action cannot be undone!',
                        buttons: true,
                        dangerMode: true,
                      });
                      if (!deleteAlert) return;
                      const confirmation = await swal({
                        title: 'Please type DELETE to confirm.',
                        text: `You are about to delete:\n${user.email}`,
                        content: 'input',
                        buttons: true,
                        dangerMode: true,
                      });
                      if (typeof confirmation === 'string' && confirmation !== 'DELETE') {
                        swal({
                          title: 'DELETE was not typed correctly!',
                          text: `${user.email} was not deleted. Please try again.`,
                        });
                        return;
                      }
                      // don't show the above alert if they pressed 'Cancel'
                      if (!confirmation) return;
                      asyncAction('deleteUser', {
                        adminId: userId,
                        _id: user._id,
                      }, null, (err, response) => {
                        if (err || !response) {
                          notifications.error('Error Occurred Deleting User');
                        } else {
                          notifications.success('User Deleted Successfully!');
                        }
                      });
                    } else {
                      swal({
                        title: 'You cannot delete yourself!',
                      });
                    }
                  }}
                  disabled={user._id === userId}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </FancyTabs>
      </div>
    );
  }
}

AccountsList.propTypes = {
  userId: PropTypes.string.isRequired,
  role: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  })),
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  members: PropTypes.arrayOf(PropTypes.shape({})),
  asyncAction: PropTypes.func,
  notifications: PropTypes.shape({
    success: PropTypes.func,
    error: PropTypes.func,
  }),
};

AccountsList.defaultProps = {
  role: '',
  users: [],
  chapters: [],
  members: [],
  asyncAction: () => {},
  notifications: {},
};

export default AccountsList;
