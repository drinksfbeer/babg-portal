import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../../redux/actions/index';

import AdminFormHeaderItem from '../../../resources/forms/header/adminFormHeaderItem';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import MembersDirectory from '../../../resources/members/common/membersDirectory';
import EventsFeed from '../../../resources/events/common/feeds/eventsFeed';
import Loading from '../../../common/loading/loading';
import NotificationsFeed from '../../../resources/notifications/feed/notificationsFeed';
import AnnouncementsFeed from '../../../resources/announcements/feed/announcementsFeed';
import FormsFeed from '../../../resources/forms/feed/formsFeed';

const AdmindGuildActivityContainer = ({
  chapters,
  members,
  events,
  eventsLoading,
  user,
  asyncAction,
  crudAction,
  forms,
}) => {
  if (!user) return null;
  const { member } = user;

  return (
    <div>
      <SectionHeader
        title="Guild Activity"
        icon="explore"
        replaceHistory
        sections={[{
          title: 'Notifications',
          icon: 'notifications',
          to: '/guild/activity',
        }, {
          title: 'Announcements',
          icon: 'announcement',
          to: '/guild/announcements',
        }, {
          title: 'Upcoming Events',
          icon: 'event',
          to: '/guild/events',
        }, {
          title: 'Members Directory',
          icon: 'group',
          to: '/guild/members',
        }, {
          title: 'Forms',
          icon: 'assignment',
          to: '/guild/forms',
        }]}
      />
      <Route
        exact
        path="/guild"
        render={() => <Redirect to="/guild/activity" />}
      />
      <Route
        exact
        path="/guild/activity"
        render={() => (
          <div className="sectionPadding">
            <div className="grid-x grid-padding-y grid-margin-y">
              <AdminFormHeaderItem
                title="Recent Guild Activity"
                materialIcon="notifications"
              />
            </div>
            <NotificationsFeed
              isAdmin
            />
          </div>
        )}
      />
      <Route
        exact
        path="/guild/announcements"
        render={() => (
          <div className="sectionPadding">
            <AnnouncementsFeed
              role="master" // eslint-disable-line
            />
          </div>
        )}
      />
      <Route
        path="/guild/events"
        render={() => (
          <div className="sectionPadding">
            <div className="grid-x grid-padding-y grid-margin-y">
              <AdminFormHeaderItem
                title="Upcoming Events"
                materialIcon="event"
              />
            </div>
            {eventsLoading ? (
              <Loading />
            ) : (
              <EventsFeed
                chapters={chapters}
                events={events}
                chapterFilterVisible
                recentFilterVisible
                featuredActionsVisible={[
                  'featured',
                  'chapterFeatured',
                  'marquee',
                ]}
                newEventActive
                member={member}
                asyncAction={asyncAction}
              />
            )}
          </div>
        )}
      />
      <Route
        path="/guild/members"
        render={() => (
          <div className="sectionPadding">
            <div className="grid-x grid-padding-y grid-margin-y">
              <AdminFormHeaderItem
                title="Members"
                materialIcon="group"
              />
            </div>
            <MembersDirectory
              members={members}
            />
          </div>
        )}
      />
      <Route
        path="/guild/forms"
        render={() => (
          <div className="sectionPadding">
            <div className="grid-x grid-padding-y grid-margin-y">
              <AdminFormHeaderItem
                title="Forms"
                materialIcon="assignment"
              />
            </div>
            <FormsFeed
              crudAction={crudAction}
              forms={forms}
            />
          </div>
        )}
      />
    </div>
  );
};

AdmindGuildActivityContainer.propTypes = {
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  members: PropTypes.arrayOf(PropTypes.shape({})),
  events: PropTypes.arrayOf(PropTypes.shape({})),
  eventsLoading: PropTypes.bool,
  user: PropTypes.shape({}),
  asyncAction: PropTypes.func,
  crudAction: PropTypes.func.isRequired,
  forms: PropTypes.arrayOf(PropTypes.shape({})),
};

AdmindGuildActivityContainer.defaultProps = {
  chapters: [],
  members: [],
  events: [],
  eventsLoading: false,
  user: null,
  asyncAction: null,
  forms: [],
};

export default connect(
  state => ({
    chapters: state.chapters.list._list,
    members: state.members.list._list,
    events: state.events.list._list,
    eventsLoading: state.events.list.loading,
    user: state.users.auth.user,
    forms: state.forms.list._list,
  }),
  dispatch => ({
    asyncAction: bindActionCreators(actions.asyncAction, dispatch),
    crudAction: bindActionCreators(actions.crudAction, dispatch),
  }),
  null,
  { pure: false },
)(AdmindGuildActivityContainer);
