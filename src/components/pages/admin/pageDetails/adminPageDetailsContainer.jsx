import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import PageForm from '../../../resources/pages/form/pageForm';
import PageDetails from '../../../resources/pages/details/pageDetails';
import DeleteConfirmation from '../../../common/prompts/confirmation';

const PageDetailsContainer = ({
  pages,
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
  const foundPage = pages.find(page => page._id === id);
  if (!foundPage) return null;

  return (
    <div>
      <SectionHeader
        title="Page"
        icon="create"
        sections={[{
          title: 'Back',
          icon: 'chevron_left',
          color: 'rgba(0,0,0,0.6)',
        },
        {
          title: 'Details',
          icon: 'pageview',
          to: `/page/${foundPage._id}`,
        },
        {
          title: 'Edit',
          icon: 'edit',
          to: `/page/${foundPage._id}/edit`,
        },
        {
          title: 'Delete',
          icon: 'delete_forever',
          to: `/page/${foundPage._id}/delete`,
          color: '#cc4b37',
        }]}
        replaceHistory
      />
      <Switch>
        <Route
          exact
          path="/page/:id"
          render={() => <PageDetails page={foundPage} />}
        />
        <Route
          exact
          path="/page/:id/edit"
          render={() => (
            <Redirect to={`/page/${foundPage._id}/edit/general-info`} />
          )}
        />
        <Route
          path="/page/:id/edit"
          render={() => (
            <PageForm
              page={foundPage}
              chapters={chapters}
            />
          )}
        />
        <Route
          path="/page/:id/delete"
          render={() => (
            <DeleteConfirmation
              message="Are you sure you want to delete this page forever?"
              resource="pages"
              record={foundPage}
              response={(err, response) => {
                if (response && !err) {
                  replace('/site');
                }
              }}
            />
          )}
        />
      </Switch>
    </div>
  );
};

PageDetailsContainer.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({})),
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

PageDetailsContainer.defaultProps = {
  pages: [],
  chapters: [],
};

export default connect(
  state => ({
    pages: state.pages.list._list,
    chapters: state.chapters.list._list,
  }),
  null,
  null,
  { pure: false },
)(PageDetailsContainer);
