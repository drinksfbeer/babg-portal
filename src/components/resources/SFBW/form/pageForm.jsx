import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import GeneralInfo from './generalInfo';
import NavLinkGroup from '../../../common/navLinkGroup/navLinkGroup';
import FormContainer from '../../../common/form/formContainer';
import PageBuilder from '../../../common/form/sectionBuilder/pageBuilder/pageBuilder';
import VisualBuilder from '../../../common/form/sectionBuilder/visualBuilder/visualBuilder';
import Preview from '../../../common/form/sectionBuilder/preview';

const determinRootUrl = (page) => {
  if (page) {
    return `/sfbw/page/${page._id}/edit`;
  }
  return '/sfbw/site/new';
};

class SFBWPageForm extends React.Component {
  state = {
    error: '',
  }
  submit = (results, actions, notification) => {
    const { page } = this.props;
    if (page) {
      const { _id, ...trimmedResults } = results;
      // if you are editing instead of creating new one
      actions.crudAction({
        type: 'put',
        resource: 'SFBWpages',
      }, {
        _id: page._id,
        changes: trimmedResults,
      }, (err, updatedPage) => {
        if (!err && updatedPage) {
          notification.success(`Success updating ${updatedPage.name} page`);
          actions.history.push(`/sfbw/page/${updatedPage._id}`);
        } else {
          notification.error(`Error updating ${updatedPage.name} page`);
        }
      });
    } else {
      const allResults = results;
      actions.crudAction({
        type: 'post',
        resource: 'SFBWpages',
      }, {
        pkg: allResults,
      }, (err, newPage) => {
        if (!err && newPage) {
          notification.success(`Success Creating ${newPage.name} page`);
          actions.history.push(`/sfbw/page/${newPage._id}`);
        } else {
          notification.error('Error Occurred creating new page');
        }
      });
    }
  }
  render() {
    const {
      page,
    } = this.props;
    const {
      error,
    } = this.state;

    const rootUrl = determinRootUrl(page);
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
              renderProps={(values) => { // eslint-disable-line
                // console.log(values); // eslint-disable-line
                return (
                  <div>
                    <Route
                      path={`${rootUrl}/general-info`}
                      render={() => (
                        <GeneralInfo
                          isASubPage={values.isASubPage}
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

SFBWPageForm.propTypes = {
  page: PropTypes.shape({}),
};

SFBWPageForm.defaultProps = {
  page: undefined,
};


export default SFBWPageForm;
