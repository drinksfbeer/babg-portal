import React from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { Field } from 'redux-form';

import { CreditCardField } from '../../../../common/form/inputs';
import { creditCard } from '../../../../common/form/validations';
// import AdminFormHeaderItem from '../../../forms/header/adminFormHeaderItem';
import FormContainer from '../../../../common/form/formContainer';

const CardsForm = ({
  member: {
    _id: memberId,
  },
}) => (
  <FormContainer
    form="cards"
    record={{
      card: {
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
        cardZip: '',
      },
    }}
    submit={(results, actions, notifications) => { // eslint-disable-line
      const { card } = results;
      actions.asyncAction('addCard', {
        memberId,
        card,
      }, null, (err) => {
        if (err) {
          notifications.error('Error Occurred Adding Card');
        } else {
          notifications.success('Successfully Added Card');
          // actions.history.push('/settings/billing');
          actions.clearForm();
        }
      });
    }}
    // renderProps={() => (
    //   <div className="grid-container fluid">
    //     <div className="grid-x grid-margin-x grid-margin-y grid-padding-y align-center">
    //       <div
    //         className="cell large-12 medium-12 small-12"
    //         style={{
    //           marginTop: '0',
    //           marginBottom: '0',
    //           paddingTop: '0',
    //           paddingBottom: '0',
    //         }}
    //       >
    //         <Link to="/settings/billing">
    //           <span style={{ fontSize: '200%', marginRight: '5px' }}>
    //             &#8249;
    //           </span>
    //           <em>Back to Billing</em>
    //         </Link>
    //       </div>
    //       <AdminFormHeaderItem title="New Card" />
    //       <Field
    //         name="card"
    //         component={CreditCardField}
    //         validate={[creditCard]}
    //         containerClass="cell large-12"
    //       />
    //       <div className="cell">
    //         <button type="submit" className="button">
    //           Submit
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // )}
    renderProps={() => (
      <div className="grid-x grid-padidng-x">
        <Field
          name="card"
          component={CreditCardField}
          validate={[creditCard]}
          containerClass="cell large-10 medium-10 small-11"
        />
        <div className="cell large-2 medium-2 small-1">
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </div>
    )}
  />
);

CardsForm.propTypes = {
  member: PropTypes.shape({}).isRequired,
};

export default CardsForm;
