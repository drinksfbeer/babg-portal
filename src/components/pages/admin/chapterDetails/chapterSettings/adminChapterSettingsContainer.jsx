import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SectionHeader from '../../../../common/sectionHeader/sectionHeader';
import ChapterForm from '../../../../resources/chapters/form/chaptersForm';

const AdminSettingsContainer = ({
  chapter,
}) => (
  <div>
    <SectionHeader
      title={`${chapter.name} Settings`}
      icon="settings"
      replaceHistory
      sections={[{
        title: 'Chapter Info',
        icon: 'account_balance',
        to: `/chapters/${chapter.slug}/settings`,
      }]}
    />
    <Route
      exact
      path="/chapters/:slug/settings"
      render={() => (
        <div className="sectionPadding">
          {chapter &&
            <ChapterForm
              chapter={chapter}
            />
          }
        </div>
      )}
    />
  </div>
);

AdminSettingsContainer.propTypes = {
  chapter: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

AdminSettingsContainer.defaultProps = {
};


export default connect(
  () => ({}),
  null,
  null,
  { pure: false },
)(AdminSettingsContainer);
