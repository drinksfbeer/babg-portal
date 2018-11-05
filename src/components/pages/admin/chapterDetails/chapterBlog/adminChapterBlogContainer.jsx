import React from 'react';
import { connect } from 'react-redux';

import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import BlogPostsList from '../../../../resources/blogPosts/list/blogPostsList';
import BlogPostForm from '../../../../resources/blogPosts/form/blogPostForm';
import SectionHeader from '../../../../common/sectionHeader/sectionHeader';


const PagesContainer = ({
  // pages: allPages,
  chapter,
}) => {
  if (!chapter) return null;
  // const pages = allPages.filter(page => page.chapterUuid === chapter.uuid);
  return (
    <div>
      <SectionHeader
        title={`${chapter.name} Blog Posts`}
        icon="view_stream"
        sections={[{
          title: 'View Posts',
          icon: 'view_stream',
          to: `/chapters/${chapter.slug}/blog`,
        },
          {
            title: 'Create New Post',
            icon: 'note_add',
          to: `/chapters/${chapter.slug}/blog/new`,
            exact: false,
        }]}
        replaceHistory
      />
      <Switch>
        <Route
          path={`/chapters/${chapter.slug}/blog/new`}
          render={() => (
            <BlogPostForm
              chapter={chapter}
            />
          )}
        />
        <Route
          exact
          path={`/chapters/${chapter.slug}/blog`}
          render={() => (
            // <PagesList pages={pages} />
            <BlogPostsList chapterUuid={chapter.uuid} />
          )}
        />
      </Switch>
    </div>
  );
};
PagesContainer.propTypes = {
  /* pages: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
  })), */
  chapter: PropTypes.shape({}).isRequired,
};

PagesContainer.defaultProps = {
  // pages: [],
};

export default connect(
  /* state => ({
    pages: state.pages.list._list,
  }), */
  null,
  null,
  null,
  { pure: false },
)(PagesContainer);
