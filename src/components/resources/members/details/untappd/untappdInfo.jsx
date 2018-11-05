import React from 'react';
import PropTypes from 'prop-types';

const untappdClientId = '7F402B33AA5F7485AE47B57E9A4D2286377FDA19';
const untappdClientSecret = '8771E163F4B187F21417B6F6E30A5C5FB66EA080';

class UntappdInfo extends React.Component {
  state = {
    beers: [],
    error: '',
  }

  componentDidMount() {
    this.fetchBreweryInfo();
  }

  fetchBreweryInfo() {
    const { untappdId } = this.props.member;
    const changeDetailsState = this.props;

    if (!untappdId) {
      changeDetailsState({ searchActive: true });
    } else {
      fetch(`https://api.untappd.com/v4/brewery/info/${untappdId}?client_id=${untappdClientId}&client_secret=${untappdClientSecret}`)
        .then((response) => {
          if (response.ok) {
            response
              .json()
              .then((data) => {
                try {
                  const beers = data.response.brewery.beer_list.items.map(item => ({
                    name: item.beer.beer_name,
                    image: item.beer.beer_label,
                    style: item.beer.beer_style,
                  }));
                  this.setState({ beers });
                } catch (error) {
                  this.setState({ error: 'Error parsing untappd info' });
                }
              });
          } else {
            this.setState({ error: 'Bad response from untappd' });
          }
        }).catch(() => {
          this.setState({ error: 'Error occured fetching information' });
        });
    }
  }

  render() {
    const { beers, error } = this.state;
    const { isAdmin, onReset } = this.props;

    return (
      <div
        className="grid-x grid-padding-x"
        style={{ fontSize: '80%' }}
      >
        <div className="cell">
          <div
            className="grid-x margin-x grid-margin-y"
            style={{ marginTop: '15px', marginBottom: '15px' }}
          >
            <div
              className="cell"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: 'solid rgba(0,0,0,0.2) 1px',
                marginBottom: '10px',
              }}
            >
              <h4>Beers</h4>
              {isAdmin &&
                <span
                  style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.7)' }}
                  onClick={onReset}
                >
                  reset untappd
                </span>
              }
            </div>
          </div>
        </div>
        {error &&
          <div style={{ color: 'red', fontSize: '75%' }}>
            {error}
          </div>
        }
        {beers.map(beer => (
          <div
            key={beer.name}
            className="cell large-6 medium-6 small-6 app-item"
            style={{
              paddingTop: '3px',
              paddingBottom: '3px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              alt="beerlogo"
              src={beer.image}
              width="25px"
              style={{ borderRadius: '100%', marginRight: '8px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span><b>{beer.name}</b></span>
              <span>{beer.style}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

UntappdInfo.propTypes = {
  member: PropTypes.shape({
    untappdId: PropTypes.string.isRequired,
  }).isRequired,
  isAdmin: PropTypes.bool,
  onReset: PropTypes.func.isRequired,

};

UntappdInfo.defaultProps = {
  isAdmin: false,
};
export default UntappdInfo;
