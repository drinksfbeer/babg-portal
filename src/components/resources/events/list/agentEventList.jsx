import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EventListItem from '../listItem/agentEventListItem';

const AgentEventsList = ({
  loading,
  events,
  isAdmin,
  eventVersion,
  history,
}) => {
  const getEventStatus = (event) => {
    if (!eventVersion) {
      return '';
    }
    if (eventVersion.approved.includes(event._id)) return 'approved';
    if (eventVersion.pending.includes(event._id)) return 'pending';
    if (eventVersion.drafts.includes(event._id)) return 'drafts';
    if (eventVersion.rejected.includes(event._id)) return 'rejected';
    return 'unknown';
  };

  return (
    <section>
      <div className="grid-container">
        {
          (!loading && events.length < 1) &&
          <div className="grid-x grid-padding-x grid-padding-y">
            <div className="cell text-center">
              <h2>No Events</h2>
            </div>
            <div className="cell text-center">
              <FontAwesomeIcon
                size="5x"
                icon="kiwi-bird"
                style={{ opacity: 0.8 }}
              />
            </div>
            <div className="cell text-center" style={{ marginTop: '1.5em' }}>
              <h6>Submit an event for SF Beer Week today!</h6>
            </div>
            <div className="cell text-center">
              <button
                className="button"
                style={{ backgroundColor: '#1565C0' }}
                onClick={() => history.push('/sfbw/events/new')}
              >
                Submit an Event
              </button>
            </div>
          </div>
        }
        {
          events.length > 0 &&
          <div className="grid-x grid-margin-x grid-margin-y large-up-3">
            {events.map(event =>
              <EventListItem
                key={event._id}
                event={event}
                conainerClass="cell app-item"
                eventLink={`/event/${event._id}`}
                isAdmin={isAdmin}
                status={getEventStatus(event)}
              />)}
          </div>
        }
      </div>
    </section>
  );
};

AgentEventsList.propTypes = {
  loading: PropTypes.bool,
  events: PropTypes.arrayOf(PropTypes.shape({})),
  eventVersion: PropTypes.shape({}),
  isAdmin: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

AgentEventsList.defaultProps = {
  loading: false,
  events: [],
  eventVersion: null,
  isAdmin: false,
};

export default withRouter(AgentEventsList);
