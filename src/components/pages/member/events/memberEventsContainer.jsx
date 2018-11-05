import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import actions from '../../../../redux/actions/index';

import AdminFormHeaderItem from '../../../resources/forms/header/adminFormHeaderItem';
import EventsForm from '../../../resources/events/form/eventsForm';
import EventsNav from '../../../resources/events/nav/eventsNav';
import EventsList from '../../../resources/events/list/eventsList';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import filterEvents from '../../../../helpers/eventFilters';

/*
const startDateFilter = (a, b) => {
  if (a.startDate > b.startDate) { return 1; }
  if (a.startDate < b.startDate) { return -1; }
  return 0;
};
*/

class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewType: 'grid',
      sortingFilter: '',
      recentFilter: true,
      categoryFilter: '',
      searchFilter: '',
    };
  }

  changeFeedState(newState) {
    this.setState({ ...newState });
  }

  render() {
    const {
      user,
      member,
      events,
      asyncAction,
    } = this.props;
    const {
      viewType,
      sortingFilter,
      recentFilter,
      categoryFilter,
      searchFilter,
    } = this.state;

    if (!member) return null;
    const usersEvents = events.filter(event => (
      event.location && event.location.member && event.location.member.uuid === member.uuid
    ));
    const unixNow = moment().startOf('day').valueOf();
    // TODO: filter based on upcoming and past events
    // (they have their own tabs in the members dashboard)
    const filteredEvents = filterEvents(sortingFilter, usersEvents, null, categoryFilter)
      // .sort(startDateFilter)
      .filter(event => !recentFilter || event.startDate > unixNow)
      .filter(event => !searchFilter || (event.title + (event.location && event.location.member && event.location.member.name)).toLowerCase().includes(searchFilter.toLowerCase())) // eslint-disable-line
      // .filter(event => !categoryFilter || event.category === categoryFilter);

    const featuredActionsVisible = [];
    if (user.role === 'chapter') featuredActionsVisible.push('chapterFeatured');

    return (
      <div>
        <SectionHeader
          title={`${member.name} - Events`}
          icon="calendar_today"
          sections={[{
            title: 'Your Upcoming Events',
            icon: 'today',
            to: '/events/upcoming',
            exact: true,
          }, {
            title: 'Past Events',
            icon: 'schedule',
            to: '/events/past',
          }, {
            title: 'Create New Event',
            icon: 'event_available',
            to: '/events/new',
          }]}
        />
        <Route
          exact
          path="/events"
          render={() => <Redirect to="/events/upcoming" />}
        />
        <Route
          exact
          path="/events/upcoming"
          render={() => {
            const currentUsersEvents = usersEvents
            .filter(event => moment(event.startDate).isAfter(moment()))
            .sort((a, b) => a.startDate > b.startDate);

            return (
              <div className="sectionPadding">
                <div className="grid-x grid-margin-y">
                  <AdminFormHeaderItem
                    title="Upcoming Events"
                    materialIcon="event"
                  />
                </div>
                <EventsNav
                  changeFeedState={newState => this.changeFeedState(newState)}
                  viewType={viewType}
                  events={currentUsersEvents}
                  filteredEvents={filteredEvents}
                  filters={{
                    sortingFilter,
                    recentFilter,
                    categoryFilter,
                    searchFilter,
                  }}
                  baseUrl="/events/upcoming"
                  newEventActive={false}
                />
                <EventsList
                  viewType={viewType}
                  events={filteredEvents}
                  featuredActionsVisible={featuredActionsVisible}
                  asyncAction={asyncAction}
                />
              </div>
            );
          }}
        />
        <Route
          exact
          path="/events/past"
          render={() => {
            const pastUsersEvents = usersEvents
            .filter(event => moment(event.startDate).isBefore(moment()))
            .sort((a, b) => a.startDate > b.startDate);

            return (
              <div className="grid-container sectionPadding">
                <div className="grid-x grid-margin-y">
                  <AdminFormHeaderItem
                    title="Past Events"
                    materialIcon="schedule"
                  />
                </div>
                <EventsList
                  events={pastUsersEvents}
                  featuredActionsVisible={featuredActionsVisible}
                  asyncAction={asyncAction}
                />
              </div>
            );
          }}
        />
        <Route
          exact
          path="/events/new"
          render={() => (
            <div className="sectionPadding">
              <EventsForm member={member} />
            </div>
          )}
        />
      </div>
    );
  }
}

ProfileContainer.propTypes = {
  user: PropTypes.shape({}),
  member: PropTypes.shape({}),
  events: PropTypes.arrayOf(PropTypes.shape({})),
  asyncAction: PropTypes.func,
};

ProfileContainer.defaultProps = {
  user: null,
  member: null,
  events: [],
  asyncAction: null,
};

export default connect(
  (state) => {
    const { user } = state.users.auth;
    const member = user && {
      ...user.member,
      locations: state.locations.list._list,
    };

    return {
      user,
      member,
      events: state.events.list._list,
    };
  },
  dispatch => ({
    asyncAction: bindActionCreators(actions.asyncAction, dispatch),
  }),
  null,
  { pure: false },
)(ProfileContainer);
