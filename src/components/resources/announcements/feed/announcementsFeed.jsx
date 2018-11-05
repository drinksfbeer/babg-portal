import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import Actions from '../../../../redux/actions';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';
import AnnouncementsForm from '../form/announcementsForm';
import AnnouncementsList from '../list/announcementsList';
import Loading from '../../../common/loading/loading';

class AnnouncementsFeed extends React.Component {
  componentDidMount() {
    const {
      // announcements,
      loading,
      role,
      chapter,
      crudAction,
    } = this.props;

    if (!loading) { // currently having it fetch every time this component mounts
      let query = null; // master admins (load all announcements)
      switch (role) {
        case 'chapter': { // chapter admins
          // query = {$or: [{chapterUuid: chapter.uuid}, {chapterUuid: ''}]}
          query = `$or[0][chapterUuid]=${chapter.uuid}&$or[1][chapterUuid]=`;
          break;
        }

        case 'member': { // chapter members
          // query = {$or: [{chapterUuid: chapter.uuid}, {chapterUuid: ''}], audience: 'members'}
          query = `$or[0][chapterUuid]=${chapter.uuid}&$or[1][chapterUuid]=&audience=members`;
          break;
        }

        case 'enthusiast': { // chapter enthusiasts
          // query = {$or: [{chapterUuid: chapter.uuid}, {chapterUuid: ''}],
          // audience: 'enthusiasts'}
          query = `$or[0][chapterUuid]=${chapter.uuid}&$or[1][chapterUuid]=&audience=enthusiasts`;
          break;
        }

        default: break; // hope you're happy eslint
      }

      crudAction({ resource: 'announcements', query });
    }
  }

  render() {
    const {
      announcements,
      loading,
      chapters,
      chapter,
      role,
      crudAction,
    } = this.props;
    const isAdmin = (role === 'master') || (role === 'chapter');

    if (loading) return <Loading />;

    return (
      <section className="announcement-feed">
        {
          isAdmin &&
          <AdminFormHeaderItem
            containerStyle={{ marginBottom: '1em' }}
            title="Create a New Announcement"
            materialIcon="announcement"
          />
        }
        {
          isAdmin &&
          <AnnouncementsForm
            form="announcements"
            role={role}
            chapters={chapters}
            chapter={chapter}
          />
        }
        <AdminFormHeaderItem
          containerStyle={{
            marginTop: isAdmin ? '3em' : '0',
            marginBottom: '1em',
          }}
          title="Past Announcements"
          materialIcon="announcement"
        />
        <AnnouncementsList
          announcements={announcements}
          chapters={chapters}
          role={role}
          onDelete={(_id, callback) => crudAction({
            type: 'delete',
            resource: 'announcements',
          }, {
            _id,
          }, callback)}
        />
      </section>
    );
  }
}

AnnouncementsFeed.propTypes = {
  announcements: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  chapter: PropTypes.shape({}),
  crudAction: PropTypes.func.isRequired,
  role: PropTypes.string,
};

AnnouncementsFeed.defaultProps = {
  announcements: [],
  loading: false,
  chapters: [],
  chapter: {},
  role: '',
};

export default connect(
  state => ({
    announcements: state.announcements.list._list,
    loading: state.announcements.list.loading,
    chapters: state.chapters.list._list,
  }),
  dispatch => ({
    crudAction: bindActionCreators(Actions.crudAction, dispatch),
  }),
  null,
  {
    pure: false,
  },
)(AnnouncementsFeed);
