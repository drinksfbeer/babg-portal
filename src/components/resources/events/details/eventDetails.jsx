import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import LocationsMap from '../../locations/common/locationsMap';
import { categoryIcons } from '../../../../refs/refs';

const PLACEHOLDER_IMAGE = 'https://i.imgur.com/pz1PyS1.png';

const EventDetails = ({ event }) => {
  if (!event) return null;

  const startDateMoment = moment(event.startDate);
  const endDateMoment = moment(event.endDate);
  const startDayName = startDateMoment.format('dddd');
  const startMonth = startDateMoment.format('MMMM');
  const startYear = startDateMoment.format('Y');
  const startDayNum = startDateMoment.format('D');
  const startTime = startDateMoment.format('h:mm A');
  const endTime = endDateMoment.format('h:mm A');

  return (
    <section className="eventDetails">

      <div className="grid-container">
        <div className="grid-x grid-padding-x space-around">
          <div
            className="cell"
            style={{
              fontSize: '150%',
              fontWeight: '600',
              padding: '20px',
            }}
          >
            {event.title}
            <a
              className="button eventLink"
              href={`http://bayareabrewersguild.floc.beer/events/${event.slug}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              View on Public Site
            </a>
          </div>
          <div className="cell text-left large-8">
            <div className="grid-x grid-margin-y">
              <div className="cell">
                <img src={event.image || PLACEHOLDER_IMAGE} alt="event" width="100%" />
              </div>
            </div>

            <div className="grid-x grid-padding-x grid-padding-y">
              <div className="cell">
                <div dangerouslySetInnerHTML={{ __html: event.body }} /> {/* eslint-disable-line */}
              </div>
            </div>
          </div>

          <div className="cell large-4">

            <div className="grid-x grid-padding-y grid-padding-x">
              <div className="cell auto">
                <img alt="memberimage" src={event.location.member.image} style={{ borderRadius: '100%' }} />
              </div>
              <div className="large-10 cell">
                <span>{event.location.member.name}</span>
                <div>{event.location.name}</div>
              </div>
            </div>

            <div className="grid-x grid-padding-y">
              <div className="cell">
                <LocationsMap
                  locations={[event.location]}
                />
              </div>
            </div>
            <div className="grid-x grid-padding-y">
              <div className="cell align-middle">
                <div className="grid-x">
                  <div className="cell large-auto medium-auto small-12">
                    <i className="material-icons">location_on</i>
                  </div>
                  <div className="cell large-10 medium-10 small-12">
                    <a
                      className="eventAddress"
                      href={`https://maps.google.com/?q=${event.location.street} ${event.location.city} ${event.location.state} ${event.location.zip}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>
                        {event.location.street},&nbsp;
                        {event.location.city}, {event.location.state} {event.location.zip}
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="cell align-middle">
                <div className="grid-x">
                  <div className="cell large-auto medium-auto small-12">
                    <i className="material-icons">today</i>
                  </div>
                  <div className="cell large-10 medium-10 small-12">
                    <span>
                      {startDayName}, {startMonth} {startDayNum}, {startYear}
                    </span>
                  </div>
                </div>
              </div>

              <div className="cell align-middle">
                <div className="grid-x">
                  <div className="cell large-auto medium-auto small-12">
                    <i className="material-icons">access_time</i>
                  </div>
                  <div className="cell large-10 medium-10 small-12">
                    <span>
                      {startTime} &ndash; {endTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="cell align-middle">
                <div className="grid-x">
                  <div className="cell large-auto medium-auto small-12">
                    <i className="material-icons">
                      {categoryIcons[event.category] || 'local_drink'}
                    </i>
                  </div>
                  <div className="cell large-10 medium-10 small-12 ">
                    <span>
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="cell">
                <div className="button-group">
                  {
                    event.eventUrl &&
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={event.eventUrl}
                      className="button"
                    >
                        Event Link
                    </a>
                  }
                  {
                    event.ticketUrl &&
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={event.ticketUrl}
                      className="button "
                    >
                        Buy Tickets
                    </a>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

EventDetails.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    startDate: PropTypes.number.isRequired,
    endDate: PropTypes.number.isRequired,
  }),
};

EventDetails.defaultProps = {
  event: null,
};
export default EventDetails;
