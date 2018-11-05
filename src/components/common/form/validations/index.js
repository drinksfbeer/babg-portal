import cardValidator from 'card-validator';

const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);

const minLength = min => value =>
  (value && value.length < min ? `Must be ${min} characters or more` : undefined);

export const required = value => (value ? undefined : '*');
export const requiredText = value => (value ? undefined : 'Required');

export const maxLength15 = maxLength(15);

export const minLength6 = minLength(6);

export const number = value => (value && isNaN(Number(value)) ? 'Must be a number' : undefined); // eslint-disable-line

export const email = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined);

export const alphaNumeric = value =>
  (value && /[^a-zA-Z0-9 ]/i.test(value) ? 'Only alphanumeric characters' : undefined);

export const couponCode = value =>
  (value && /^[a-zA-Z0-9_]+$/.test(value) ? undefined : 'Only one word');

export const phoneNumber = value =>
  (value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined);

export const creditCard = (value) => {
  const {
    cardNumber,
    cardExpiry,
    cardCVC,
    cardZip,
  } = value;

  const numberValidation = cardValidator.number(cardNumber);
  if (!numberValidation.isValid) return 'Card number is invalid';

  const expiryValidation = cardValidator.expirationDate(cardExpiry);
  if (!expiryValidation.isValid) return 'Expiry date is invalid';

  // what kind of cards have a 4-digit CVC? Amex!
  // (the second argument is the `maxLength` for testing CVC validity, btw)
  const cvcValidation = cardValidator.cvv(cardCVC, 4);
  // `isValid` is always false for some reason
  if (!cvcValidation.isPotentiallyValid) return 'CVC is invalid';

  const zipValidation = cardValidator.postalCode(cardZip);
  if (!zipValidation.isValid) return 'Zip code is invalid';

  return undefined;
};
