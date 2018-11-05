import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import Loading from '../../../common/loading/loading';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';

import EventDetails from '../../../resources/events/details/eventDetails';
import EventsForm from '../../../resources/events/form/eventsForm';
import DeleteConfirmation from '../../../common/prompts/confirmation';

// assumes this component will be used as a component prop for a Route component

const EventDetailsContainer = ({
  events,
  member,
  loading,
  // error,
  history,
  match: {
    params: {
      id,
    },
  },
}) => {
  const foundEvent = events.find(event => event._id === id);
  if (!foundEvent) return null;
  const eventMemberUuid = (foundEvent.location && foundEvent.location.member) && foundEvent.location.member.uuid; // eslint-disable-line
  const canEdit = member && (eventMemberUuid === member.uuid);

  if (loading) {
    return <Loading />;
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
          to: `/event/${foundEvent._id}`,
        }, {
          title: 'Edit',
          icon: 'edit',
          to: `/event/${foundEvent._id}/edit`,
          inactive: !canEdit,
        }, {
          title: 'Metrics',
          icon: 'bar_chart',
          to: `/event/${foundEvent._id}/metrics`,
          inactive: !canEdit,
        }, {
          title: 'Delete',
          icon: 'delete_forever',
          to: `/event/${foundEvent._id}/delete`,
          color: '#cc4b37',
          inactive: !canEdit,
        }]}
      />
      <Route
        exact
        path="/event/:id"
        render={() => (
          <EventDetails
            event={foundEvent}
          />
        )}
      />
      {
        canEdit &&
        <Route
          exact
          path="/event/:id/edit"
          render={() => (
            <div className="cell large-8 medium-10">
              <EventsForm
                member={member}
                event={foundEvent}
              />
            </div>
          )}
        />
      }
      {
        canEdit &&
        <Route
          exact
          path="/event/:id/delete"
          render={() => (
            <DeleteConfirmation
              resource="events"
              record={foundEvent}
              message="Are you sure you want to delete this event forever?"
              response={(err, data) => {
                if (!err && data) {
                  history.push(`/member/${member._id}`);
                }
              }}
            />
          )}
        />
      }
    </div>
  );
};

EventDetailsContainer.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  // error: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  member: PropTypes.shape({}).isRequired,
};

EventDetailsContainer.defaultProps = {
  events: [],
  loading: false,
  // error: false,
};
export default connect(
  (state) => {
    const { user } = state.users.auth;
    const member = user && {
      ...user.member,
      locations: state.locations.list._list,
    };
    return {
      member,
      events: state.events.list._list,
    };
  },
  null,
  null,
  { pure: false },
)(EventDetailsContainer);
