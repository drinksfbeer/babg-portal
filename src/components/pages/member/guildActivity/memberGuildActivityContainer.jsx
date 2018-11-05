import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import MembersList from '../../../resources/members/list/memberMembersList';
import Loading from '../../../common/loading/loading';
import EventsFeed from '../../../resources/events/common/feeds/eventsFeed';
import NotificationsFeed from '../../../resources/notifications/feed/notificationsFeed';
import AnnouncementsFeed from '../../../resources/announcements/feed/announcementsFeed';

const GuildContainer = ({
  member,
  members,
  chapters,
  events,
  eventsLoading,
}) => {
  const chapter = chapters.find(ch => ch.uuid === member.chapterUuid);
  const sectionTitle = `${chapter ? `${chapter.name} ` : ''}Chapter Activity`;

  return (
    <div>
      <SectionHeader
        title={sectionTitle}
        icon="explore"
        replaceHistory
        sections={[{
          title: 'Recent Activity',
          icon: 'notifications',
          to: '/guild/activity',
        }, {
          title: 'Announcements',
          icon: 'announcement',
          to: '/guild/activity/announcements',
        }, {
          title: 'Upcoming Events',
          icon: 'event',
          to: '/guild/activity/events',
        }, {
          title: 'Members Directory',
          icon: 'group',
          to: '/guild/activity/members',
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
            <NotificationsFeed
              chapterUuid={member.chapterUuid}
            />
          </div>
        )}
      />
      <Route
        exact
        path="/guild/activity/announcements"
        render={() => (
          <div className="sectionPadding">
            <AnnouncementsFeed
              role="member" // eslint-disable-line
              chapter={{ uuid: member.chapterUuid || '' }}
            />
          </div>
        )}
      />
      <Route
        path="/guild/activity/events"
        render={() => (
          <div className="sectionPadding">
            {eventsLoading ? (
              <Loading />
            ) : (
              <EventsFeed
                events={events}
                baseUrl="/guild/activity/events"
              />
            )}
          </div>
        )}
      />
      <Route
        path="/guild/activity/events"
        render={() => (
          <div className="sectionPadding">
            {eventsLoading ? (
              <Loading />
            ) : (
              <EventsFeed
                events={events}
                baseUrl="/guild/activity/events"
              />
            )}
          </div>
        )}
      />
      <Route
        path="/guild/activity/members"
        render={() => (
          <div className="sectionPadding">
            <MembersList
              members={members}
            />
          </div>
        )}
      />
    </div>
  );
};


GuildContainer.propTypes = {
  member: PropTypes.shape({}),
  members: PropTypes.arrayOf(PropTypes.shape({})),
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  events: PropTypes.arrayOf(PropTypes.shape({})),
  eventsLoading: PropTypes.bool,
};

GuildContainer.defaultProps = {
  member: {},
  members: [],
  chapters: [],
  events: [],
  eventsLoading: false,
};

export default connect(
  state => ({
    member: state.users.auth.user.member,
    members: state.members.list._list,
    chapters: state.chapters.list._list,
    events: state.events.list._list,
    eventsLoading: state.events.list.loading,
  }),
  null,
  null,
  { pure: false },
)(GuildContainer);
