import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { FieldArray, Field } from 'redux-form';
import PropTypes from 'prop-types';

import FormContainer from '../../../common/form/formContainer';
import FormBuilderForm from './formBuilderForm';
import FormBuilderPreview from './formBuilderPreview';
import { TextField, SelectField } from '../../../common/form/inputs';
import NavLinkGroup from '../../../common/navLinkGroup/navLinkGroup';

const determinRootUrl = (form, chapter) => {
  if (form) {
    return `/form/${form.uuid}/edit`;
  } else if (chapter) {
    return `/chapters/${chapter.slug}/guild/forms/new`;
  }
  return '/guild/forms/new';
};

class FormsForm extends React.Component {
  submit = (results, actions, notifications) => {
    const { form } = this.props;
    if (form) {
      actions.crudAction({
        type: 'put',
        resource: 'forms',
      }, {
        _id: form._id,
        changes: results,
      }, (err, modifiedForm) => {
        if (!err && modifiedForm) {
          notifications.success('Successfully edited form.');
        } else {
          notifications.error('Error Occurred editing Form');
        }
      });
    } else {
      actions.crudAction({
        type: 'post',
        resource: 'forms',
      }, {
        pkg: results,
      }, (err, newForm) => {
        if (!err && newForm) {
          actions.history.replace(`/form/${newForm.uuid}`);
        } else {
          notifications.error('Error Occurred Creating Form');
        }
      });
    }
  }
  render() {
    const { form, chapter } = this.props;
    const rootUrl = determinRootUrl(form, chapter);

    return ([
      <NavLinkGroup
        key="nav-link"
        links={[{
          to: `${rootUrl}/form-builder`,
          icon: 'info',
          title: 'Form Builder',
        }, {
          to: `${rootUrl}/preview`,
          icon: 'remove_red_eye',
          title: 'Preview',
        }]}
      />,
      <Route
        key="redirect-route"
        path={rootUrl}
        exact
        render={() => (
          <Redirect to={`${rootUrl}/form-builder`} />
        )}
      />,
      <FormContainer
        record={form}
        key="form-form"
        submit={this.submit}
        renderProps={values => ([
          <Route
            key="create/edit-route"
            exact
            path={`${rootUrl}/form-builder`}
            render={() => ([
              <div
                key="general-info"
                className="grid-x grid-padding-x grid-padding-y"
              >
                <Field
                  name="name"
                  component={TextField}
                  placeholder="ex: Member Application"
                  label="Form Name"
                  containerClass="cell large-7 medium-7"
                />
                <Field
                  name="visibility"
                  component={SelectField}
                  label="Form Visibility"
                  placeholder="choose visibility"
                  options={[{
                    value: 'public',
                    title: 'Public',
                  }, {
                    value: 'members',
                    title: 'Members Only',
                  }]}
                  containerClass="cell large-5 medium-5"
                />
              </div>,
              <FieldArray
                key="form"
                name="sections"
                component={FormBuilderForm}
                values={values}
              />,
              <button
                key="submit-button"
                className="button"
              >
                Submit
              </button>,
            ])}
          />,
          <Route
            key="preview-route"
            path={`${rootUrl}/preview`}
            exact
            render={() => (
              <FormBuilderPreview
                values={values}
              />
            )}
          />,
        ])}
      />,
    ]);
  }
}

FormsForm.propTypes = {
  form: PropTypes.shape({}),
  chapter: PropTypes.shape({}),
};

FormsForm.defaultProps = {
  form: undefined,
  chapter: undefined,
};

export default FormsForm;
