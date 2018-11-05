import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';

const notifRef = id => ({
  event: `/event/${id}`,
  member: `/member/${id}`,
  location: `/member/${id}`,
});

const memberNotifRef = id => ({
  event: `/event/${id}`,
  member: `/member/${id}`,
  location: `/member/${id}`,
});

const NotificationsList = ({
  notifications,
  isAdmin,
  onDelete,
}) => (
  <div className="grid-x grid-padding-x grid-padding-y align-center">
    {notifications.map(notification => (
      <div
        key={notification._id}
        className="cell large-10 medium-11 app-item"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <img
            alt="notification"
            src={notification.image || 'http://tech.taskrabbit.com/images/authors/missing_person.png'}
            width="50px"
            style={{
              borderRadius: '100%',
              margin: '0px 15px 0px 15px',
            }}
          />
          <div>
            <Link
              to={(isAdmin ? notifRef : memberNotifRef)(notification.itemId)[notification.type]}
              style={{
                fontWeight: '600',
              }}
            >
              {notification.title}
            </Link>
            <div
              style={{
                color: 'rgba(0,0,0,0.75)',
                fontSize: '85%',
                padding: '3px 0px 3px 0px',
              }}
            >
              {notification.body}
            </div>
            <div
              style={{
                color: 'rgba(0,0,0,0.65)',
                fontSize: '70%',
              }}
            >
              {moment(notification.created).format('LLLL')}
            </div>
          </div>
        </div>
        {isAdmin &&
          <div>
            <span
              style={{
                cursor: 'pointer',
                color: 'rgba(0,0,0,0.7)',
                paddingRight: '20px',
                fontSize: '150%',
              }}
              onClick={() => onDelete(notification._id)}
            >
              &times;
            </span>
          </div>
        }
      </div>))}
  </div>
);

NotificationsList.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({})),
  isAdmin: PropTypes.bool,
  onDelete: PropTypes.func,
};
NotificationsList.defaultProps = {
  notifications: [],
  isAdmin: false,
  onDelete: () => {},
};
export default NotificationsList;
