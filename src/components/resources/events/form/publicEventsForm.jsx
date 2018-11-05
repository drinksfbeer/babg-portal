import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import moment from 'moment';
// import { connect } from 'react-redux';

/* eslint-disable */

import {
  ToggleField,
  TextField,
  FileStackField,
  DatePickerField,
  SelectField,
  QuillField,
  CreditCardField,
} from '../../../common/form/inputs/index';
import { sfbwCategories } from '../../../../refs/refs';
import {
  requiredText,
  email,
  phoneNumber,
  creditCard,
} from '../../../common/form/validations';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';
import FormContainer from '../../../common/form/formContainer';
import FancyError from '../../../common/fancyError/fancyError';

const PublicEventsForm = ({
  event,
  user,
  loading,
  chapters,
  settings,
  status,
  isAdmin,
}) => (
  <FormContainer
    form="publicEvent"
    record={{
      ...event,
      card: {
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
        cardZip: '',
      },
    }}
    submit={(results, actions, notifications) => {
      // do some credit card sanitization
      if (results.cardId && results.cardId.indexOf('card_') > -1) {
        delete results.card;
        delete results.saveCard;
      } else {
        delete results.cardId;
      }

      // do some additional date processing for the event date
      if (results.eventType === 'unique') {
        // keep only the date info by resetting time to 00:00:00 (i.e., 12 AM)
        const baseDate = moment(results.date).startOf('day');
        results.date = baseDate.valueOf();

        // check if `startTime` and/or `endTime` is `undefined`
        // (there's a bug where if you just click on the input field for a
        // `DatePickerField`, it actually doesn't set the time until you adjust it)
        // (also, why 12 PM? because that's the default time when you first click
        // on the input field)
        const defaultTime = baseDate.add(12, 'hours').valueOf();
        if (!results.startTime) results.startTime = defaultTime;
        if (!results.endTime) results.endTime = defaultTime;

        // extract the year, month, and date from `baseDate`
        const y = baseDate.year();
        const m = baseDate.month();
        const d = baseDate.date();

        // change the year, month, and date of `startTime` and `endTime`, but keep
        // the time information intact (i.e., hour, min, sec, ms)
        // (`DatePickerField` sets the date to the current date when disabling
        // calendar selection)
        results.startTime = moment(results.startTime).year(y).month(m).date(d).valueOf();
        results.endTime = moment(results.endTime).year(y).month(m).date(d).valueOf();
      } else { // results.eventType === 'week_long'
        // keep only the date info using the method stated in `results.date` above
        results.startDate = moment(results.startDate).startOf('day').valueOf();
        results.endDate = moment(results.endDate).startOf('day').valueOf();
      }

      // also do some additional processing for the 'Meet the Brewers' category
      if (results.category === 'meet_the_brewers') {
        // we need to get the 'base date' depending on the type of event
        // (although... not sure what good it'll do for 'week_long' event types...)
        const baseDateValue = results.eventType === 'unique' ? results.date : results.startDate;
        const baseDate = moment(baseDateValue).startOf('day');

        // surprise! `brewerStart` and `brewerEnd` are also susceptible to the same
        // bug as described above (for `startTime` and `endTime` in a `unique` type event)
        const defaultTime = baseDate.add(12, 'hours').valueOf();
        if (!results.brewerStart) results.brewerStart = defaultTime;
        if (!results.brewerEnd) results.brewerEnd = defaultTime;

        // extract the year, month, and date from `baseDate`
        const y = baseDate.year();
        const m = baseDate.month();
        const d = baseDate.date();

        // essentially the same method for adjusting the date for 'unique' event types
        results.brewerStart = moment(results.brewerStart).year(y).month(m).date(d).valueOf();
        results.brewerEnd = moment(results.brewerEnd).year(y).month(m).date(d).valueOf();
      }

      // check if we're editing an existing event
      if (event._id) {
        if (isAdmin) {
          actions.asyncAction('adminUpdatePublicEvent', {
            _id: event._id,
            adminId: user._id,
            changes: results,
          }, null, (err, modifiedEvent) => {
            if (err || !modifiedEvent) {
              notifications.error('Error Occurred Updating Event');
            } else {
              notifications.success('Successfully Updated Event');
              actions.history.replace(`/sfbw/event/${modifiedEvent._id}`);
            }
          });
        } else {
          if (status !== 'unknown' && status !== 'draft') {
            actions.crudAction({
              type: 'PUT',
              resource: 'publicEvents',
            }, {
              _id: event._id,
              userId: user._id,
              changes: results,
            }, (err, modifiedEvent) => {
              if (err || !modifiedEvent) {
                notifications.error('There was an issue editing your event.');
              } else {
                notifications.success('Your event has been successfully modified!');
                actions.history.replace('/sfbw/events');
              }
            });
          } else {
            // submit the event as a draft
            actions.asyncAction('resubmitPublicEvent', {
              userId: user._id,
              eventId: event._id,
              pkg: results,
            }, null, (err, modifiedEvent) => {
              if (err || !modifiedEvent) {
                notifications.error('There was an issue submitting your event.');
              } else {
                actions.asyncAction('getPublicEventVersion', null, `userId=${user._id}`);
                notifications.success('Your event has been successfully submitted for review!');
                actions.history.replace('/sfbw/events');
              }
            });
          }
        }
        return;
      }

      // create new event
      actions.crudAction({
        type: 'POST',
        resource: 'publicEvents',
      }, {
        userId: user._id,
        pkg: results,
      }, (err, newEvent) => {
        if (err || !newEvent) {
          notifications.error('There was an issue submitting your event.');
        } else {
          notifications.success('Your event has been successfully submitted for review!');
          actions.history.replace('/sfbw/events');
        }
      });
    }}
    renderProps={(values) => {
      if (!settings.publicEventEnabled) {
        const { publicEventClosedTitle, publicEventClosedText } = settings;
        if (!publicEventClosedText) return <div />;
        return (
          <FancyError
            icon="remove_circle_outline"
            title={publicEventClosedTitle}
            error={publicEventClosedText}
            stringify={false}
            contentStyle={{ textAlign: 'center' }}
            titleStyle={{ justifyContent: 'center' }}
          />
        );
      }

      const dateOnly = !isAdmin && status === 'pending';
      const feeWaived = Array.isArray(user.permissions) && user.permissions.includes('events_free');
      const submissionFeeAmount = values.eventType === 'week_long' ?
        settings.publicEventWeekLongFee : settings.publicEventUniqueFee;
      const submissionFee = `$${(submissionFeeAmount / 100).toFixed(2)}`;

      const showMoreInfo = () => {
      };

      // the "meet the brewers" category should only be available if the type is set to "unique"
      if (values.eventType !== 'unique' && values.category === 'meet_the_brewers') {
        delete values.category;
      }

      return (
        <div className="grid-x grid-margin-x">
          <div className="cell">
            <AdminFormHeaderItem
              title="Event Info"
              materialIcon="event_note"
            />
          </div>
          <Field
            name="title"
            label="Event Name *"
            containerClass="cell"
            component={TextField}
            type="text"
            placeholder="enter event name"
            validate={[requiredText]}
            disabled={dateOnly}
          />
          <div className="cell">
            <AdminFormHeaderItem
              title="Where is the event?"
              fontAwesomeIcon="map-marker-alt"
            />
          </div>
          <div className="cell">
            <div className="grid-x grid-margin-x">
              <Field
                name="location.name"
                label="Venue Name *"
                placeholder="enter venue name"
                containerClass="cell large-8"
                component={TextField}
                type="text"
                validate={[requiredText]}
                disabled={dateOnly}
              />
              <Field
                name="chapterUuid"
                label="Venue Region *"
                placeholder="select your venue's region"
                containerClass="cell large-4"
                component={SelectField}
                options={chapters.map(chapter => ({
                  title: chapter.name,
                  value: chapter.uuid,
                }))}
                validate={[requiredText]}
                disabled={dateOnly}
              />
              <Field
                name="location.street"
                label="Address Line 1 *"
                placeholder="Ex. 1234 India St"
                containerClass="large-7 medium-7 cell"
                component={TextField}
                type="text"
                validate={[requiredText]}
                disabled={dateOnly}
              />
              <Field
                name="location.street2"
                label="Address Line 2"
                placeholder="Ex. Unit 2"
                containerClass="large-5 medium-5 cell"
                component={TextField}
                type="text"
                disabled={dateOnly}
              />
              <Field
                name="location.city"
                label="City *"
                placeholder="Ex. San Diego"
                containerClass="large-5 medium-6 cell"
                component={TextField}
                type="text"
                validate={[requiredText]}
                disabled={dateOnly}
              />
              <Field
                name="location.state"
                label="State *"
                placeholder="Ex. CA"
                containerClass="large-2 medium-2 cell"
                component={TextField}
                type="text"
                validate={[requiredText]}
                disabled={dateOnly}
              />
              <Field
                name="location.zip"
                label="ZIP Code *"
                placeholder="Ex. 92101"
                containerClass="large-2 medium-2 cell"
                component={TextField}
                type="text"
                validate={[requiredText]}
                disabled={dateOnly}
              />
            </div>
          </div>
          <div className="cell">
            <AdminFormHeaderItem
              title="What kind of event?"
              fontAwesomeIcon="star"
              description={`Event Format: In an effort to make our schedule more concise, and in compliance with CA ABC regulations, events will be sorted into two different categories, "unique" or "week-long special." Each event type will be displayed in a different manner and are subject to different listing fees. Week-long Special: If your event features a special beer list or food and beer pairing, that’s available during an extended portion or duration of SF Beer Week (3 days or more), it will be classified as a "week-long special." This event type will not appear on the daily list of events. Instead, a week-long special will be featured in it’s own selectable category on the schedule. The fee to submit a week-long special event is $${(settings.publicEventWeekLongFee / 100).toFixed(2)}. Unique Event: Events that feature a limited selection of beer or food, special guests, and one-time activities or experiences, will be classified as "unique" events. These events will be featured on the daily list of events. The fee to submit a unique event is $${(settings.publicEventUniqueFee / 100).toFixed(2)}.`}
              onClick={showMoreInfo}
            />
          </div>
          <Field
            name="eventType"
            label="Event Format *"
            placeholder="choose event format"
            component={SelectField}
            containerClass="cell"
            options={[
              { value: 'unique', title: 'Unique Event' },
              { value: 'week_long', title: 'Week-Long Event' },
            ]}
            validate={[requiredText]}
            disabled={dateOnly}
          />
          <div className="cell" style={{ marginBottom: '1em' }}>
            <span className="description">
              <em>
                <strong>Note:</strong> The event format cannot be edited once your event has been
                submitted. Please confirm your format before proceeding.
              </em>
            </span>
          </div>
          {
            values.eventType === 'unique' &&
            <React.Fragment>
              <div className="cell">
                <AdminFormHeaderItem
                  title="When is this event?"
                  fontAwesomeIcon="clock"
                  description={`Note: The event date and time can be edited after the event has been submitted, but cannot be edited once your event has been approved. The maximum allowed length of time is ${settings.publicEventUniqueMaxTime} hour${settings.publicEventUniqueMaxTime === 1 ? '' : 's'}.`}
                />
              </div>
              <Field
                name="date"
                label="Event Date *"
                placeholder="choose event date"
                component={DatePickerField}
                containerClass="cell large-4 medium-4"
                options={{
                  enableTime: false,
                  altFormat: 'F j, Y',
                  dateFormat: 'F j, Y',
                  enable: [
                    // if the event was already submitted before and has a date that already
                    // passed, enable it so it shows up in the input field of the `flatpickr`
                    event && event.date ? moment(event.date).toDate() : undefined,
                    {
                      from: moment(settings.festivalStartDate).toDate(),
                      to: moment(settings.festivalEndDate).toDate(),
                    },
                  ],
                }}
                validate={[requiredText]}
              />
              <Field
                name="startTime"
                label="Start Time *"
                placeholder="choose start time"
                component={DatePickerField}
                containerClass="cell large-4 medium-4"
                options={{
                  enableTime: true,
                  noCalendar: true,
                }}
              />
              <Field
                name="endTime"
                label="End Time *"
                placeholder="choose end time"
                component={DatePickerField}
                containerClass="cell large-4 medium-4"
                options={{
                  enableTime: true,
                  noCalendar: true,
                  minTime: values.startTime ? moment(values.startTime)
                    .format('HH:mm') : '12:00',
                  maxTime: (() => {
                    const { publicEventUniqueMaxTime: maxTimeSpan } = settings;
                    if (values.startTime) {
                      // check if hours overflowed past 12 AM the next day
                      const startTime = moment(values.startTime);
                      const currentHour = startTime.hours();
                      if (currentHour + maxTimeSpan > 23) return '23:59';
                      return startTime.add(maxTimeSpan, 'hours').format('HH:mm');
                    }
                    return moment()
                      .startOf('day')
                      .add(12, 'hours')
                      .add(maxTimeSpan, 'hours')
                      .format('HH:mm');
                  })(),
                }}
              />
            </React.Fragment>
          }
          {
            values.eventType === 'week_long' &&
            <React.Fragment>
              <div className="cell">
                <AdminFormHeaderItem
                  title="When is this event?"
                  fontAwesomeIcon="clock"
                  description="Note: The event date and time can be edited after the event has been submitted, but cannot be edited once your event has been approved."
                />
              </div>
              <Field
                name="startDate"
                label="Event Start Date *"
                placeholder="choose start date"
                component={DatePickerField}
                containerClass="large-6 medium-6 cell"
                options={{
                  enableTime: false,
                  altFormat: 'F j, Y',
                  dateFormat: 'F j, Y',
                  enable: [
                    event && event.startDate ? moment(event.startDate).toDate() : undefined,
                    {
                      from: moment(settings.festivalStartDate).toDate(),
                      to: moment(settings.festivalEndDate).toDate(),
                    },
                  ],
                }}
                validate={[requiredText]}
              />
              <Field
                name="endDate"
                label="Event End Date *"
                placeholder="choose end date"
                component={DatePickerField}
                containerClass="large-6 medium-6 cell"
                options={{
                  enableTime: false,
                  altFormat: 'F j, Y',
                  dateFormat: 'F j, Y',
                  enable: [
                    event && event.endDate ? moment(event.endDate).toDate() : undefined,
                    {
                      from: moment(settings.festivalStartDate).toDate(),
                      to: moment(settings.festivalEndDate).toDate(),
                    },
                  ],
                }}
                validate={[requiredText]}
              />
            </React.Fragment>
          }

          <div className="cell">
            <AdminFormHeaderItem
              title="Event Details"
              materialIcon="event_note"
            />
          </div>
          <Field
            name="category"
            label="Event Type *"
            placeholder="choose event type"
            component={SelectField}
            containerClass="cell"
            options={sfbwCategories.reduce((categories, category) => {
              if (values.eventType !== 'unique' && category.value === 'meet_the_brewers') {
                return categories;
              }
              categories.push({
                value: category.value,
                title: category.label,
              });
              return categories;
            }, [])}
            validate={[requiredText]}
            disabled={dateOnly}
          />
          {
            (values.category && values.category === 'meet_the_brewers') &&
            <React.Fragment>
              <Field
                name="brewerStart"
                label="Brewer Attendance Start Time *"
                placeholder="choose start time"
                component={DatePickerField}
                containerClass="cell large-6 medium-6"
                options={{
                  enableTime: true,
                  noCalendar: true,
                  minTime: values.startTime ? moment(values.startTime)
                    .format('HH:mm') : undefined,
                  maxTime: values.endTime ? moment(values.endTime)
                    .format('HH:mm') : undefined,
                }}
              />
              <Field
                name="brewerEnd"
                label="Brewer Attendance End Time *"
                placeholder="choose end time"
                component={DatePickerField}
                containerClass="cell large-6 medium-6"
                options={{
                  enableTime: true,
                  noCalendar: true,
                  minTime: values.startTime ? moment(values.startTime)
                    .format('HH:mm') : undefined,
                  maxTime: values.endTime ? moment(values.endTime)
                    .format('HH:mm') : undefined,
                }}
              />
            </React.Fragment>
          }
          <Field
            name="admissionPrice"
            label="Admission"
            placeholder="$$"
            component={TextField}
            containerClass="cell large-4 medium-4"
            type="number"
            min={0}
            disabled={dateOnly}
          />
          <Field
            name="eventUrl"
            label="Event URL"
            placeholder="enter event url"
            component={TextField}
            containerClass="cell large-4 medium-4"
            type="text"
            disabled={dateOnly}
          />
          <Field
            name="ticketUrl"
            label="Ticket URL"
            placeholder="enter ticket url"
            component={TextField}
            containerClass="cell large-4 medium-4"
            type="text"
            disabled={dateOnly}
          />
          <Field
            name="image"
            label="Event Image"
            component={FileStackField}
            containerClass="cell"
            description="Event images should be 16 / 9 aspect ratio, and minimum 1200 x 680px recommened 1920 x 1080px. The ratio matches Facebook's event image. The images you upload should be photos — no overlaid text or graphics."
            options={{
              imageMax: [1920, 1080],
              imageMin: [1200, 680],
              transformations: {
                crop: {
                  aspectRatio: 16 / 9,
                  force: true,
                },
              },
            }}
            disabled={dateOnly}
          />
          <Field
            name="body"
            label="Event Description *"
            placeholder="enter event details here"
            component={QuillField}
            containerClass="cell"
            height="280px"
            quillStyle={{ marginBottom: '0' }}
            formats={[
              'bold',
              'italic',
              'underline',
              'strike',
              'blockquote',
              'link',
            ]}
            toolbar={{
              container: [
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                ['link'],
                ['clean'],
              ],
            }}
            validate={[requiredText]}
            disabled={dateOnly}
          />
          <div className="cell">
            <AdminFormHeaderItem
              title="Contact info"
              fontAwesomeIcon="user-circle"
            />
          </div>
          <Field
            name="contact.name"
            label="Contact Name *"
            placeholder="Ex. John Doe"
            component={TextField}
            containerClass="cell large-4 medium-4"
            type="text"
            validate={[requiredText]}
            disabled={dateOnly}
          />
          <Field
            name="contact.email"
            label="Contact Email *"
            placeholder="Ex. name@example.com"
            component={TextField}
            containerClass="cell large-4 medium-4"
            type="email"
            validate={[requiredText, email]}
            disabled={dateOnly}
          />
          <Field
            name="contact.phone"
            label="Contact Phone *"
            placeholder="Ex. 1234567890"
            component={TextField}
            containerClass="cell large-4 medium-4"
            type="tel"
            validate={[requiredText, phoneNumber]}
            disabled={dateOnly}
          />
          {
            (
              !isAdmin && !feeWaived && status === 'unknown' &&
              Array.isArray(user.stripeCards) && user.stripeCards.length > 0
            ) &&
            <React.Fragment>
              <div className="cell">
                <AdminFormHeaderItem
                  title="Payment info"
                  fontAwesomeIcon="credit-card"
                />
              </div>
              <Field
                name="cardId"
                label="Saved Credit Cards"
                placeholder="select a saved credit card"
                component={SelectField}
                containerClass="cell"
                options={[
                  ...user.stripeCards.map(card => ({
                    title: `${card.brand}　•••• ${card.lastFour}`,
                    value: card.cardId,
                  })),
                  {
                    title: 'use a new card...',
                    value: 'newCard',
                  },
                ]}
                validate={[requiredText]}
                disabled={dateOnly}
              />
            </React.Fragment>
          }
          {
            (
              !isAdmin && !feeWaived && status === 'unknown' && (
              (Array.isArray(user.stripeCards) && user.stripeCards.length < 1) ||
              (
                Array.isArray(user.stripeCards) &&
                user.stripeCards.length > 0 &&
                values.cardId === 'newCard'
              )
            )) &&
            <React.Fragment>
              <Field
                name="card"
                label="Credit Card *"
                component={CreditCardField}
                containerClass="cell large-3 medium-5"
                containerStyle={{ minWidth: '435px', marginBottom: '1em' }}
                validate={[creditCard]}
                disabled={dateOnly}
              />
              <Field
                name="saveCard"
                label="Save Card for Faster Checkouts"
                component={ToggleField}
                containerClass="cell large-4 medium-4"
                disabled={dateOnly}
              />
            </React.Fragment>
          }
          {
            status === 'approved' &&
            <div
              className="cell"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '2em',
                padding: '15px',
                color: 'white',
                backgroundColor: 'rgba(211, 47, 47, 0.75)',
                borderRadius: '3px',
              }}
            >
              <i
                className="material-icons"
                style={{
                  marginRight: '2em',
                  fontSize: '250%',
                  userSelect: 'none',
                }}
              >
                error_outline
              </i>
              <span>
                <strong>WARNING!</strong> You will be re-submitting this event, which has already
                been approved. Doing so will create a new version, which will need to be
                re-approved again. The approved version currently on the SFBW website will not
                be modified until this version becomes approved.
              </span>
            </div>
          }
          {
            settings.publicEventNotice &&
            <div
              className="cell"
              style={{ marginTop: '2em', fontSize: '90%', color: '#757575' }}
              dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                __html: settings.publicEventNotice,
              }}
            />
          }
          <div className="cell">
            <button
              type="submit"
              className="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '52px',
                marginTop: '2em',
                marginBottom: '0',
                backgroundColor: isAdmin || feeWaived || status !== 'unknown' || loading ?
                  '#333333' : '#1565C0',
              }}
              disabled={loading}
            >
              {
                !loading &&
                <React.Fragment>
                  <i className="material-icons" style={{ marginRight: '10px' }}>
                    {isAdmin || feeWaived || status !== 'unknown' ? 'save_alt' : 'shopping_cart'}
                  </i>
                  {/* eslint-disable-next-line no-nested-ternary */}
                  Submit Event {isAdmin || feeWaived || status !== 'unknown' ?
                    (isAdmin || status !== 'unknown' ? '' : 'for Free') : `for ${submissionFee}`}
                </React.Fragment>
              }
              {
                loading &&
                <React.Fragment>
                  <i className="material-icons" style={{ marginRight: '10px' }}>
                    query_builder
                  </i>
                  Please Wait!
                </React.Fragment>
              }
            </button>
          </div>
        </div>
      );
    }}
  />
);

PublicEventsForm.propTypes = {
  event: PropTypes.shape({}),
  user: PropTypes.shape({}),
  loading: PropTypes.bool,
  formState: PropTypes.shape({}),
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  settings: PropTypes.shape({
    publicEventEnabled: PropTypes.bool,
    publicEventUniqueFee: PropTypes.number,
    publicEventWeekLongFee: PropTypes.number,
    publicEventNotice: PropTypes.string,
  }),
  status: PropTypes.string,
  isAdmin: PropTypes.bool,
};

PublicEventsForm.defaultProps = {
  event: {},
  user: {},
  loading: false,
  formState: {},
  chapters: [],
  settings: {
    publicEventEnabled: false,
    publicEventUniqueFee: 3500,
    publicEventWeekLongFee: 5000,
    publicEventNotice: '',
  },
  status: 'unknown',
  isAdmin: false,
};

export default PublicEventsForm;
