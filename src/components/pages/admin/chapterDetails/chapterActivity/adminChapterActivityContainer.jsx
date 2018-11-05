import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import AdminFormHeaderItem from
  '../../../../resources/forms/header/adminFormHeaderItem';
import NotificationsFeed from '../../../../resources/notifications/feed/notificationsFeed';
import AnnouncementsFeed from '../../../../resources/announcements/feed/announcementsFeed';
import EventsFeed from '../../../../resources/events/common/feeds/eventsFeed';
import Loading from '../../../../common/loading/loading';
import MembersDirectory from '../../../../resources/members/common/membersDirectory';
import SectionHeader from '../../../../common/sectionHeader/sectionHeader';

const AdminChapterActivityContainer = ({
  chapter,
  members,
  events: allEvents,
  eventsLoading,
}) => {
  if (!chapter) return null;
  const chapterMembers = members.filter(member => (member.chapter || {})._id === chapter._id);
  const events = allEvents.filter(event => event.location.member.chapterUuid === chapter.uuid);

  return (
    <div>
      <SectionHeader
        title={`${chapter.name} Chapter Activity`}
        icon="explore"
        replaceHistory
        sections={[{
          title: 'Notifications',
          icon: 'notifications',
          to: `/chapters/${chapter.slug}/activity`,
        }, {
          title: 'Announcements',
          icon: 'announcement',
          to: `/chapters/${chapter.slug}/activity/announcements`,
        }, {
          title: 'Upcoming Events',
          icon: 'event',
          to: `/chapters/${chapter.slug}/activity/events`,
        }, {
          title: 'Members Directory',
          icon: 'group',
          to: `/chapters/${chapter.slug}/activity/members`,
        }]}
      />
      <Route
        exact
        path="/chapters/:slug/activity"
        render={() => (
          <div className="sectionPadding">
            <div className="grid-container fluid">
              <div className="grid-x grid-margin-x grid-margin-y">
                <AdminFormHeaderItem
                  title="Activity"
                  materialIcon="notifications"
                />
                <NotificationsFeed
                  chapterUuid={chapter.uuid}
                  isAdmin
                />
              </div>
            </div>
          </div>
        )}
      />
      <Route
        exact
        path="/chapters/:slug/activity/announcements"
        render={() => (
          <div className="sectionPadding">
            <AnnouncementsFeed
              role="chapter" // eslint-disable-line
              chapter={chapter}
            />
          </div>
        )}
      />

      <Route
        path="/chapters/:slug/activity/events"
        render={() => (
          <div className="sectionPadding">
            <div className="grid-container fluid">
              <div className="grid-x grid-margin-y grid-padding-y">
                <AdminFormHeaderItem
                  title="Upcoming Events"
                  materialIcon="event"
                />
              </div>
            </div>
            {eventsLoading ? (
              <Loading />
            ) : (
              <EventsFeed
                baseUrl={`/chapters/${chapter.slug}/activity/events`}
                events={events}
                // newEventActive
                recentFilterVisible
                featuredActionsVisible={[
                  'featured',
                  'chapterFeatured',
                  'marquee',
                ]}
              />
            )}
          </div>
        )}
      />
      <Route
        path="/chapters/:slug/activity/members"
        render={() => (
          <div className="sectionPadding">
            <div className="grid-container fluid">
              <div className="grid-x grid-margin-y grid-padding-y">
                <AdminFormHeaderItem
                  title="Chapter Members"
                  materialIcon="group"
                />
              </div>
            </div>

            <MembersDirectory
              members={chapterMembers}
              chapter={chapter}
            />
          </div>
        )}
      />
    </div>
  );
};

AdminChapterActivityContainer.propTypes = {
  chapter: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }).isRequired,
  members: PropTypes.arrayOf(PropTypes.shape({})),
  events: PropTypes.arrayOf(PropTypes.shape({})),
  eventsLoading: PropTypes.bool,
};

AdminChapterActivityContainer.defaultProps = {
  members: [],
  events: [],
  eventsLoading: false,
};


export default connect(
  state => ({
    members: state.members.list._list,
    eventsLoading: state.events.list.loading,
    events: state.events.list._list,
  }),
  null,
  null,
  { pure: false },
)(AdminChapterActivityContainer);
