import React from 'react';
import PropTypes from 'prop-types';

const AdminChapterListItem = ({ chapter }) => (
  <div
    className="cover-item"
    style={{ backgroundImage: `url('${chapter.image}')` }}
  >
    <div className="content">
      <h4>{chapter.name}</h4>
      <div>{chapter.slug}</div>
    </div>
  </div>
);

AdminChapterListItem.propTypes = {
  chapter: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default AdminChapterListItem;
