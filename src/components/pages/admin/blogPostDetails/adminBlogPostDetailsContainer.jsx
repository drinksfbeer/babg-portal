import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import BlogPostForm from '../../../resources/blogPosts/form/blogPostForm';
import BlogPostDetails from '../../../resources/blogPosts/details/blogPostDetails';
import DeleteConfirmation from '../../../common/prompts/confirmation';

const BlogPostDetailsContainer = ({
  blogPosts,
  chapters,
  match: {
    params: {
      id,
    },
  },
  history: {
    replace,
  },
}) => {
  const foundBlogPost = blogPosts.find(blogPost => blogPost._id === id);
  if (!foundBlogPost) return null;

  return (
    <div>
      <SectionHeader
        title="Blog Post"
        icon="create"
        sections={[{
          title: 'Back',
          icon: 'chevron_left',
          color: 'rgba(0,0,0,0.6)',
        },
        {
          title: 'Details',
          icon: 'pageview',
          to: `/blogPost/${foundBlogPost._id}`,
        },
        {
          title: 'Edit',
          icon: 'edit',
          to: `/blogPost/${foundBlogPost._id}/edit`,
        },
        {
          title: 'Delete',
          icon: 'delete_forever',
          to: `/blogPost/${foundBlogPost._id}/delete`,
          color: '#cc4b37',
        }]}
        replaceHistory
      />
      <Switch>
        <Route
          exact
          path="/blogPost/:id"
          render={() => <BlogPostDetails blogPost={foundBlogPost} />}
        />
        <Route
          exact
          path="/blogPost/:id/edit"
          render={() => (
            <Redirect to={`/blogPost/${foundBlogPost._id}/edit/general-info`} />
          )}
        />
        <Route
          path="/blogPost/:id/edit"
          render={() => (
            <BlogPostForm
              blogPost={foundBlogPost}
              chapters={chapters}
            />
          )}
        />
        <Route
          path="/blogPost/:id/delete"
          render={() => (
            <DeleteConfirmation
              message="Are you sure you want to delete this Blog Post forever?"
              resource="blogPosts"
              record={foundBlogPost}
              response={(err, response) => {
                if (response && !err) {
                  replace('/blog');
                }
              }}
            />
          )}
        />
      </Switch>
    </div>
  );
};

BlogPostDetailsContainer.propTypes = {
  blogPosts: PropTypes.arrayOf(PropTypes.shape({})),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
};

BlogPostDetailsContainer.defaultProps = {
  blogPosts: [],
  chapters: [],
};

export default connect(
  state => ({
    blogPosts: state.blogPosts.list._list,
    chapters: state.chapters.list._list,
  }),
  null,
  null,
  { pure: false },
)(BlogPostDetailsContainer);
