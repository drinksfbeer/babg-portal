import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import EventListItem from '../listItem/eventListItem';

// list is like the feed but does not have a nav or anything
const EventsList = ({
  history,
  events,
  viewType,
  fitToBox,
  featuredActionsVisible,
  asyncAction,
}) => (
  <section
    className={`eventsList ${fitToBox ? 'fit-to-box' : ''}`}
    style={fitToBox ? {
      width: '100%',
    } : {}}
  >
    <div
      className={classNames({
        'grid-container': true,
        fluid: true,
        list: viewType === 'list',
      })}
    >
      <div
        className={classNames({
          'grid-x': true,
          'grid-margin-x': true,
          'grid-margin-y': true,
          'large-up-4': viewType === 'grid',
          'medium-up-2': viewType === 'grid',
        })}
      >
        {events.map(event => (
          <EventListItem
            key={event._id}
            history={history}
            event={event}
            containerClass={classNames({
              cell: true,
              'app-item': true,
              eventListItem: true,
              grid: viewType === 'grid',
              list: viewType === 'list',
            })}
            featuredActionsVisible={featuredActionsVisible}
            eventLink={`/event/${event._id}`}
            asyncAction={asyncAction}
          />
        ))}
      </div>
    </div>
  </section>
);

EventsList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  events: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
  })),
  viewType: PropTypes.string,
  fitToBox: PropTypes.bool,
  featuredActionsVisible: PropTypes.arrayOf(PropTypes.string),
  asyncAction: PropTypes.func,
};

EventsList.defaultProps = {
  history: {
    push: () => {},
    replace: () => {},
  },
  events: [],
  viewType: 'grid',
  fitToBox: false,
  featuredActionsVisible: [],
  asyncAction: null,
};

export default withRouter(EventsList);
