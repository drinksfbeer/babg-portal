import React from 'react';
import { connect } from 'react-redux';

import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import PagesList from '../../../resources/pages/list/pagesList';
import PageForm from '../../../resources/pages/form/pageForm';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import HeaderBuilder from './headerBuilder/headerBuilder';
import Actions from '../../../../redux/actions/';

const PagesContainer = ({
  pages: allPages,
}) => {
  const pages = allPages.filter(page => !page.chapterUuid);
  return (
    <div>
      <SectionHeader
        title="Guild Website Pages"
        icon="web"
        sections={[{
          title: 'View Pages',
          icon: 'remove_red_eye',
          to: '/site',
        },
          {
            title: 'Create New Page',
            icon: 'note_add',
            to: '/site/new',
            exact: false,
          },
          {
            title: 'Site Header',
            icon: 'power_input',
          to: '/site/header',
        }]}
        replaceHistory
      />
      <Switch>
        <Route
          path="/site/header"
          render={() => (
            <HeaderBuilder
              pages={pages.filter(page => page.activeOnHeader)}
            />
          )}
        />
        <Route
          path="/site/new"
          component={PageForm}
        />
        <Route
          exact
          path="/site"
          render={() => (
            // <PagesList pages={pages} />
            <PagesList chapterUuid="non-chapter" />
          )}
        />
      </Switch>
    </div>
  );
};

PagesContainer.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
  })),
};

PagesContainer.defaultProps = {
  pages: [],
};

export default connect(
  state => ({
    pages: state.pages.list._list,
  }),
  dispatch => ({ crudAction: bindActionCreators(Actions.crudAction, dispatch) }),
  null,
  { pure: false },
)(PagesContainer);
