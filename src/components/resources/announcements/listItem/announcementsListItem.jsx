import React from 'react';
import PropTypes from 'prop-types';
import Linkify from 'react-linkify';
import swal from 'sweetalert2';
import moment from 'moment';
import AnnouncementsForm from '../form/announcementsForm';

export default class AnnouncementsListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
    };
  }

  async _toggleEditMode() {
    const { isEditing } = this.state;
    this.setState({ isEditing: !isEditing });
  }

  async _delete() {
    const { announcement, onDelete } = this.props;

    const confirmation = await swal({
      title: 'Are you sure you want to delete this announcement?',
      showCancelButton: true,
      confirmButtonColor: '#333',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
    if (confirmation.value) onDelete(announcement._id);
  }

  render() {
    const {
      announcement,
      chapters,
      role,
    } = this.props;
    const { isEditing } = this.state;

    // chapter's uuid is the key, chapter's name is the value
    const chapterList = chapters.reduce((list, chapter) => {
      list[chapter.uuid] = chapter.name; // eslint-disable-line
      return list;
    }, {});

    // for chapter admins, since we only load announcements pertaining to that particular
    // chapter (`query` in `crudAction`), we only check if the `chapterId` key is not null.
    // if it is null, then they can only read
    const canModify = (role === 'master') || (role === 'chapter' && announcement.chapterUuid);

    return (
      <div
        className="cell large-7 medium-8 app-item"
        style={{
          position: 'relative',
          marginBottom: '1em',
        }}
      >
        {
          canModify &&
          <div
            className="button tiny"
            style={{
              position: 'absolute',
              top: '10px',
              right: '50px',
              userSelect: 'none',
            }}
            onClick={() => this._toggleEditMode()}
          >
            {isEditing ? 'back' : 'edit'}
          </div>
        }
        {
          canModify &&
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '15px',
              fontSize: '200%',
              color: 'rgba(0, 0, 0, 0.7)',
              lineHeight: '100%',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={() => this._delete()}
          >
            &times;
          </div>
        }
        <div
          style={{
            paddingBottom: '1em',
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: '75%',
          }}
        >
          {moment(announcement.created).format('LLLL')}
        </div>
        {
          isEditing &&
          <AnnouncementsForm
            form={announcement._id}
            announcement={announcement}
            chapters={chapters}
            role={role}
            onSuccess={() => this.setState({ isEditing: false })}
          />
        }
        {
          !isEditing &&
          <div style={{ fontSize: '150%', fontWeight: '600' }}>
            {announcement.title}
          </div>
        }
        {
          (!isEditing && !!announcement.image) &&
          <div style={{ padding: '1em 0' }}>
            <img
              alt="announcement"
              src={announcement.image}
              style={{ width: '100%', borderRadius: '3px' }}
              onDragStart={event => event.preventDefault()}
            />
          </div>
        }
        {
          !isEditing &&
          <div
            style={{
              color: 'rgba(0, 0, 0, 0.75)',
              padding: '3px 0',
            }}
          >
            <Linkify properties={{ target: '_blank' }}>
              {announcement.body}
            </Linkify>
          </div>
        }
        {
          canModify &&
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: '0.5em',
              fontSize: '75%',
              opacity: '0.5',
              userSelect: 'none',
            }}
          >
            <i
              className="material-icons"
              style={{
                paddingRight: '0.5em',
                fontSize: '125%',
                opacity: '0.75',
              }}
            >
              remove_red_eye
            </i>
            {
              role === 'master' &&
              <span>
                {announcement.chapterUuid ? 'Only ' : 'All '}
                {announcement.audience}
                {' from '}
                {
                  announcement.chapterUuid ?
                  `the ${chapterList[announcement.chapterUuid]} chapter` :
                  'every chapter'
                }
              </span>
            }
            {
              role === 'chapter' &&
              <span>
                All {announcement.audience} in this chapter
              </span>
            }
          </div>
        }
      </div>
    );
  }
}

AnnouncementsListItem.propTypes = {
  announcement: PropTypes.shape({}).isRequired,
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  role: PropTypes.string,
  onDelete: PropTypes.func,
};

AnnouncementsListItem.defaultProps = {
  chapters: [],
  role: '',
  onDelete: () => {},
};
