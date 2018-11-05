import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Loading from '../../../common/loading/loading';
import AdminChapterDashboardContainer from './chapterDashboard/adminChapterDashboardContainer';
import AdminChapterActivityContainer from './chapterActivity/adminChapterActivityContainer';
import AdminChapterSettingsContainer from './chapterSettings/adminChapterSettingsContainer';
import AdminChapterPagesContainer from './chapterPages/adminChapterPagesContainer';
import AdminChapterBlogContainer from './chapterBlog/adminChapterBlogContainer';
// assumes this component will be used as a component prop for a Route component

const ChapterDetailsContainer = ({
  chapters,
  events: allEvents,
  loading,
  // error,
  match: {
    params: {
      slug,
    },
  },
}) => {
  const foundChapter = chapters.find(chapter => chapter.slug === slug);
  if (loading) {
    return <Loading />;
  }
  if (!foundChapter) return null;
  const events = allEvents
    .filter(event => event.location.member.chapterUuid === foundChapter.uuid);

  return (
    <Switch>
      <Route
        exact
        path="/chapters/:slug"
        render={() => (
          <AdminChapterDashboardContainer
            chapter={foundChapter}
            events={events}
          />
        )}
      />
      <Route
        path="/chapters/:slug/activity"
        render={() => (
          <AdminChapterActivityContainer chapter={foundChapter} />
        )}
      />
      <Route
        path="/chapters/:slug/settings"
        render={() => (
          <AdminChapterSettingsContainer chapter={foundChapter} />
        )}
      />
      <Route
        path="/chapters/:slug/site"
        render={() => (
          <AdminChapterPagesContainer chapter={foundChapter} />
        )}
      />
      <Route
        path="/chapters/:slug/blog"
        render={() => (
          <AdminChapterBlogContainer chapter={foundChapter} />
        )}
      />
    </Switch>
  );
};

ChapterDetailsContainer.propTypes = {
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  events: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  // error: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  // history: PropTypes.shape({
  //   replace: PropTypes.func.isRequired,
  // }).isRequired,
};

ChapterDetailsContainer.defaultProps = {
  chapters: [],
  events: [],
  loading: false,
  // error: false,
};
export default connect(
  state => ({
    chapters: state.chapters.list._list,
    events: state.events.list._list,
  }),
  null,
  null,
  { pure: false },
)(ChapterDetailsContainer);
