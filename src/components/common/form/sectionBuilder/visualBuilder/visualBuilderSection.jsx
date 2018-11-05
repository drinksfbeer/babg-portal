import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import swal from 'sweetalert2';

import { required } from '../../validations/index';
import AdminFormHeaderItem from
  '../../../../resources/forms/header/adminFormHeaderItem';
import sections from '../../../sections/index';

class VisualBuilderSection extends React.Component {
    state = {
      active: false,
    }
    render() {
      const {
        componentProps,
        componentReferenceName,
        index,
        fields,
        disableHtmlDrag,
      } = this.props;

      const { active } = this.state;
      const referenceObject = sections[componentReferenceName];
      if (!referenceObject) {
        console.warn('no reference object'); // eslint-disable-line
        return null;
      }
      const referenceFieldsStyleClass = referenceObject.styleClass;
      const referenceFieldsObject = referenceObject.fields;
      const referenceFieldsArray = Object.keys(referenceFieldsObject);
      const ReferenceComponent = referenceObject.displayComponent || referenceObject.component;

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
              materialIcon={referenceObject.materialIcon}
            />
          </div>

          {/* <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            >
            <h5>{referenceObject.name}</h5>
            <span
              style={{
            cursor: 'pointer',
            fontSize: '200%',
              }}
              onClick={() => {
            swal({
            title: 'Are you sure you want to delete this section?',
            showCancelButton: true,
            confirmButtonColor: '#333',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
            if (result.value) {
            fields.remove(index);
            }
            });
              }}
            >
              &times;
            </span>
          </div> */}
          <div
            style={{
              padding: '15px',
              backgroundColor: 'rgba(240, 240, 240, 1)',
              position: 'relative',
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '-15px',
                  left: '0',
                  right: '0',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  backgroundColor: active ? '#222' : 'white',
                  color: active ? 'white' : '#222',
                  borderRadius: '100%',
                  height: '50px',
                  width: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: 'solid rgba(0, 0, 0, 0.2) 1px',
                  zIndex: '999999999999999999999',
                }}
                onClick={() => {
                  this.setState({ active: !active });
                  disableHtmlDrag({ htmlActive: !this.state.active });
                }}
              >
                <i className="material-icons">create</i>
              </div>
              <ReferenceComponent
                {...componentProps}
              />
            </div>
          </div>
          {active &&
            <div className={referenceFieldsStyleClass || ''}>
              {referenceFieldsArray.map((fieldName) => {
                const referenceFieldObject = referenceFieldsObject[fieldName];
                return (
                  <Field
                    validate={referenceFieldObject.required ? [required] : []}
                    key={fieldName}
                    name={`sections[${index}].${fieldName}`}
                    component={referenceFieldObject.component}
                    preview={false}
                    containerStyle={{
                      margin: '0px 0px',
                    }}
                    {...referenceFieldObject.props}
                  />
                );
              })}
            </div>
            }
        </div>
      );
    }
}

VisualBuilderSection.propTypes = {
//   referenceSections: PropTypes.arrayOf(PropTypes.string).isRequired,
  componentReferenceName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  componentProps: PropTypes.shape({}).isRequired,
  //   changePageFormState: PropTypes.func.isRequired,
  fields: PropTypes.shape({}).isRequired,
  disableHtmlDrag: PropTypes.func,
};

VisualBuilderSection.defaultProps = {
  disableHtmlDrag: null,
};

export default VisualBuilderSection;
