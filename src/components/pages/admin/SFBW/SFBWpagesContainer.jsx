import React from 'react';
import { connect } from 'react-redux';

import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import PagesList from '../../../resources/SFBW/list/pagesList';
import PageForm from '../../../resources/SFBW/form/pageForm';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import HeaderBuilder from '../pages/headerBuilder/headerBuilder';
import Actions from '../../../../redux/actions/';

const SFBWPagesContainer = ({
  SFBWpages: allPages,
}) => {
  const pages = allPages.filter(page => !page.chapterUuid);
  return (
    <div>
      <SectionHeader
        title="SFBW Website Pages"
        icon="web"
        sections={[{
          title: 'View Pages',
          icon: 'remove_red_eye',
          to: '/sfbw/site',
        },
          {
            title: 'Create New Page',
            icon: 'note_add',
            to: '/sfbw/site/new',
            exact: false,
          }]}
        replaceHistory
      />
      <Switch>
        <Route
          path="/sfbw/site/header"
          render={() => (
            <HeaderBuilder
              pages={pages.filter(page => page.activeOnHeader)}
            />
          )}
        />
        <Route
          path="/sfbw/site/new"
          component={PageForm}
        />
        <Route
          exact
          path="/sfbw/site"
          render={() => (
            <PagesList chapterUuid="non-chapter" />
          )}
        />
      </Switch>
    </div>
  );
};

SFBWPagesContainer.propTypes = {
  SFBWpages: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
  })),
};

SFBWPagesContainer.defaultProps = {
  SFBWpages: [],
};

export default connect(
  state => ({
    SFBWpages: state.SFBWpages.list._list,
  }),
  dispatch => ({ crudAction: bindActionCreators(Actions.crudAction, dispatch) }),
  null,
  { pure: false },
)(SFBWPagesContainer);
