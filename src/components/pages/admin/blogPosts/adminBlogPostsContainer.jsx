import React from 'react';
import { connect } from 'react-redux';

import { Route, Switch } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import BlogPostsList from '../../../resources/blogPosts/list/blogPostsList';
import BlogPostForm from '../../../resources/blogPosts/form/blogPostForm';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import Actions from '../../../../redux/actions/';

const BlogPostsContainer = () => (
  <div>
    <SectionHeader
      title="Guild Blog Posts"
      icon="web"
      sections={[{
          title: 'View Blog Posts',
          icon: 'remove_red_eye',
          to: '/blog',
      },
        {
          title: 'Create New Blog Post',
          icon: 'note_add',
          to: '/blog/new',
          exact: false,
      }]}
      replaceHistory
    />
    <Switch>
      <Route
        path="/blog/new"
        component={BlogPostForm}
      />
      <Route
        exact
        path="/blog"
        render={() => (
            // <BlogPostsList blogPosts={blogPosts} />
          <BlogPostsList chapterUuid="non-chapter" />
          )}
      />
    </Switch>
  </div>
);

BlogPostsContainer.propTypes = {
};

BlogPostsContainer.defaultProps = {
};

export default connect(
  state => ({
    blogPosts: state.blogPosts.list._list,
  }),
  dispatch => ({ crudAction: bindActionCreators(Actions.crudAction, dispatch) }),
  null,
  { pure: false },
)(BlogPostsContainer);
