import React from 'react';
import PropTypes from 'prop-types';

const AdminChapterDetails = ({ chapter }) => {
  if (!chapter) return null;

  return (
    <div className="text-center">
      <h2>Welcome to {chapter.name} Chapter</h2>
    </div>
  );
};

AdminChapterDetails.propTypes = {
  chapter: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

AdminChapterDetails.defaultProps = {
  chapter: null,
};

export default AdminChapterDetails;
