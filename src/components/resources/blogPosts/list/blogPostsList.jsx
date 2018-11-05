import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Actions from '../../../../redux/actions/';
import Loading from '../../../common/loading/loading';

class BlogPostsList extends React.Component {
  componentDidMount() {
    const {
      chapterUuid,
      loading,
      crudAction,
    } = this.props;

    if (!loading) { // will fetch every time this component mounts
      const query = `chapterUuid=${chapterUuid}`;
      crudAction({ resource: 'blogPosts', query });
    }
  }

  render() {
    const {
      loading,
      blogPosts,
      crudAction,
    } = this.props;

    if (loading) return <Loading />;

    const editableBlogPosts = blogPosts.filter(blogPost => !blogPost.hasOwnProperty('special')); // eslint-disable-line

    return (
      <div className="sectionPadding">
        <div
          className="grid-x grid-padding-x grid-padding-y app-item"
          style={{
            backgroundColor: '#333',
            color: 'white',
            fontWeight: '900',
          }}
        >
          <div className="cell auto">Name</div>
          <div className="cell auto">Slug</div>
          <div className="cell large-2 medium-2">Header Visible</div>
          <div className="cell large-1 medium-1">Visible</div>
        </div>
        {editableBlogPosts.map(blogPost => (
          <div
            key={blogPost._id}
            style={{
              opacity: blogPost.hidden ? '0.4' : '1',
            }}
            className=" grid-x grid-padding-x grid-padding-y app-item"
          >
            <Link
              className="cell auto"
              to={`/blogPost/${blogPost._id}`}
            >
              <strong>{blogPost.name}</strong>
            </Link>
            <div className="cell auto">{blogPost.slug}</div>
            <div className="cell large-2 medium-2">{blogPost.activeOnHeader ? 'Y' : 'N'}</div>
            <div className="cell large-1 medium-1">
              <i
                className="material-icons"
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => crudAction({
                  resource: 'blogPosts',
                  type: 'put',
                }, {
                  _id: blogPost._id,
                  changes: {
                    hidden: !blogPost.hidden,
                  },
                })}
              >
                {blogPost.hidden ? 'visibility_off' : 'visibility'}
              </i>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

BlogPostsList.propTypes = {
  chapterUuid: PropTypes.string.isRequired,
  blogPosts: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
  loading: PropTypes.bool,
  crudAction: PropTypes.func.isRequired,
};

BlogPostsList.defaultProps = {
  blogPosts: [],
  loading: false,
};

export default connect(
  // null,
  state => ({
    blogPosts: state.blogPosts.list._list,
    loading: state.blogPosts.list.loading,
  }),
  dispatch => ({
    crudAction: bindActionCreators(Actions.crudAction, dispatch),
  }),
  null,
  { pure: false },
)(BlogPostsList);
