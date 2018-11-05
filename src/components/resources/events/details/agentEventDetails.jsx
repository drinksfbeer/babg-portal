import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import notifications from 'react-notification-system-redux';
import classNames from 'classnames';
import swal from 'sweetalert';
import actions from '../../../../redux/actions';
import LocationsMap from '../../locations/common/locationsMap';
import { sfbwCategories } from '../../../../refs/refs';
import Icon from '../../../common/icon/icon';

const PLACEHOLDER_IMAGE = 'https://i.imgur.com/pz1PyS1.png';

const EventDetails = ({
  event,
  publicEventVersions,
  asyncAction,
  success,
  error,
  user,
}) => {
  if (!event) return null;
  const isUniqueType = event.eventType === 'unique';
  const category = sfbwCategories.find(c => c.value === event.category);

  let status = 'unknown';
  if (Array.isArray(publicEventVersions) && publicEventVersions.length > 0) {
    if (publicEventVersions[0].approved.includes(event._id)) status = 'approved';
    if (publicEventVersions[0].pending.includes(event._id)) status = 'pending';
    if (publicEventVersions[0].rejected.includes(event._id)) status = 'rejected';
  }

  const actionTaken = ({ e, type }) => {
    e.preventDefault();
    e.stopPropagation();

    const key = 'adminUpdatePublicEvent';
    const pkg = {
      _id: event._id,
      adminId: user._id,
      changes: {},
    };
    const query = null;
    const callback = null;

    pkg.changes[type] = !event[type];

    asyncAction(key, pkg, query, callback);
  };

  return (
    <section className="eventDetails">
      <div
        className={classNames({
          agent: true,
          [status]: true,
        })}
      >
        <div className="status">
          {status}
        </div>
        {
          (status !== 'rejected' && user.role === 'master') &&
          <div className="features">
            <div
              className={classNames({
                item: true,
                active: event.featured,
              })}
              onClick={e => actionTaken({ e, type: 'featured' })}
            >
              <i className="material-icons">
                star
              </i>
              <span>
                Featured
              </span>
            </div>
            <div
              className={classNames({
                item: true,
                active: event.marquee,
              })}
              onClick={e => actionTaken({ e, type: 'marquee' })}
            >
              <i className="material-icons">
                highlight
              </i>
              <span>
                Marquee
              </span>
            </div>
          </div>
        }
        {
          (status === 'pending' && user.role === 'master') &&
          <div className="actions">
            <button
              className="button success eventApprovalButton"
              type="button"
              onClick={async () => {
                const confirmation = await swal({
                  title: `Approve ${event.title}?`,
                  text: 'You are about to approve this event. Continue?',
                  buttons: true,
                  dangerMode: true,
                });
                if (!confirmation) return;
                asyncAction('approvePublicEvent', {
                  _id: event._id,
                  adminId: user._id,
                }, null, (err, response) => {
                  if (err || !response) {
                    error({ title: 'Error Occured Approving Event' });
                  } else {
                    success({ title: 'Successfully Approved Event' });
                  }
                });
              }}
            >
              <Icon icon="thumbs-up" />
              <span style={{ marginLeft: '10px' }}>
                Approve
              </span>
            </button>
            <button
              className="button warning eventApprovalButton"
              type="button"
              onClick={async () => {
                const confirmation = await swal({
                  title: `Soft-Reject ${event.title}?`,
                  text: 'You are about to soft-reject this event.\n\n' +
                    'Another revision will be created that the user can edit. This event ' +
                    'will be shown as "Rejected" until they submit their event again. ' +
                    'The user will NOT be refunded for their submission. Continue?',
                  buttons: true,
                  dangerMode: true,
                });
                if (!confirmation) return;
                asyncAction('rejectPublicEvent', {
                  _id: event._id,
                  adminId: user._id,
                  type: 'soft',
                }, null, (err, response) => {
                  if (err || !response) {
                    error({ title: 'Error Occured Rejecting Event' });
                  } else {
                    success({ title: 'Successfully Soft-Rejected Event' });
                  }
                });
              }}
            >
              <Icon icon="exclamation-triangle" />
              <span style={{ marginLeft: '10px' }}>
                Soft-Reject
              </span>
            </button>
            <button
              className="button alert eventApprovalButton"
              type="button"
              onClick={async () => {
                const confirmation = await swal({
                  title: `Hard-Reject ${event.title}?`,
                  text: 'You are about to hard-reject this event.\n\n' +
                    'The user will be refunded in full for the submission fee they paid. ' +
                    'They will not be able to make any further changes to this event, which ' +
                    'will remain permanently rejected. Continue?',
                  buttons: true,
                  dangerMode: true,
                });
                if (!confirmation) return;
                asyncAction('rejectPublicEvent', {
                  _id: event._id,
                  adminId: user._id,
                  type: 'hard',
                }, null, (err, response) => {
                  if (err || !response) {
                    error({ title: 'Error Occured Rejecting Event' });
                  } else {
                    success({ title: 'Successfully Hard-Rejected Event' });
                  }
                });
              }}
            >
              <Icon icon="thumbs-down" />
              <span style={{ marginLeft: '10px' }}>
                Hard-Reject
              </span>
            </button>
          </div>
        }
      </div>
      <div className="grid-container" style={{ marginTop: '2em' }}>
        <div className="grid-x grid-padding-x grid-padding-y space-around">
          <div className="cell">
            <h2>{event.title}</h2>
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
              <div className="large-10 cell">
                <h3>{event.location.name}</h3>
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
              {isUniqueType && (() => {
                const eventDate = moment(event.date);
                const eventStartTime = moment(event.startTime);
                const eventEndTime = moment(event.endTime);
                const formattedDate = eventDate.format('dddd, MMMM D, Y');
                const startTime = eventStartTime.format('h:mm A');
                const endTime = eventEndTime.format('h:mm A');

                return (
                  <React.Fragment>
                    <div className="cell align-middle">
                      <div className="grid-x">
                        <div className="cell large-auto medium-auto small-12">
                          <i className="material-icons">today</i>
                        </div>
                        <div className="cell large-10 medium-10 small-12">
                          <span>
                            {formattedDate}
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
                  </React.Fragment>
                );
              })()}
              {!isUniqueType && (() => {
                const startDate = moment(event.startDate);
                const endDate = moment(event.endDate);
                const formattedStartDate = startDate.format('dddd, MMMM D, Y');
                const formattedEndDate = endDate.format('dddd, MMMM D, Y');

                return (
                  <React.Fragment>
                    <div className="cell align-middle">
                      <div className="grid-x">
                        <div className="cell large-auto medium-auto small-12">
                          <i className="material-icons">today</i>
                        </div>
                        <div className="cell large-10 medium-10 small-12">
                          <span>
                            {formattedStartDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="cell align-middle">
                      <div className="grid-x">
                        <div className="cell large-auto medium-auto small-12">
                          <i className="material-icons">event</i>
                        </div>
                        <div className="cell large-10 medium-10 small-12">
                          <span>
                            {formattedEndDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })()}
              <div className="cell align-middle">
                <div className="grid-x">
                  <div className="cell large-auto medium-auto small-12">
                    <i className="material-icons">
                      {category.icon || 'local_drink'}
                    </i>
                  </div>
                  <div className="cell large-10 medium-10 small-12 ">
                    <span>
                      {category.label}
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
  event: PropTypes.shape({}),
  user: PropTypes.shape({}).isRequired,
  publicEventVersions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  asyncAction: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired,
};

EventDetails.defaultProps = {
  event: {
    date: 1548979200,
  },
};

export default connect(
  state => ({
    user: state.users.auth.user,
    publicEventVersions: state.publicEventVersions.list._list,
  }),
  dispatch => ({
    asyncAction: bindActionCreators(actions.asyncAction, dispatch),
    success: bindActionCreators(notifications.success, dispatch),
    error: bindActionCreators(notifications.error, dispatch),
  }),
  null,
  { pure: false },
)(EventDetails);
