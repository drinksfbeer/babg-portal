import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import actions from '../../../../redux/actions';
import { sfbwCategories } from '../../../../refs/refs';

const PLACEHOLDER_IMAGE = 'https://i.imgur.com/pz1PyS1.png';
const statusColors = {
  approved: '#388E3C',
  rejected: '#D32F2F',
  pending: '#FB8C00',
  drafts: '#424242',
};

const createConditionalLink = status => (props) => {
  if (status === 'rejected') {
    return (
      <div {...props}>
        {props.children}
      </div>
    );
  }
  return (
    <Link {...props}>
      {props.children}
    </Link>
  );
};

const AgentEventListItem = ({
  event,
  status,
  // asyncAction,
  // isAdmin,
}) => {
  const ConditionalLink = createConditionalLink(status);
  const isUniqueType = event.eventType === 'unique';
  const eventLink = `/sfbw/event/${event._id}`;

  return (
    <div
      className="cell large-3 medium-4 eventListItem"
      style={{ opacity: status === 'rejected' ? 0.5 : 1 }}
    >
      <article>
        <div
          className="profile"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '68.5px',
            backgroundColor: statusColors[status],
            userSelect: 'none',
          }}
        >
          <div className="text-center">
            <h4 className="status" style={{ textTransform: 'capitalize' }}>
              {status === 'drafts' ? 'draft' : status}
            </h4>
          </div>
        </div>
        <ConditionalLink to={eventLink} className="grid-x">
          <div className="cell">
            <img
              alt="event"
              src={event.image || PLACEHOLDER_IMAGE}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </div>
        </ConditionalLink>
        <ConditionalLink to={eventLink} className="grid-x grid-padding-x grid-padding-y">
          <div className="cell text-center">
            <span className="event-title h5">{event.title}</span>
          </div>
        </ConditionalLink>
        <ConditionalLink to={eventLink} className="grid-x grid-padding-x grid-padding-y text-center align-middle">
          {isUniqueType && (() => {
            const eventDate = moment(event.date);
            const eventStartTime = moment(event.startTime);
            const eventEndTime = moment(event.endTime);
            const dateName = eventDate.format('dddd');
            const dateMonth = eventDate.format('MMM');
            const dateDate = eventDate.format('D');
            const startTime = eventStartTime.format('h:mm A');
            const endTime = eventEndTime.format('h:mm A');

            return (
              <React.Fragment>
                <div className="cell auto">
                  <div className="startDayName">{dateName}</div>
                  <div className="cell auto">
                    <div className="startMonthDay">{dateMonth} {dateDate}</div>
                  </div>
                </div>
                <div className="cell auto time">
                  <div className="grid-x">
                    <div className="cell">
                      {startTime}
                    </div>
                    <div className="cell">
                      -
                    </div>
                    <div className="cell">
                      {endTime}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })()}
          {!isUniqueType && (() => {
            const eventStartDate = moment(event.startDate);
            const eventEndDate = moment(event.endDate);
            const startDateName = eventStartDate.format('dddd');
            const startDateMonth = eventStartDate.format('MMM');
            const startDateDate = eventStartDate.format('D');
            const endDateName = eventEndDate.format('dddd');
            const endDateMonth = eventEndDate.format('MMM');
            const endDateDate = eventEndDate.format('D');

            return (
              <React.Fragment>
                <div className="cell auto">
                  <div className="startDayName">{startDateName}</div>
                  <div className="cell auto">
                    <div className="startMonthDay">{startDateMonth} {startDateDate}</div>
                  </div>
                </div>
                <div className="cell auto">
                  <div className="startDayName">{endDateName}</div>
                  <div className="cell auto">
                    <div className="startMonthDay">{endDateMonth} {endDateDate}</div>
                  </div>
                </div>
              </React.Fragment>
            );
          })()}
          <div className="cell auto category">
            {sfbwCategories.map((category) => {
              if (event.category === category.value) {
                return category.label;
              }
              return '';
            })}
          </div>
        </ConditionalLink>
        <div className="grid-x grid-padding-x grid-padding-y text-center created">
          <div
            className="cell"
            style={{
              marginBottom: '0',
              paddingBottom: '0',
              fontSize: '135%',
              fontWeight: 'bold',
            }}
          >
            {event.stripe.refunded ? 'refunded' : 'paid'}: ${(event.stripe.amount / 100).toFixed(2)}
          </div>
          <div
            className="cell"
            style={{ marginTop: '0', paddingTop: '0' }}
          >
            created: {moment(event.created).format('lll')}
          </div>
        </div>
      </article>
    </div>
  );
};

AgentEventListItem.propTypes = {
  event: PropTypes.shape({}),
  // asyncAction: PropTypes.func.isRequired,
  // isAdmin: PropTypes.bool,
  status: PropTypes.string,
};

AgentEventListItem.defaultProps = {
  event: {},
  // isAdmin: false,
  status: '',
};

// export default connect(
//   null,
//   dispatch => ({
//     asyncAction: bindActionCreators(actions.asyncAction, dispatch),
//   }),
// )(AgentEventListItem);

export default AgentEventListItem;
