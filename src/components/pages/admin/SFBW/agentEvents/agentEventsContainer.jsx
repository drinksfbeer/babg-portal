import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import notifications from 'react-notification-system-redux';
import SectionHeader from '../../../../common/sectionHeader/sectionHeader';
import AgentEventList from '../../../../resources/events/list/adminAgentEventList';
import actions from '../../../../../redux/actions';

const AgentEventsContainer = ({
  publicEvents, publicEventVersions, asyncAction, user, success, error, users,
}) => {
  const latestVersions = publicEventVersions.length > 0 ? publicEvents.filter((event) => {
    const { revisions } = publicEventVersions[0];
    const refId = event.masterId ? event.masterId : event._id;
    if (revisions[refId].length < 1) {
      return true;
    }
    const index = revisions[refId].findIndex(id => id === event._id);
    return index === revisions[refId].length - 1;
  })
    :
    [];
  return (
    <div>
      <SectionHeader
        title="SFBW Events"
        icon="event"
        sections={[{
          title: 'Manage Events',
          icon: 'remove_red_eye',
          to: '/sfbw/events',
          exact: true,
        }]}
      />
      <Route
        exact
        strict
        path="/sfbw/events"
        render={() => (
          <AgentEventList
            events={latestVersions}
            eventVersions={publicEventVersions}
            asyncAction={asyncAction}
            admin={user}
            users={users}
            success={success}
            error={error}
          />
        )}
      />
    </div>
  );
};

AgentEventsContainer.propTypes = {
  user: PropTypes.shape({}),
  users: PropTypes.arrayOf(PropTypes.shape({})),
  publicEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  publicEventVersions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  asyncAction: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired,
};

AgentEventsContainer.defaultProps = {
  user: {},
  users: [],
};

export default connect(
  state => ({
    user: state.users.auth.user,
    users: state.users.list._list,
    publicEvents: state.publicEvents.list._list,
    publicEventVersions: state.publicEventVersions.list._list,
  }),
  dispatch => ({
    asyncAction: bindActionCreators(actions.asyncAction, dispatch),
    success: bindActionCreators(notifications.success, dispatch),
    error: bindActionCreators(notifications.error, dispatch),
  }),
  null,
  { pure: false },
)(AgentEventsContainer);
