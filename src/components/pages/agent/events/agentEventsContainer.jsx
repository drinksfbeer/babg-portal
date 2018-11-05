import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import PublicEventsForm from '../../../resources/events/form/publicEventsForm';
import AgentEventList from '../../../resources/events/list/agentEventList';

const AgentEventsContainer = ({
  user,
  publicEventsListLoading,
  publicEventsFormLoading,
  formState,
  chapters,
  settings,
  publicEvents,
  publicEventVersions,
}) => {
  const latestVersions = publicEventVersions.length > 0 ? publicEvents.filter((event) => {
    const { revisions } = publicEventVersions[0];
    const refId = event.masterId ? event.masterId : event._id;
    if (revisions[refId].length < 1) {
      return true;
    }
    const index = revisions[refId].findIndex(id => id === event._id);
    return index === revisions[refId].length - 1;
  }) : [];

  return (
    <div>
      <SectionHeader
        title="Your SFBW Events"
        icon={['far', 'calendar-alt']}
        sections={[{
          title: 'View My Events',
          icon: 'remove_red_eye',
          to: '/sfbw/events',
          exact: true,
        }, {
          title: 'Submit Event',
          icon: 'add_circle_outline',
          to: '/sfbw/events/new',
        }]}
      />
      <Route
        exact
        strict
        path="/sfbw/events"
        render={() => (
          <div className="sectionPadding">
            <AgentEventList
              loading={publicEventsListLoading}
              events={latestVersions}
              eventVersion={publicEventVersions[0]}
            />
          </div>
        )}
      />
      {
        user && Array.isArray(user.permissions) && user.permissions.includes('submit_events') &&
        <Route
          exact
          path="/sfbw/events/new"
          render={() => (
            <div className="sectionPadding">
              <PublicEventsForm
                user={user}
                loading={publicEventsFormLoading}
                formState={formState}
                chapters={chapters}
                settings={settings[0]}
              />
            </div>
          )}
        />
      }
    </div>
  );
};

AgentEventsContainer.propTypes = {
  user: PropTypes.shape({}),
  publicEventsListLoading: PropTypes.bool,
  publicEventsFormLoading: PropTypes.bool,
  formState: PropTypes.shape({}),
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  publicEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  publicEventVersions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  settings: PropTypes.arrayOf(PropTypes.shape({})),
};

AgentEventsContainer.defaultProps = {
  user: {},
  publicEventsListLoading: false,
  publicEventsFormLoading: false,
  formState: {},
  chapters: [],
  settings: [],
};

export default connect(
  state => ({
    user: state.users.auth.user,
    publicEventsListLoading: state.publicEvents.list.loading,
    publicEventsFormLoading: state.publicEvents.form.loading,
    publicEvents: state.publicEvents.list._list,
    publicEventVersions: state.publicEventVersions.list._list,
    formState: state.form,
    chapters: state.chapters.list._list,
    settings: state.settings.list._list,
  }),
  null,
  null,
  { pure: false },
)(AgentEventsContainer);
