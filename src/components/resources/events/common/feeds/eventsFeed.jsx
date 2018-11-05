import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Route, Switch, Link } from 'react-router-dom';

import EventsList from '../../list/eventsList';
import EventsNav from '../../nav/eventsNav';
import EventForm from '../../form/eventsForm';
import filterEvents from '../../../../../helpers/eventFilters';

class EventsFeed extends React.Component {
  state = {
    viewType: 'grid',
    recentFilter: true,
    sortingFilter: '',
    chapterFilter: '',
    categoryFilter: '',
    searchFilter: '',
  };

  changeFeedState = newState => this.setState(newState)

  render() {
    const {
      viewType,
      sortingFilter,
      recentFilter,
      chapterFilter,
      categoryFilter,
      searchFilter,
    } = this.state;
    const {
      chapters,
      events,
      // chapterFilterVisible,
      recentFilterVisible,
      featuredActionsVisible,
      baseUrl,
      newEventActive,
      member,
      asyncAction,
    } = this.props;
    const chaptersWithMaster = JSON.parse(JSON.stringify(chapters)); // deep-copy
    chaptersWithMaster.splice(0, 0, { name: 'Bay Area Brewers Guild', uuid: 'none' });
    const unixNow = moment().startOf('day').valueOf();
    const filteredEvents = filterEvents(sortingFilter, events, chapterFilter, categoryFilter)
      // .sort(startDateFilter)
      .filter(event => !recentFilter || event.startDate > unixNow)
      .filter(event => !searchFilter || (event.title + (event.location && event.location.member && event.location.member.name)).toLowerCase().includes(searchFilter.toLowerCase())) // eslint-disable-line
      // .filter(event => !categoryFilter || event.category === categoryFilter);

    return (
      <section className="eventsFeed">
        <Switch>
          <Route
            exact
            path={baseUrl}
            render={props => [
              <EventsNav
                key="eventsNav"
                changeFeedState={this.changeFeedState}
                viewType={viewType}
                filters={{
                  sortingFilter,
                  recentFilter,
                  chapterFilter,
                  categoryFilter,
                  searchFilter,
                }}
                chapters={chaptersWithMaster}
                events={events}
                filteredEvents={filteredEvents}
                // chapterFilterVisible={chapterFilterVisible}
                recentFilterVisible={recentFilterVisible}
                baseUrl={baseUrl}
                newEventActive={newEventActive}
              />,
              <EventsList
                key="eventsList"
                viewType={viewType}
                featuredActionsVisible={featuredActionsVisible}
                events={filteredEvents}
                asyncAction={asyncAction}
                {...props}
              />,
            ]}
          />
          <Route
            exact
            path={`${baseUrl}/new`}
            render={() => (
              <div>
                <Link to={baseUrl}>
                  <span style={{ fontSize: '200%' }}>&#8249;</span>
                  Back to Events Feed
                </Link>
                <h2>Create a new event</h2>
                <EventForm member={member} />
              </div>
            )}
          />
        </Switch>
      </section>
    );
  }
}

EventsFeed.propTypes = {
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  events: PropTypes.arrayOf(PropTypes.shape({})),
  chapterFilterVisible: PropTypes.bool,
  recentFilterVisible: PropTypes.bool,
  featuredActionsVisible: PropTypes.arrayOf(PropTypes.string),
  baseUrl: PropTypes.string,
  newEventActive: PropTypes.bool,
  member: PropTypes.shape({}),
  asyncAction: PropTypes.func,
};

EventsFeed.defaultProps = {
  chapters: [],
  events: [],
  chapterFilterVisible: false,
  recentFilterVisible: false,
  featuredActionsVisible: [],
  baseUrl: '/guild/events',
  newEventActive: false,
  member: undefined,
  asyncAction: null,
};

export default EventsFeed;
