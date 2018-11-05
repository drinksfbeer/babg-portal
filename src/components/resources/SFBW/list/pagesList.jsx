import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Actions from '../../../../redux/actions/';
import Loading from '../../../common/loading/loading';

class SFBWPagesList extends React.Component {
  componentDidMount() {
    const {
      loading,
      crudAction,
    } = this.props;

    if (!loading) { // will fetch every time this component mounts
      crudAction({ resource: 'SFBWpages' });
    }
  }

  render() {
    const {
      loading,
      SFBWpages,
      crudAction,
    } = this.props;

    if (loading) return <Loading />;

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
          <div className="cell large-2 medium-2">Sub Page of:</div>
          <div className="cell large-1 medium-1">Visible</div>
        </div>
        {SFBWpages.map(page => (
          <div
            key={page._id}
            style={{
              opacity: page.hidden ? '0.4' : '1',
            }}
            className=" grid-x grid-padding-x grid-padding-y app-item"
          >
            <Link
              className="cell auto"
              to={`/sfbw/page/${page._id}`}
            >
              <strong>{page.name}</strong>
            </Link>
            <div className="cell auto">{page.slug}</div>
            <div className="cell large-2 medium-2">{page.isASubPage ? `${page.mainPageSlug}` : 'N/A'}</div>
            <div className="cell large-1 medium-1">
              <i
                className="material-icons"
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => crudAction({
                  resource: 'SFBWpages',
                  type: 'put',
                }, {
                  _id: page._id,
                  changes: {
                    hidden: !page.hidden,
                  },
                })}
              >
                {page.hidden ? 'visibility_off' : 'visibility'}
              </i>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

SFBWPagesList.propTypes = {
  SFBWpages: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
  loading: PropTypes.bool,
  crudAction: PropTypes.func.isRequired,
};

SFBWPagesList.defaultProps = {
  SFBWpages: [],
  loading: false,
};

export default connect(
  // null,
  state => ({
    SFBWpages: state.SFBWpages.list._list,
    loading: state.pages.list.loading,
  }),
  dispatch => ({
    crudAction: bindActionCreators(Actions.crudAction, dispatch),
  }),
  null,
  { pure: false },
)(SFBWPagesList);
