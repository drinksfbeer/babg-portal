import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const AdminFormsNav = ({
  search,
  changeFormDirectoryState,
  chapter,
}) => {
  const newFormLink = chapter ? (
    `/chapters/${chapter.slug}/activity/forms/new`
  ) : (
    '/guild/forms/new'
  );

  return (
    <nav>
      <div className="grid-x ">
        <div className="cell auto">
          <Link
            to={newFormLink}
            className="button tiny"
          >
            New Form
          </Link>
        </div>
        <div className="cell auto">
          <input
            type="text"
            onChange={e => changeFormDirectoryState({ search: e.target.value })}
            value={search}
            placeholder="search by form name"
          />
        </div>
      </div>
      <div className="cell">
        <div
          className="grid-x grid-padding-y grid-padding-x app-item"
          style={{
            backgroundColor: '#333',
            color: 'white',
            fontWeight: '800',
          }}
        >
          <div className="cell large-7 medium-7">Name</div>
          <div className="cell large-3 medium-3">Url</div>
          <div className="cell large-2 medium-2">Created</div>
        </div>
      </div>
    </nav>
  );
};

AdminFormsNav.propTypes = {
  changeFormDirectoryState: PropTypes.func.isRequired,
  search: PropTypes.string,
  chapter: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }),
};

AdminFormsNav.defaultProps = {
  search: '',
  chapter: null,
};

export default AdminFormsNav;
