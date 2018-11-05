import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const PLACEHOLDER_IMAGE = 'https://i.imgur.com/pz1PyS1.png';

const EventListItem = ({
  history,
  event,
  containerClass,
  featuredActionsVisible,
  asyncAction,
}) => {
  const member = (event.location && event.location.member) ? event.location.member : {};
  const startDateMoment = moment(event.startDate);
  const endDateMoment = moment(event.endDate);
  const startDayName = startDateMoment.format('dddd');
  const startMonth = startDateMoment.format('MMM');
  const startDayNum = startDateMoment.format('D');
  const startTime = startDateMoment.format('h:mm A');
  const endTime = endDateMoment.format('h:mm A');
  const isListView = containerClass.split(' ').includes('list');
  const actionTaken = ({ e, type }) => {
    e.preventDefault();
    e.stopPropagation();

    const key = 'editEvent';
    const pkg = {
      _id: event.id,
      changes: {},
    };
    const query = null;
    const callback = null;

    pkg.changes[type] = !event[type];

    asyncAction(key, pkg, query, callback);
  };

  return (
    <div
      className={containerClass}
      style={{ cursor: 'pointer' }}
      onClick={() => history.push(`/event/${event._id}`)}
    >
      <article>
        <div className="grid-x grid-padding-x profile align-middle">
          <div className="cell">
            <div className="profile-box">
              <img alt="brewery-logo" src={member.image} className="profile-image" />
              <span className="profile-name">{member.name}</span>
            </div>
          </div>
          {
            featuredActionsVisible.length > 0 &&
            <div className="cell actions">
              {
                featuredActionsVisible.includes('featured') &&
                <div
                  onClick={e => actionTaken({ e, type: 'featured' })}
                  className="item"
                >
                  <i
                    className={`material-icons ${event.featured ? 'md-active' : 'md-inactive'}`}
                  >
                    star
                  </i>
                  <span className="label">Featured</span>
                </div>
              }
              {
                featuredActionsVisible.includes('chapterFeatured') &&
                <div
                  onClick={e => actionTaken({ e, type: 'chapterFeatured' })}
                  className="item"
                >
                  <i
                    className={`material-icons ${event.chapterFeatured ? 'md-active' : 'md-inactive'}`}
                  >
                    star
                  </i>
                  <span className="label">Chapter Featured</span>
                </div>
              }
              {
                featuredActionsVisible.includes('marquee') &&
                <div
                  onClick={e => actionTaken({ e, type: 'marquee' })}
                  className="item"
                >
                  <i
                    className={`material-icons ${event.marquee ? 'md-active' : 'md-inactive'}`}
                  >
                    highlight
                  </i>
                  <span className="label">Marquee</span>
                </div>
              }
            </div>
          }
        </div>
        {
          !isListView &&
          <div>
            <div className="grid-x">
              <div className="cell">
                <img alt="event" src={event.image || PLACEHOLDER_IMAGE} width="100%" />
              </div>
            </div>
            <div className="grid-x grid-padding-x grid-padding-y">
              <div className="cell text-center">
                <span className="event-title h5">{event.title}</span>
              </div>
            </div>
            <div className="grid-x grid-padding-x grid-padding-y text-center align-middle">
              <div className="cell auto">
                <div className="startDayName">
                  {startDayName}
                </div>
                <div className="cell auto">
                  <div className="startMonthDay">
                    {startMonth} {startDayNum}
                  </div>
                </div>
              </div>
              <div className="cell auto time">
                <div className="grid-x">
                  <div className="cell">
                    {startTime}
                  </div>
                  <div className="cell">
                    &ndash;
                  </div>
                  <div className="cell">
                    {endTime}
                  </div>
                </div>
              </div>
              <div className="cell auto category">
                {event.category}
              </div>
            </div>
            <div className="grid-x grid-padding-x grid-padding-y text-center created">
              <div className="cell">
                <span>
                  created: {moment(event.created).format('lll')}
                </span>
              </div>
            </div>
          </div>
        }
        {
          isListView &&
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: 1 }}>
              <img alt="event" src={event.image || PLACEHOLDER_IMAGE} />
            </div>
            <div
              style={{
                flex: 3,
                flexDirection: 'column',
                margin: '0 1em 0 2em',
              }}
            >
              <div
                className="event-title h4"
                style={{
                  marginBottom: '0.5em',
                  lineHeight: '1.4',
                }}
              >
                {event.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div className="startDayName">
                    {startDayName}
                  </div>
                  <div className="startMonthDay">
                    {startMonth} {startDayNum}
                  </div>
                </div>
                <div className="time" style={{ flex: 1 }}>
                  {startTime} &ndash; {endTime}
                </div>
                <div className="category" style={{ flex: 1 }}>
                  {event.category}
                </div>
              </div>
              <div
                className="created"
                style={{
                  marginTop: '0.5em',
                  textAlign: 'right',
                }}
              >
                created: {moment(event.created).format('lll')}
              </div>
            </div>
          </div>
        }
      </article>
    </div>
  );
};

EventListItem.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    created: PropTypes.number.isRequired,
    startDate: PropTypes.number.isRequired,
    endDate: PropTypes.number.isRequired,
    image: PropTypes.string,
    location: PropTypes.shape({
      member: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  containerClass: PropTypes.string,
  featuredActionsVisible: PropTypes.arrayOf(PropTypes.string),
  asyncAction: PropTypes.func,
};

EventListItem.defaultProps = {
  history: {
    push: () => {},
    replace: () => {},
  },
  containerClass: '',
  featuredActionsVisible: [],
  asyncAction: null,
};

export default EventListItem;
