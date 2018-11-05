import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import GeneralInfo from './blogPostGeneralInfo';
import NavLinkGroup from '../../../common/navLinkGroup/navLinkGroup';
import FormContainer from '../../../common/form/formContainer';
import BlogPostBuilder from '../../../common/form/sectionBuilder/blogPostBuilder/blogPostBuilder';
import VisualBuilder from '../../../common/form/sectionBuilder/visualBuilder/visualBuilder';
import Preview from '../../../common/form/sectionBuilder/preview';

const determinRootUrl = (blogPost, chapter) => {
  if (blogPost) {
    return `/blogPost/${blogPost._id}/edit`;
  } else if (chapter) {
    return `/chapters/${chapter.slug}/blog/new`;
  }
  return '/blog/new';
};

class BlogPostForm extends React.Component {
  state = {
    error: '',
  }
  submit = (results, actions, notification) => {
    const { blogPost, chapter } = this.props;
    if (blogPost) {
      const { _id, ...trimmedResults } = results;
      if (chapter) {
        trimmedResults.chapterUuid = chapter.uuid;
      }
      // if you are editing instead of creating new one
      actions.crudAction({
        type: 'put',
        resource: 'blogPosts',
      }, {
        _id: blogPost._id,
        changes: trimmedResults,
      }, (err, updatedBlogPost) => {
        if (!err && updatedBlogPost) {
          notification.success(`Success updating ${updatedBlogPost.name} blogPost`);
          actions.history.push(`/blogPost/${updatedBlogPost._id}`);
        } else {
          notification.error(`Error updating ${updatedBlogPost.name} blogPost`);
        }
      });
    } else {
      const allResults = results;
      if (chapter) {
        allResults.chapterUuid = chapter.uuid;
      }
      actions.crudAction({
        type: 'post',
        resource: 'blogPosts',
      }, {
        pkg: allResults,
      }, (err, newBlogPost) => {
        if (!err && newBlogPost) {
          notification.success(`Success Creating ${newBlogPost.name} blogPost`);
          actions.history.push(`/blogPost/${newBlogPost._id}`);
        } else {
          notification.error('Error Occurred creating new blogPost');
        }
      });
    }
  }
  render() {
    const {
      blogPost,
      chapter,
      chapters,
    } = this.props;
    const {
      error,
    } = this.state;

    const rootUrl = determinRootUrl(blogPost, chapter);
    return (
      <div className="grid-container fluid">
        <div className="grid-x grid-margin-x grid-margin-y">
          <div className="cell">
            <Route
              exact
              path={rootUrl}
              render={() => (
                <Redirect to={`${rootUrl}/general-info`} />
              )}
            />
            <NavLinkGroup
              links={[{
            to: `${rootUrl}/general-info`,
                icon: 'info',
                title: 'General Info',
              }, {
            to: `${rootUrl}/blogPost-builder`,
                icon: 'build',
                title: 'Blog Post Builder',
              }, {
            to: `${rootUrl}/visual-builder`,
                icon: 'pan_tool',
                title: 'Visual Builder',
              }, {
            to: `${rootUrl}/preview`,
                icon: 'remove_red_eye',
                title: 'Preview',
              }]}
            />
            {error &&
              <div style={{ color: 'red' }}>{error}</div>
            }
            {}
            <FormContainer
              record={blogPost && {
                sections: [],
                ...blogPost,
              }}
              submit={this.submit}
              renderProps={(values) => {
                const activeChapter = chapters.find(chap => chap.uuid === values.chapterUuid);
                return (
                  <div>
                    <Route
                      path={`${rootUrl}/general-info`}
                      render={() => (
                        <GeneralInfo
                          activeChapter={activeChapter || chapter}
                          activeOnHeader={values.activeOnHeader}
                        />
                      )}
                    />
                    <Route
                      path={`${rootUrl}/blogPost-builder`}
                      render={() => (
                        <BlogPostBuilder
                          sectionsFromStore={values.sections}
                        />
                      )}
                    />
                    <Route
                      path={`${rootUrl}/visual-builder`}
                      render={() => (
                        <VisualBuilder
                          sectionsFromStore={values.sections}
                        />
                      )}
                    />
                    <Route
                      path={`${rootUrl}/preview`}
                      render={() => (
                        <Preview
                          sectionsFromStore={values.sections}
                        />
                      )}
                    />
                    <div className="grid-container">
                      <div className="grid-x">
                        <div className="cell">
                          <button
                            className="button"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </div>

        </div>
      </div>
    );
  }
}

BlogPostForm.propTypes = {
  blogPost: PropTypes.shape({}),
  chapter: PropTypes.shape({}),
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
};

BlogPostForm.defaultProps = {
  blogPost: undefined,
  chapter: undefined,
  chapters: [],
};


export default BlogPostForm;
