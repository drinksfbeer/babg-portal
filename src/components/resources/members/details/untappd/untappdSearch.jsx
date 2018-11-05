import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../../../../common/loading/loading';

const untappdClientId = '7F402B33AA5F7485AE47B57E9A4D2286377FDA19';
const untappdClientSecret = '8771E163F4B187F21417B6F6E30A5C5FB66EA080';

class UntappdSearch extends React.Component {
  state = {
    items: [],
    error: '',
    searchActive: false,
    loading: false,
  }
  componentDidMount() {
    const { member } = this.props;
    this.fetchSearchArray(member.name);
  }

  fetchSearchArray(parameters) {
    const encodedParameters = encodeURI(parameters);
    this.setState({ loading: true });
    fetch(`https://api.untappd.com/v4/search/brewery?client_id=${untappdClientId}&client_secret=${untappdClientSecret}&q=${encodedParameters}`)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => {
              try {
                const items = data.response.brewery.items.map(item => ({
                  beerCount: item.brewery.beer_count,
                  id: item.brewery.brewery_id,
                  image: item.brewery.brewery_label,
                  name: item.brewery.brewery_name,
                }));
                this.setState({ items, loading: false });
              } catch (error) {
                this.setState({ error: 'Error Occurred Parsing Untappd Info', loading: false });
              }
            });
        } else {
          this.setState({ error: 'Error Occurred Fetching Information', loading: false });
        }
      }).catch(() => {
        this.setState({ error: 'Error Occurred Fetching Information', loading: false });
      });
  }

  render() {
    const { onSelection } = this.props;
    const {
      items,
      error,
      searchActive,
      loading,
    } = this.state;

    return (
      <div
        style={{
          fontSize: '85%',
          color: 'rgba(0,0,0,0.8)',
          paddingTop: '30px',
          marginLeft: '10px',
        }}
      >
        <div
          style={{
            marginTop: '30px',
            borderBottom: 'solid rgba(0,0,0,0.2) 1px',
            marginBottom: '10px',
          }}
          className="cell"
        >
          <h4>Beers</h4>
        </div>
        {error &&
          <div
            style={{
              color: 'red',
              fontSize: '75%',
            }}
            className="text-center"
          >
            {error}
          </div>
        }
        {(!searchActive && items.length > 0) ? (
          <div className="grid-x grid-padding-x">
            <div
              style={{ paddingBottom: '10px' }}
              className="cell small-10 medium-8 large-7"
            >
              <b>Choose a best match to include Untappd Beer List</b> or&nbsp;
              <em
                style={{
                  cursor: 'pointer',
                  color: '#07505c',
                }}
                onClick={() => this.setState({ searchActive: true })}
              >
                <b>search</b>
              </em>
            </div>
            {loading ? (
              <Loading />
            ) : (
              items.map(item => (
                <div
                  onClick={() => {
                    if (typeof onSelection === 'function') {
                      onSelection(item.id);
                    }
                  }}
                  key={item.id}
                  className="app-item cell large-7 medium-8 small-10"
                  style={{
                    cursor: 'pointer',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <img
                      alt="beerlogo"
                      src={item.image}
                      width="35px"
                    />
                    <span
                      style={{
                        paddingLeft: '5px',
                        paddingRight: '5px',
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div>
                    <span>
                      {item.beerCount} {item.beerCount === 1 ? 'Beer' : 'Beers'} Found
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid-x grid-padding-x align-center">
            <div
              className="cell large-7 medium-8 small-10"
              style={{ paddingBottom: '10px' }}
            >
              <b>Search Untappd to include Untappd Beer List</b>
            </div>
            <div className="cell large-7 medium-8 small-10">
              {loading ? (
                <Loading />
              ) : (
                <input
                  ref={(ref) => { this.searchInput = ref; }}
                  type="text"
                  placeholder="search for untappd brewery"
                  onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        this.setState({ searchActive: false });
                        this.fetchSearchArray(this.searchInput.value);
                      }
                    }}
                />
              )}
            </div>
          </div>
        )}

      </div>
    );
  }
}

UntappdSearch.propTypes = {
  onSelection: PropTypes.func.isRequired,
  member: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

export default UntappdSearch;
