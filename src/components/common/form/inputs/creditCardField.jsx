import React from 'react';
import PropTypes from 'prop-types';
import CreditCardInput from 'react-credit-card-input';

const CreditCardField = ({
  containerClass,
  containerStyle,
  label,
  labelClass,
  labelStyle,
  input,
  inputContainerClass,
  inputContainerStyle,
}) => (
  <div className={containerClass} style={containerStyle}>
    {
      label &&
      <label className={labelClass} style={labelStyle}>
        {label}
      </label>
    }
    <CreditCardInput
      containerClassName={inputContainerClass}
      containerStyle={{
        position: 'relative',
        ...inputContainerStyle,
      }}
      cardImageStyle={{
        height: '1.5em',
        marginRight: '6px',
        marginBottom: '5px',
      }}
      fieldStyle={{
        height: '44px',
        backgroundColor: 'transparent',
      }}
      inputStyle={{
        fontSize: '1rem',
        border: '1px solid #C8CCD3',
      }}
      invalidStyle={{ border: 'none' }}
      dangerTextStyle={{
        position: 'absolute',
        top: '-29px',
        right: '7px',
        margin: '0',
        color: 'red',
        fontSize: '0.875rem',
        fontWeight: '500',
        letterSpacing: '0.1em',
      }}
      cardNumberInputProps={{
        value: input.value.cardNumber,
        onChange: event => input.onChange({
          ...input.value,
          cardNumber: event.target.value,
        }),
        placeholder: 'card number',
      }}
      cardExpiryInputProps={{
        value: input.value.cardExpiry,
        onChange: event => input.onChange({
          ...input.value,
          cardExpiry: event.target.value,
        }),
        placeholder: 'mm/yy',
      }}
      cardCVCInputProps={{
        value: input.value.cardCVC,
        onChange: event => input.onChange({
          ...input.value,
          cardCVC: event.target.value,
        }),
        placeholder: 'cvc',
      }}
      cardZipInputProps={{
        value: input.value.cardZip,
        onChange: event => input.onChange({
          ...input.value,
          cardZip: event.target.value,
        }),
        style: {
          width: '63px',
          fontSize: '1rem',
          border: '1px solid #C8CCD3',
        },
        placeholder: 'zip',
      }}
      customTextLabels={{
        invalidCardNumber: '',
        expiryError: {
          invalidExpiryDate: '',
          monthOutOfRange: '',
          yearOutOfRange: '',
          dateOutOfRange: '',
        },
        invalidCvc: '',
        invalidZipCode: '',
      }}
      enableZipInput
    />
  </div>
);

CreditCardField.propTypes = {
  containerClass: PropTypes.string,
  containerStyle: PropTypes.shape({}),
  label: PropTypes.string,
  labelClass: PropTypes.string,
  labelStyle: PropTypes.shape({}),
  input: PropTypes.shape({
    value: PropTypes.shape({
      cardNumber: PropTypes.string, // looks like: '4242 4242 4242 4242' (incl. spaces)
      cardExpiry: PropTypes.string, // looks like: '04 / 20' (incl. spaces & slash)
      cardCVC: PropTypes.string, // looks like: '420'
      cardZip: PropTypes.string, // looks like: '92102'
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  inputContainerClass: PropTypes.string,
  inputContainerStyle: PropTypes.shape({}),
};

CreditCardField.defaultProps = {
  containerClass: '',
  containerStyle: {},
  label: '',
  labelClass: '',
  labelStyle: {},
  inputContainerClass: '',
  inputContainerStyle: {},
};

export default CreditCardField;
