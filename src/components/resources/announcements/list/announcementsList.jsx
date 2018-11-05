import React from 'react';
import PropTypes from 'prop-types';
import AnnouncementsListItem from '../listItem/announcementsListItem';

const AnnouncementsList = ({
  announcements,
  chapters,
  role,
  onDelete,
}) => (
  <div className="grid-x grid-padding-x grid-padding-y align-center">
    {announcements.map(announcement => (
      <AnnouncementsListItem
        key={announcement._id}
        announcement={announcement}
        chapters={chapters}
        role={role}
        onDelete={onDelete}
      />
    ))}
  </div>
);

AnnouncementsList.propTypes = {
  announcements: PropTypes.arrayOf(PropTypes.shape({})),
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  role: PropTypes.string,
  onDelete: PropTypes.func,
};

AnnouncementsList.defaultProps = {
  announcements: [],
  chapters: [],
  role: '',
  onDelete: () => {},
};

export default AnnouncementsList;
