import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import notifications from 'react-notification-system-redux';

import actions from '../../../../redux/actions/index';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
// import UserDirectory from '../../../resources/users/common/adminUserDirectory';
import MemberForm from '../../../resources/members/form/membersForm';
// import EditCardDetails from '../../../resources/subscriptions/edit-card-details';
import CardsList from '../../../resources/subscriptions/cards/list/cardsList';
// import CardsForm from '../../../resources/subscriptions/cards/form/cardsForm';

// assumes this component will be used as a component prop for a Route component

const SettingsContainer = ({
  user,
  members,
  asyncAction,
  success,
  error,
}) => {
  if (!user) return null;
  // need to find a way to draw only relevant users based on permissions
  // const filteredUsers = [];
  // const { member } = user;
  const member = members.find(m => m._id === user.member._id);
  if (!member) return null;

  return (
    <div>
      <SectionHeader
        replaceHistory
        title={`${member.name} - Settings`}
        icon="settings"
        // should only show when has right permissions
        sections={[{
          title: 'Edit Profile',
          icon: 'recent_actors',
          to: '/settings',
          exact: true,
        }, {
          title: 'Billing',
          icon: 'credit_card',
          to: '/settings/billing',
        }]}
      />
      <Route
        exact
        path="/settings"
        render={() => (
          <div className="sectionPadding">
            <MemberForm
              member={member}
            />
          </div>
        )}
      />
      <Route
        exact
        path="/settings/billing"
        render={() => (
          <div className="sectionPadding">
            <CardsList
              member={member}
              asyncAction={asyncAction}
              success={msg => success({ title: msg })}
              error={msg => error({ title: msg })}
            />
          </div>
        )}
      />
      {/* <Route
        exact
        path="/settings/billing/new"
        render={() => (
          <div className="sectionPadding">
            <CardsForm member={member} />
          </div>
        )}
      /> */}
      {/* <Route
        exact
        path="/settings/users"
        render={() => (
          <div className="sectionPadding">
            <UserDirectory users={filteredUsers} />
          </div>
        )}
      /> */}
    </div>
  );
};

SettingsContainer.propTypes = {
  user: PropTypes.shape({}),
  members: PropTypes.arrayOf(PropTypes.shape({})),
  asyncAction: PropTypes.func.isRequired,
  success: PropTypes.func,
  error: PropTypes.func,
};

SettingsContainer.defaultProps = {
  user: null,
  members: [],
  success: () => {},
  error: () => {},
};

export default connect(
  state => ({
    user: state.users.auth.user,
    members: state.members.list._list,
  }),
  dispatch => ({
    asyncAction: bindActionCreators(actions.asyncAction, dispatch),
    success: bindActionCreators(notifications.success, dispatch),
    error: bindActionCreators(notifications.error, dispatch),
  }),
  null,
  { pure: false },
)(SettingsContainer);
