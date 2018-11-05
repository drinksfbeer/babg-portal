import React from 'react';
import { connect } from 'react-redux';

import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import PagesList from '../../../../resources/pages/list/pagesList';
import PageForm from '../../../../resources/pages/form/pageForm';
import SectionHeader from '../../../../common/sectionHeader/sectionHeader';


const PagesContainer = ({
  // pages: allPages,
  chapter,
}) => {
  if (!chapter) return null;
  // const pages = allPages.filter(page => page.chapterUuid === chapter.uuid);
  return (
    <div>
      <SectionHeader
        title={`${chapter.name} Website Pages`}
        icon="web"
        sections={[{
          title: 'View Pages',
          icon: 'remove_red_eye',
          to: `/chapters/${chapter.slug}/site`,
        },
          {
            title: 'Create New Page',
            icon: 'note_add',
          to: `/chapters/${chapter.slug}/site/new`,
            exact: false,
        }]}
        replaceHistory
      />
      <Switch>
        <Route
          path={`/chapters/${chapter.slug}/site/new`}
          render={() => (
            <PageForm
              chapter={chapter}
            />
          )}
        />
        <Route
          exact
          path={`/chapters/${chapter.slug}/site`}
          render={() => (
            // <PagesList pages={pages} />
            <PagesList chapterUuid={chapter.uuid} />
          )}
        />
      </Switch>
    </div>
  );
};
PagesContainer.propTypes = {
  /* pages: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
  })), */
  chapter: PropTypes.shape({}).isRequired,
};

PagesContainer.defaultProps = {
  // pages: [],
};

export default connect(
  /* state => ({
    pages: state.pages.list._list,
  }), */
  null,
  null,
  null,
  { pure: false },
)(PagesContainer);
