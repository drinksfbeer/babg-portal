import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import Loading from '../../../common/loading/loading';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import AdminChaptersList from '../../../resources/chapters/list/adminChaptersList';
import ChaptersForm from '../../../resources/chapters/form/chaptersForm';


const ChaptersContainer = ({
  _list: list,
  loading,
  error,
}) => (
  <div>
    <SectionHeader
      title="Chapters"
      icon="account_balance"
      sections={[{
        title: 'Chapters',
        icon: 'list',
        to: '/chapters',
      }, {
        title: 'Create New Chapter',
        icon: 'note_add',
        to: '/chapters/new',
      }]}
    />
    <Route
      exact
      path="/chapters"
      render={() => (
        <div className="sectionPadding">
          {loading && <Loading />}
          {error && <div style={{ color: 'red' }}>An Error Has Occurred</div>}
          <AdminChaptersList chapters={list} />
        </div>
      )}
    />
    <Route
      path="/chapters/new"
      render={() => (
        <div className="sectionPadding">
          <ChaptersForm />
        </div>
      )}
    />
  </div>
);

ChaptersContainer.propTypes = {
  _list: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

ChaptersContainer.defaultProps = {
  _list: [],
  loading: false,
  error: false,
};

export default connect(
  state => state.chapters.list,
  null,
  null,
  { pure: false },
)(ChaptersContainer);
