import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import SectionHeader from '../../../../common/sectionHeader/sectionHeader';

const AdminChapterDashboard = ({
  chapter,
  events,
  locations,
  members,
}) => {
  if (!chapter) return null;
  const chapterMembers = members.filter(member => member.chapterUuid === chapter.uuid);
  const chapterMemberUuids = chapterMembers.map(member => member.uuid);
  const numMembers = chapterMembers.length;

  // here's how we find how many events the chapter has:
  // 1. each event has a `locationUuid`, so we compile an array of `locationUuid`s that
  //    belong to each member of this chapter
  // 2. we filter through each event that has the compiled array of `locationUuid`s
  // 3. take the length of the filtered events
  // eslint-disable-next-line
  const chapterLocations = locations.filter(location => chapterMemberUuids.includes(location.memberUuid));
  const chapterLocationUuids = chapterLocations.map(location => location.uuid);
  const chapterEvents = events.filter(event => chapterLocationUuids.includes(event.locationUuid));
  const numEvents = chapterEvents.filter(event => event.startDate > Date.now()).length;

  return (
    <div>
      <SectionHeader
        title={`${chapter.name} Chapter Dashboard`}
        icon="dashboard"
      />
      <div className="text-center">
        <div
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${chapter.image})`,
            height: '20vh',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              margin: '20px 0px',
              color: 'white',
            }}
          >
            Welcome to {chapter.name} Chapter
          </h2>
        </div>
        <div className="grid-container">
          <div
            className="grid-x grid-padding-x grid-padding-y grid-margin-x grid-margin-y"
            style={{ marginTop: '30px' }}
          >
            <NavBox
              link={`/chapters/${chapter.slug}/activity/members`}
              icon="account_circle"
              message={`See ${numMembers} ${numMembers === 1 ? 'Member' : 'Members'}`}
            />
            <NavBox
              link={`/chapters/${chapter.slug}/activity/events`}
              icon="today"
              message={`See ${numEvents} ${numEvents === 1 ? 'Event' : 'Events'}`}
            />
            <NavBox
              link={`/chapters/${chapter.slug}/site`}
              icon="web"
              message={`Edit ${chapter.name} Site`}
            />
            <NavBox
              link={`/chapters/${chapter.slug}/settings`}
              icon="settings"
              message={`${chapter.name} Settings`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

AdminChapterDashboard.propTypes = {
  chapter: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  events: PropTypes.arrayOf(PropTypes.shape({})),
  locations: PropTypes.arrayOf(PropTypes.shape({})),
  members: PropTypes.arrayOf(PropTypes.shape({})),
};

AdminChapterDashboard.defaultProps = {
  chapter: null,
  events: [],
  locations: [],
  members: [],
};

// export default AdminChapterDashboard;

export default connect(
  state => ({
    events: state.events.list._list,
    locations: state.locations.list._list,
    members: state.members.list._list,
  }),
  null,
  null,
  { pure: false },
)(AdminChapterDashboard);

const NavBox = ({
  link,
  icon,
  message,
}) => (
  <Link
    to={link}
    className="app-item cell large-3 medium-6"
  >
    <div>
      <i
        className="material-icons"
        style={{
          fontSize: '300%',
        }}
      >
        {icon}
      </i>
    </div>
    <div>
      <b>{message}</b>
    </div>
  </Link>
);

NavBox.propTypes = {
  link: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
