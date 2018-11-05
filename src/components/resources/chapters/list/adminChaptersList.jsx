import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AdminChapterListItem from '../listItem/adminChapterListItem';

const AdminChaptersList = ({ chapters }) => (
  <div>
    <div className="grid-x grid-margin-x grid-margin-y">
      {chapters.map(chapter => (
        <Link
          to={`/chapters/${chapter.slug}`}
          className="cell large-4 medium-6 small-10"
          key={chapter._id}
        >
          <AdminChapterListItem
            chapter={chapter}
          />
        </Link>
      ))}
    </div>
  </div>
);

AdminChaptersList.propTypes = {
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
};
AdminChaptersList.defaultProps = {
  chapters: [],
};

export default AdminChaptersList;
