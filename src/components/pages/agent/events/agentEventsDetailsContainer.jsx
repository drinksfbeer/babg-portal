import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import Loading from '../../../common/loading/loading';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import EventDetails from '../../../resources/events/details/agentEventDetails';
import EventsForm from '../../../resources/events/form/publicEventsForm';
// import DeleteConfirmation from '../../../common/prompts/confirmation';

// AGENT !!!
const EventDetailsContainer = ({
  publicEvents,
  publicEventsListLoading,
  publicEventsUpdateLoading,
  publicEventVersions,
  // users,
  loading,
  // error,
  // history,
  match: {
    params: {
      id,
    },
  },
  user,
  chapters,
  settings,
}) => {
  const foundEvent = publicEvents.find(event => event._id === id);
  if (!foundEvent) return null;
  // const foundUser = users.find(user => user._id === foundEvent.userId);
  if (loading) return <Loading />;

  // TODO: add this back if `user.role` is `master` and when deletion API is working
  // {
  //   title: 'Delete',
  //   icon: 'delete_forever',
  //   to: `/sfbw/event/${foundEvent._id}/delete`,
  //   color: '#cc4b37',
  // }

  // figure out the current event's status
  let status = 'unknown';
  if (publicEventVersions && publicEventVersions.length > 0) {
    const eventVersion = publicEventVersions.find(version => version.userId === user._id);
    if (eventVersion.approved.includes(foundEvent._id)) status = 'approved';
    if (eventVersion.pending.includes(foundEvent._id)) status = 'pending';
    if (eventVersion.rejected.includes(foundEvent._id)) status = 'rejected';
    if (eventVersion.drafts.includes(foundEvent._id)) status = 'draft';
  }

  return (
    <div>
      <SectionHeader
        replaceHistory
        title={foundEvent.title}
        icon="today"
        sections={[{
          title: 'Back',
          icon: 'chevron_left',
          color: 'rgba(0,0,0,0.6)',
        }, {
          title: 'Details',
          icon: 'pageview',
          to: `/sfbw/event/${foundEvent._id}`,
        }, {
          title: 'Edit',
          icon: 'edit',
          to: `/sfbw/event/${foundEvent._id}/edit`,
        }, {
          title: 'Metrics',
          icon: 'bar_chart',
          to: `/sfbw/event/${foundEvent._id}/metrics`,
        }]}
      />
      <Route
        exact
        path="/sfbw/event/:id"
        render={() => (
          <EventDetails
            event={foundEvent}
          />
        )}
      />
      <Route
        exact
        path="/sfbw/event/:id/edit"
        render={() => (
          <div className="sectionPadding">
            <EventsForm
              user={user}
              loading={publicEventsListLoading || publicEventsUpdateLoading}
              event={foundEvent}
              chapters={chapters}
              settings={settings[0]}
              status={status}
            />
          </div>
        )}
      />
      <Route
        exact
        path="/sfbw/event/:id/metrics"
        render={() => (
          <div className="sectionPadding">
            <h3 style={{ color: '#616161', textAlign: 'center' }}>
              Insufficient data to display metrics.
            </h3>
          </div>
        )}
      />
      {/* <Route
        exact
        path="/sfbw/event/:id/delete"
        render={() => (
          <DeleteConfirmation
            resource="publicEvents"
            record={foundEvent}
            message="Are you sure you want to delete this event forever?"
            response={(err, data) => {
              if (!err && data) {
                history.push(`/member/${foundUser._id}`);
              }
            }}
          />
        )}
      /> */}
    </div>
  );
};

EventDetailsContainer.propTypes = {
  publicEvents: PropTypes.arrayOf(PropTypes.shape({})),
  publicEventsListLoading: PropTypes.bool,
  publicEventsUpdateLoading: PropTypes.bool,
  publicEventVersions: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  // users: PropTypes.arrayOf(PropTypes.shape({})),
  chapters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  settings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  user: PropTypes.shape({}).isRequired,
};

EventDetailsContainer.defaultProps = {
  loading: false,
  // users: [],
  publicEvents: [],
  publicEventsListLoading: true,
  publicEventsUpdateLoading: true,
  publicEventVersions: [],
};

export default connect(
  state => ({
    user: state.users.auth.user,
    // users: state.users.list._list,
    publicEvents: state.publicEvents.list._list,
    publicEventsListLoading: state.publicEvents.list.loading,
    publicEventsUpdateLoading: state.publicEvents.update.loading,
    publicEventVersions: state.publicEventVersions.list._list,
    chapters: state.chapters.list._list,
    settings: state.settings.list._list,
  }),
  null,
  null,
  { pure: false },
)(EventDetailsContainer);
