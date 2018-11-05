import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import notifications from 'react-notification-system-redux';
import swal from 'sweetalert';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import AdminFormHeaderItem from '../../../resources/forms/header/adminFormHeaderItem';
// import CardsForm from './form/cardsForm';
import actions from '../../../../redux/actions/index';

const deleteCard = async ({
  asyncAction,
  notifications,
  memberId,
  cardId,
  brand,
  lastFour,
}) => {
  const confirmation = await swal({
    title: 'Really delete this card?',
    text: `Your ${brand} ending in ${lastFour} will be deleted and an another card ` +
      'will be selected as your primary.',
    buttons: ['Cancel', 'Yes, delete it!'],
    dangerMode: true,
  });
  if (confirmation) {
    asyncAction('deleteCard', {
      memberId,
      cardId,
      isAgent: true,
    }, null, (err) => {
      if (err) {
        swal({
          title: 'An error occurred while deleting this card.',
          text: JSON.stringify(err),
        });
      } else {
        // swal({ title: 'Card deleted successfully!' });
        notifications.success('Successfully deleted card.');
      }
    });
  }
};

const CardsList = ({
  user,
  user: {
    stripeCards: cards,
  },
  asyncAction,
  success,
  error,
}) => (
  <React.Fragment>
    <SectionHeader
      title="Payment"
      icon="credit_card"
    />
    <div className="grid-container" style={{ marginTop: '2em' }}>
      <div className="grid-x grid-padding-x grid-padding-y">
        <AdminFormHeaderItem
          title="Saved Cards"
          containerStyle={{ marginBottom: '0' }}
          materialIcon="credit_card"
        />
        {/* <div className="cell large-4 medium-5 small-12">
          <CardsForm member={user} />
        </div> */}
        <div className="cell large-12 medium-12">
          <em>
            <strong>Note:</strong> Click on the 'X' to delete a card.
          </em>
        </div>
      </div>
      <div className="grid-x grid-margin-y grid-margin-x grid-padding-x grid-padding-y large-up-4">
        {cards.map(card => (
          <div
            key={card._id}
            className={classNames({
              cell: true,
              'app-item': true,
              planListItem: true,
              cardListItem: true,
            })}
          >
            <div
              style={{
                position: 'absolute',
                top: '5px',
                right: '10px',
                fontSize: '200%',
                color: 'rgba(0, 0, 0, 0.7)',
                lineHeight: '100%',
                cursor: 'pointer',
                userSelect: 'none',
                zIndex: '5',
              }}
              onClick={() => deleteCard({
                asyncAction,
                notifications: {
                  success,
                  error,
                },
                memberId: user._id,
                cardId: card.cardId,
                brand: card.brand,
                lastFour: card.lastFour,
              })}
            >
              &times;
            </div>
            <div
              className="large-12 nickname"
            >
              <span
                style={{
                  paddingRight: '0.75em',
                  fontWeight: 'normal',
                }}
              >
                {card.brand}
              </span>
              •••• {card.lastFour}
            </div>
          </div>
        ))}
      </div>
    </div>
  </React.Fragment>
);

CardsList.propTypes = {
  user: PropTypes.shape({}),
  asyncAction: PropTypes.func,
  success: PropTypes.func,
  error: PropTypes.func,
};

CardsList.defaultProps = {
  user: {
    stripeCards: [],
  },
  asyncAction: () => {},
  success: () => {},
  error: () => {},
};

export default connect(
  state => ({
    user: state.users.auth.user,
  }),
  dispatch => ({
    asyncAction: bindActionCreators(actions.asyncAction, dispatch),
    success: bindActionCreators(notifications.success, dispatch),
    error: bindActionCreators(notifications.error, dispatch),
  }),
  null,
  { pure: false },
)(CardsList);
