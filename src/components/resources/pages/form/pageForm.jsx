import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import GeneralInfo from './generalInfo';
import NavLinkGroup from '../../../common/navLinkGroup/navLinkGroup';
import FormContainer from '../../../common/form/formContainer';
import PageBuilder from '../../../common/form/sectionBuilder/pageBuilder/pageBuilder';
import VisualBuilder from '../../../common/form/sectionBuilder/visualBuilder/visualBuilder';
import Preview from '../../../common/form/sectionBuilder/preview';

const determinRootUrl = (page, chapter) => {
  if (page) {
    return `/page/${page._id}/edit`;
  } else if (chapter) {
    return `/chapters/${chapter.slug}/site/new`;
  }
  return '/site/new';
};

class PageForm extends React.Component {
  state = {
    error: '',
  }
  submit = (results, actions, notification) => {
    const { page, chapter } = this.props;
    if (page) {
      const { _id, ...trimmedResults } = results;
      if (chapter) {
        trimmedResults.chapterUuid = chapter.uuid;
      }
      // if you are editing instead of creating new one
      actions.crudAction({
        type: 'put',
        resource: 'pages',
      }, {
        _id: page._id,
        changes: trimmedResults,
      }, (err, updatedPage) => {
        if (!err && updatedPage) {
          notification.success(`Success updating ${updatedPage.name} page`);
          actions.history.push(`/page/${updatedPage._id}`);
        } else {
          notification.error(`Error updating ${updatedPage.name} page`);
        }
      });
    } else {
      const allResults = results;
      if (chapter) {
        allResults.chapterUuid = chapter.uuid;
      }
      actions.crudAction({
        type: 'post',
        resource: 'pages',
      }, {
        pkg: allResults,
      }, (err, newPage) => {
        if (!err && newPage) {
          notification.success(`Success Creating ${newPage.name} page`);
          actions.history.push(`/page/${newPage._id}`);
        } else {
          notification.error('Error Occurred creating new page');
        }
      });
    }
  }
  render() {
    const {
      page,
      chapter,
      chapters,
    } = this.props;
    const {
      error,
    } = this.state;

    const rootUrl = determinRootUrl(page, chapter);
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
            to: `${rootUrl}/page-builder`,
                icon: 'build',
                title: 'Page Builder',
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
              record={page && {
                sections: [],
                ...page,
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
                      path={`${rootUrl}/page-builder`}
                      render={() => (
                        <PageBuilder
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

PageForm.propTypes = {
  page: PropTypes.shape({}),
  chapter: PropTypes.shape({}),
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
};

PageForm.defaultProps = {
  page: undefined,
  chapter: undefined,
  chapters: [],
};


export default PageForm;
