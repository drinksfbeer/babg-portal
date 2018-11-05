import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { categories } from '../../../../refs/refs';

const sortingFilters = [
  { value: 'date-asc', label: 'Date: Oldest to Newest' },
  { value: 'date-desc', label: 'Date: Newest to Oldest' },
  { value: 'title-asc', label: 'Event Title: A-Z' },
  { value: 'title-desc', label: 'Event Title: Z-A' },
  { value: 'chapter', label: 'Chapter' },
  { value: 'category', label: 'Category' },
];

const EventsNav = ({
  changeFeedState,
  chapters,
  events,
  filteredEvents,
  viewType,
  filters: {
    recentFilter,
    sortingFilter,
    chapterFilter,
    categoryFilter,
    searchFilter,
  },
  chapterFilterVisible,
  recentFilterVisible,
  baseUrl,
  newEventActive,
}) => (
  <section className="eventsNav">
    <div className="grid-container fluid">
      <div
        className="grid-x grid-margin-x grid-margin-y"
      >
        {
          newEventActive &&
          <div className="cell large-1 medium-1 text-center">
            <Link
              to={`${baseUrl}/new`}
              className="button small"
              style={{ marginBottom: '0px' }}
            >
              New Event
            </Link>
          </div>
        }
        <div className="cell large-auto medium-auto">
          <input
            value={searchFilter}
            onChange={e => changeFeedState({ searchFilter: e.target.value })}
            placeholder={`search event name${chapterFilterVisible ? ' or brewery name' : ''}`}
            type="text"
          />
        </div>
        <div className="cell large-auto medium-auto">
          <select
            value={sortingFilter}
            onChange={e => changeFeedState({ sortingFilter: e.target.value })}
          >
            <option value="{}">sort by</option>
            {sortingFilters.map((filter) => {
              if (!chapterFilterVisible && filter.value === 'chapter') return null;
              return (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              );
            })}
          </select>
        </div>
        {
          (chapterFilterVisible && sortingFilter === 'chapter') &&
          <div className="cell large-auto medium-auto">
            <select
              value={chapterFilter}
              onChange={e => changeFeedState({ chapterFilter: e.target.value })}
            >
              <option value="">choose a chapter</option>
              {chapters.map((chapter) => {
                const numEvents = events.filter(event =>
                  event.location.member.chapterUuid === chapter.uuid).length;
                const eventsPlurality = numEvents === 1 ? '' : 's'; // being gramatically correct!

                return (
                  <option
                    key={chapter.uuid}
                    value={chapter.uuid}
                    disabled={numEvents < 1}
                  >
                    {chapter.name} ({numEvents} event{eventsPlurality})
                  </option>
                );
              })}
            </select>
          </div>
        }
        {
          sortingFilter === 'category' &&
          <div className="cell large-auto medium-auto">
            <select
              value={categoryFilter}
              onChange={e => changeFeedState({ categoryFilter: e.target.value })}
            >
              <option value="">choose a category</option>
              {categories.map((category) => {
                const numEvents = events.filter(event => event.category === category).length;
                const eventsPlurality = numEvents === 1 ? '' : 's';

                return (
                  <option
                    value={category}
                    key={category}
                    disabled={numEvents < 1}
                  >
                    {category} ({numEvents} event{eventsPlurality})
                  </option>
                );
              })}
            </select>
          </div>
        }
        {
          recentFilterVisible &&
          <div className="cell large-auto medium-auto">
            <div className="grid-x">
              <div className="cell auto">
                <button
                  className={!recentFilter ? 'button small expanded' : 'button small hollow expanded'}
                  onClick={() => changeFeedState({ recentFilter: false })}
                  style={{ borderRadius: '4px 0px 0px 4px' }}
                >
                  All
                </button>
              </div>
              <div className="cell auto">
                <button
                  className={recentFilter ? 'button small expanded' : 'button small hollow expanded'}
                  onClick={() => changeFeedState({ recentFilter: true })}
                  style={{ borderRadius: '0px 4px 4px 0px' }}
                >
                  Upcoming
                </button>
              </div>
            </div>
          </div>
        }
        <div className="cell large-1 medium-1 text-center">
          <div className="grid-x">
            <div
              className={classNames({
                cell: true,
                auto: true,
                viewType: true,
                selected: viewType === 'grid',
              })}
              onClick={() => changeFeedState({ viewType: 'grid' })}
            >
              <i className="material-icons" style={{ fontSize: '28px' }}>
                view_comfy
              </i>
            </div>
            <div
              className={classNames({
                cell: true,
                auto: true,
                viewType: true,
                selected: viewType === 'list',
              })}
              onClick={() => changeFeedState({ viewType: 'list' })}
            >
              <i className="material-icons">list</i>
            </div>
          </div>
        </div>
        <div
          className="cell large-1 medium-1"
          style={{
            paddingTop: '6px',
            // fontSize: '80%',
            whiteSpace: 'pre-line',
            color: 'rgba(0,0,0,0.6)',
          }}
        >
          {filteredEvents.length} found
        </div>
      </div>
    </div>
  </section>
);

EventsNav.propTypes = {
  changeFeedState: PropTypes.func.isRequired,
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  events: PropTypes.arrayOf(PropTypes.shape({})),
  filteredEvents: PropTypes.arrayOf(PropTypes.shape({})),
  viewType: PropTypes.string,
  filters: PropTypes.shape({
    sortingFilter: PropTypes.string,
    recentFilter: PropTypes.bool,
    chapterFilter: PropTypes.string,
    categoryFilter: PropTypes.string,
    searchFilter: PropTypes.string,
  }),
  chapterFilterVisible: PropTypes.bool,
  recentFilterVisible: PropTypes.bool,
  baseUrl: PropTypes.string,
  newEventActive: PropTypes.bool,
};

EventsNav.defaultProps = {
  chapters: [],
  events: [],
  filteredEvents: [],
  viewType: 'grid',
  filters: {
    sortingFilter: '',
    recentFilter: true,
    chapterFilter: '',
    categoryFilter: '',
    searchFilter: '',
  },
  chapterFilterVisible: false,
  recentFilterVisible: false,
  baseUrl: '/guild/events',
  newEventActive: false,
};

export default EventsNav;
