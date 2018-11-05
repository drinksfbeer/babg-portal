import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import swal from 'sweetalert2';

import { required } from '../../validations/index';
import AdminFormHeaderItem from '../../../../resources/forms/header/adminFormHeaderItem';
import sections from '../../../sections/index';

class BlogPostBuilderSection extends React.Component {
    state = {
      // active: false,
    }
    render() {
      const {
        componentReferenceName,
        index,
        fields,
      } = this.props;

      // const { active } = this.state;

      const referenceObject = sections[componentReferenceName];
      if (!referenceObject) {
        console.warn('no reference object'); // eslint-disable-line
        return null;
      }
      const referenceFieldsStyleClass = referenceObject.styleClass;
      const referenceFieldsObject = referenceObject.fields;
      const referenceFieldsArray = Object.keys(referenceFieldsObject);

      const clickDelete = () => {
        swal({
          title: 'Are you sure you want to delete this section?',
          showCancelButton: true,
          confirmuttonColor: '#333',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
          if (result.value) {
            fields.remove(index);
          }
        });
      };

      return (
        <div key={componentReferenceName + index}>
          <div className="grid-x grid-padding-x grid-padding-y">

            <AdminFormHeaderItem
              title={referenceObject.name}
              containerClass=""
              icon="times"
              onClick={clickDelete}

            />

          </div>


          <div className={referenceFieldsStyleClass || ''}>
            {referenceFieldsArray.map((fieldName) => {
              const referenceFieldObject = referenceFieldsObject[fieldName];
              return (
                <Field
                  validate={referenceFieldObject.required ? [required] : []}
                  key={fieldName}
                  name={`sections[${index}].${fieldName}`}
                  component={referenceFieldObject.component}
                  {...referenceFieldObject.props}
                  containerStyle={{
                    margin: '0px 0px',
                  }}
                />
              );
            })}
          </div>
        </div>
      );
    }
}

BlogPostBuilderSection.propTypes = {
//   referenceSections: PropTypes.arrayOf(PropTypes.string).isRequired,
  componentReferenceName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  componentProps: PropTypes.shape({}).isRequired,
  //   changePageFormState: PropTypes.func.isRequired,
  fields: PropTypes.shape({}).isRequired,
};

BlogPostBuilderSection.defaultProps = {
};

export default BlogPostBuilderSection;
