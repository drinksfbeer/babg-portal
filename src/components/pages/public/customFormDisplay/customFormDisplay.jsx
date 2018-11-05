import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Route } from 'react-router-dom';

import { fetchPromise } from '../../../../helpers/fetchApi';
import Loading from '../../../common/loading/loading';
import FormContainer from '../../../common/form/formContainer';
import formBuilderFields from '../../../resources/forms/form/formBuilderFields';
import { required } from '../../../common/form/validations/index';

class CustomFormDisplay extends React.Component {
  state = {
    form: null,
    loading: false,
  }
  componentDidMount() {
    this.fetchForms();
  }
  fetchForms = () => {
    const {
      match: {
        params: {
          id,
        },
      },
    } = this.props;
    this.setState({ loading: true }); // eslint-disable-line
    fetchPromise({
      url: `/api/v1/forms/${id}`,
    }).then((form) => {
      this.setState({ form, loading: false });
    });
  }
  render() {
    const { form, loading } = this.state;
    const {
      match: {
        params: {
          id,
        },
      },
    } = this.props;
    return [
      <Route
        key="success-message"
        exact
        path="/forms/:id/success"
        render={() => (
          <div
            className="text-center"
            style={{ marginTop: '100px' }}
          >
            <h4>You have successfully submitted this form. Thank you for your submission!</h4>
          </div>
        )}
      />,
      <Route
        key="form"
        exact
        path="/forms/:id"
        render={() => (
          <div className="grid-container">
            <div className="grid-x grid-padding-x grid-padding-y grid-margin-x grid-margin-y">
              <div className="cell">
                {loading &&
                  <Loading />
                }
                {form &&
                  <h2>
                    {form.name}
                  </h2>
                }
              </div>
              {!form &&
                <div className="cell text-center">
                  <h4>This form could not be found or is not available anymore.</h4>
                </div>
              }
              <div className="cell">
                <FormContainer
                  submit={(results, actions, notifs) => {
                    fetchPromise({
                      url: '/api/v1/submissions',
                      method: 'POST',
                      body: {
                        pkg: {
                          formUuid: id,
                          results,
                        },
                      },
                    }).then((savedForm) => {
                      if (savedForm && savedForm.uuid) {
                        notifs.success('Successfully Submitted Form');
                        actions.history.push(`/forms/${savedForm.uuid}/success`);
                      } else {
                        notifs.error('Oops! An error occurred submitting this form');
                      }
                      // this.setState({ form: savedForm });
                    }).catch((error) => {
                      console.warn(error); // eslint-disable-line
                      notifs.error('Oops! An error occurred submitting this form');
                    });
                  }}
                  renderProps={() => (
                    <div>
                      {form && form.sections.map((section) => {
                        const foundField = formBuilderFields
                          .find(field => field.name === section.fieldType);
                        if (!foundField && section.fieldType !== 'Section Header') return null;
                        const FieldComponent = foundField && foundField.component;
                        const isSectionHeader = section.fieldType === 'Section Header';

                        return (
                          <div
                            key={section._id}
                          >
                            {isSectionHeader ? (
                              <div
                                className={`${isSectionHeader ? 'section-item' : ''}`}
                              >
                                {section.question}
                              </div>
                            ) : (
                              <Field
                                name={section.question}
                                component={FieldComponent}
                                label={section.question}
                                validate={section.required && [required]}
                                options={(section.options || '')
                                  .split(',')
                                  .map(option => ({
                                    value: option,
                                    title: option,
                                  }))
                                }
                              />
                            )}
                          </div>
                        );
                      })}
                      {form && <button className="button"> Submit</button>}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        )}
      />,
    ];
  }
}

CustomFormDisplay.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CustomFormDisplay;
