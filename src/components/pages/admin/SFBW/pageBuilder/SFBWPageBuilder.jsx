import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SectionHeader from '../../../../common/sectionHeader/sectionHeader';
import PageForm from '../../../../resources/SFBW/form/pageForm';
import PageDetails from '../../../../resources/SFBW/details/pageDetails';
import DeleteConfirmation from '../../../../common/prompts/confirmation';

const SFBWPageBuilder = ({
  SFBWpages,
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
  const foundPage = SFBWpages.find(page => page._id === id);
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
          to: `/sfbw/page/${foundPage._id}`,
        },
        {
          title: 'Edit',
          icon: 'edit',
          to: `/sfbw/page/${foundPage._id}/edit`,
        },
        {
          title: 'Delete',
          icon: 'delete_forever',
          to: `/sfbw/page/${foundPage._id}/delete`,
          color: '#cc4b37',
        }]}
        replaceHistory
      />
      <Switch>
        <Route
          exact
          path="/sfbw/page/:id"
          render={() => <PageDetails page={foundPage} />}
        />
        <Route
          exact
          path="/sfbw/page/:id/edit"
          render={() => (
            <Redirect to={`/sfbw/page/${foundPage._id}/edit/general-info`} />
          )}
        />
        <Route
          path="/sfbw/page/:id/edit"
          render={() => (
            <PageForm
              page={foundPage}
              chapters={chapters}
            />
          )}
        />
        <Route
          path="/sfbw/page/:id/delete"
          render={() => (
            <DeleteConfirmation
              message="Are you sure you want to delete this page forever?"
              resource="SFBWpages"
              record={foundPage}
              response={(err, response) => {
                if (response && !err) {
                  replace('/SFBW/site');
                }
              }}
            />
          )}
        />
      </Switch>
    </div>
  );
};

SFBWPageBuilder.propTypes = {
  SFBWpages: PropTypes.arrayOf(PropTypes.shape({})),
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

SFBWPageBuilder.defaultProps = {
  SFBWpages: [],
  chapters: [],
};

export default connect(
  state => ({
    SFBWpages: state.SFBWpages.list._list,
    chapters: state.chapters.list._list,
  }),
  null,
  null,
  { pure: false },
)(SFBWPageBuilder);
