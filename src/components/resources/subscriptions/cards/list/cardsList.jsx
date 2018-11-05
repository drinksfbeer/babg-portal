import React from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import classNames from 'classnames';
import swal from 'sweetalert';
import AdminFormHeaderItem from '../../../forms/header/adminFormHeaderItem';
import CardsForm from '../form/cardsForm';

const setPrimaryCard = async ({
  asyncAction,
  notifications,
  memberId,
  cardId,
  brand,
  lastFour,
}) => {
  const confirmation = await swal({
    title: 'Make this your primary card?',
    text: `Your ${brand} ending in ${lastFour} will be charged on your subscription's ` +
      'next billing cycle.',
    buttons: ['Cancel', 'Yes, set as primary!'],
  });
  if (confirmation) {
    asyncAction('setPrimaryCard', {
      memberId,
      cardId,
    }, null, (err) => {
      if (err) {
        swal({
          title: 'An error occurred while setting your primary card.',
          text: JSON.stringify(err),
        });
      } else {
        notifications.success('Successfully updated primary card.');
        // swal({
        //   title: `Successfully set your ${brand} ending in ${lastFour} as your primary!`,
        // });
      }
    });
  }
};

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
  member,
  member: {
    _id: memberId,
    stripeCards: cards,
    stripeDefaultSource,
  },
  asyncAction,
  success,
  error,
  isEmbedded,
}) => (
  <div className={isEmbedded ? null : 'grid-container'}>
    <div className="grid-x grid-padding-x grid-padding-y">
      {
        !isEmbedded &&
        <AdminFormHeaderItem
          title="Saved Cards"
          containerStyle={{ marginBottom: '0' }}
          materialIcon="credit_card"
        />
      }
      <div className={isEmbedded ? 'cell large-12' : 'cell large-4 medium-5 small-12'}>
        <CardsForm member={member} />
      </div>
      {
        !isEmbedded &&
        <div className="cell large-12 medium-12">
          <em>
            <strong>Note:</strong> Click on a card to switch it to your primary payment
            method. On your subscription&#39;s next billing cycle, this card will be charged.
          </em>
        </div>
      }
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
            primary: card.cardId === stripeDefaultSource,
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
              memberId,
              cardId: card.cardId,
              brand: card.brand,
              lastFour: card.lastFour,
            })}
          >
            &times;
          </div>
          <div
            className="large-12 nickname"
            style={{ cursor: 'pointer' }}
            onClick={() => setPrimaryCard({
              asyncAction,
              notifications: {
                success,
                error,
              },
              memberId,
              cardId: card.cardId,
              brand: card.brand,
              lastFour: card.lastFour,
            })}
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
);

CardsList.propTypes = {
  member: PropTypes.shape({}),
  asyncAction: PropTypes.func,
  success: PropTypes.func,
  error: PropTypes.func,
  isEmbedded: PropTypes.bool,
};

CardsList.defaultProps = {
  member: {
    stripeCards: [],
    stripeDefaultSource: '',
  },
  asyncAction: () => {},
  success: () => {},
  error: () => {},
  isEmbedded: false,
};

export default CardsList;
