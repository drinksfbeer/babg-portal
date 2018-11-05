import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import Loading from '../../../common/loading/loading';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import DeleteConfirmation from '../../../common/prompts/confirmation';
import FormSubmissions from '../../../resources/forms/submissions/formSubmissions';
import FormsForm from '../../../resources/forms/form/formsForm';

// assumes this component will be used as a component prop for a Route component

const FormDetailsContainer = ({
  forms,
  loading,
  // error,
  match: {
    params: {
      id,
    },
  },
  history: {
    replace,
  },
}) => {
  const foundForm = forms.find(form => form.uuid === id);
  if (!foundForm) return null;

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <SectionHeader
        replaceHistory
        title={foundForm.name}
        icon="today"
        sections={[{
          title: 'Back',
          icon: 'chevron_left',
          color: 'rgba(0,0,0,0.6)',
        }, {
          title: 'Edit',
          icon: 'edit',
          to: `/form/${foundForm.uuid}/edit`,
        }, {
          title: 'Submissions',
          icon: 'assessment',
          to: `/form/${foundForm.uuid}/submissions`,
        }, {
          title: 'Delete',
          icon: 'delete_forever',
          to: `/form/${foundForm.uuid}/delete`,
          color: '#cc4b37',
        }]}
      />
      <Route
        exact
        path="/form/:id"
        render={() => (
          <Redirect to={`/form/${foundForm.uuid}/edit`} />
        )}
      />
      <Route
        path="/form/:id/delete"
        render={() => (
          <DeleteConfirmation
            message="Are you sure you want to delete this form forever?"
            resource="forms"
            record={foundForm}
            response={(err, response) => {
              if (response && !err) {
                replace('/guild/forms');
              }
            }}
          />
        )}
      />
      <Route
        exact
        path="/form/:id/submissions"
        component={FormSubmissions}
      />
      <Route
        path="/form/:id/edit"
        render={() => (
          <div className="cell large-8 medium-10">
            <FormsForm
              form={foundForm}
            />
          </div>
        )}
      />
    </div>
  );
};

FormDetailsContainer.propTypes = {
  forms: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  // error: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

FormDetailsContainer.defaultProps = {
  forms: [],
  loading: false,
  // members: [],
  // user: null,
  // error: false,
};
export default connect(
  (state) => {
    const { user } = state.users.auth;
    return {
      user,
      members: state.members.list._list,
      forms: state.forms.list._list,
    };
  },
  null,
  null,
  { pure: false },
)(FormDetailsContainer);
