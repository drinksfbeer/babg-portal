import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import Loading from '../../../common/loading/loading';
import AdminChapterDashboard from '../chapterDetails/chapterDashboard/adminChapterDashboardContainer'; // eslint-disable-line
import SectionHeader from '../../../common/sectionHeader/sectionHeader';

const DashboardContainer = ({
  user,
  chapters,
  chaptersLoading,
  userLoading,
  members,
  // events, // eslint-disable-line
  history,
}) => {
  const { role } = user;

  if (role === 'chapter') {
    const chapter = chapters.find(c => c.uuid === user.chapterUuid);
    const chapterRoute = (chapter && `/chapters/${chapter.slug}`) || '';

    // replace URL with chapter slug when available in Redux state
    if (chapterRoute) history.replace(chapterRoute);
    return <Loading />;
  }

  return (
    <div>
      <SectionHeader
        title="Guild Dashboard"
        icon="dashboard"
      />
      <div className="grid-container">
        <h2
          className="text-center"
          style={{
            margin: '20px 0px',
          }}
        >
          Welcome {user.role} user
        </h2>
        {(chaptersLoading || userLoading) &&
          <Loading />
        }
        <div className="grid-x grid-margin-x grid-margin-y">
          {chapters.map((chapter) => {
            const numMembers = members.filter(member => chapter.uuid === member.chapterUuid).length;

            return (
              <Link
                to={`/chapters/${chapter.slug}`}
                className="cell large-4 medium-6"
                key={chapter._id}
              >
                <div
                  className="cover-item"
                  style={{ backgroundImage: `url('${chapter.image}')` }}
                >
                  <div className="content">
                    <h4>{chapter.name}</h4>
                    <div>{numMembers} {numMembers === 1 ? 'member' : 'members'}</div>
                    <button
                      className="button"
                      style={{ margin: '0px' }}
                    >
                      See More
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}

        </div>
      </div>
    </div>
  );
};

DashboardContainer.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
  members: PropTypes.arrayOf(PropTypes.shape({})),
  // events: PropTypes.arrayOf(PropTypes.shape({})),
  chapters: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.shape({})),
  })),
  userLoading: PropTypes.bool.isRequired,
  chaptersLoading: PropTypes.bool.isRequired,
  history: PropTypes.shape({}),
};
DashboardContainer.defaultProps = {
  user: null,
  chapters: [],
  members: [],
  // events: [],
  history: {},
};

export default connect(
  state => ({
    user: state.users.auth.user,
    chapters: state.chapters.list._list,
    chaptersLoading: state.chapters.list.loading,
    userLoading: state.users.auth.loading,
    members: state.members.list._list,
    // events: state.events.list._list,
  }),
  null,
  null,
  { pure: false },
)(DashboardContainer);
