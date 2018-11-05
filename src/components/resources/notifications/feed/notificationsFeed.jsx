import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Loading from '../../../common/loading/loading';
import Actions from '../../../../redux/actions/index';
import NotificationsList from '../../../resources/notifications/list/notificationsList';

class NotificationsFeed extends React.Component {
  componentDidMount() {
    const {
      chapterUuid,
      // notifications,
      loading,
      crudAction,
    } = this.props;

    // if (notifications.length === 0 && !loading) {
    if (!loading) {
      crudAction({
        resource: 'notifications',
        query: chapterUuid ? `chapterUuid=${chapterUuid}` : null,
      });
    }
  }

  render() {
    const {
      notifications,
      crudAction,
      loading,
      isAdmin,
    } = this.props;
    if (loading) return <Loading />;

    return (
      <section className="sectionPadding">
        <div className="grid-x grid-padding-x grid-padding-y align-center">
          <NotificationsList
            isAdmin={isAdmin}
            notifications={notifications}
            onDelete={notifId => crudAction({
              type: 'delete',
              resource: 'notifications',
            }, {
              _id: notifId,
            })}
          />
        </div>
      </section>
    );
  }
}

NotificationsFeed.propTypes = {
  chapterUuid: PropTypes.string,
  notifications: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  crudAction: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
};

NotificationsFeed.defaultProps = {
  chapterUuid: null,
  notifications: [],
  loading: false,
  isAdmin: false,
};

export default connect(
  state => ({
    notifications: state.notifications.list._list,
    loading: state.notifications.list.loading,
  }),
  dispatch => ({
    crudAction: bindActionCreators(Actions.crudAction, dispatch),
  }),
  null,
  { pure: false },
)(NotificationsFeed);
