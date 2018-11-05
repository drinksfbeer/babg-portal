import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import swal from 'sweetalert2';

import formBuilderFields from './formBuilderFields';
import { TextField, ToggleField } from '../../../common/form/inputs';
import { required } from '../../../common/form/validations/index';
// import { TextField } from '../../../common/form/inputs';
// import { required } from '../../../common/form/validations/index';
// import FieldBuilder from './fieldBuilder';

class FormBuilderForm extends React.Component {
  onDragEnd = (result) => {
    const {
      fields,
    } = this.props;
    if (!result.destination) {
      return;
    }
    fields.move(result.source.index, result.destination.index);
  }
  onSectionRemove(index) {
    const {
      fields,
    } = this.props;
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
  }
  render() {
    const {
      fields,
      values,
    } = this.props;
    const { sections = [] } = values;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div
              className="grid-x grid-padding-x grid-padding-y"
              ref={provided.innerRef}
            >
              {/* builder */}
              <div className="cell large-9 medium-9">
                <div className="grid-x grid-margin-x grid-padding-x grid-padding-y grid-margin-y">
                  {fields.map((field, index) => {
                    const existingField = sections[index];
                    if (!existingField) {
                      console.warn('unmatched field type for form builder'); // eslint-disable-line
                      return null;
                    }
                    const fieldTypeName = existingField.fieldType;
                    const isSectionHeader = fieldTypeName === 'Section Header'; // matches by string so be careful
                    if (isSectionHeader) {
                      return (
                        <Draggable
                          key={field}
                          draggableId={field}
                          index={index}
                        >
                          {provided => ( // eslint-disable-line
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="section-item cell"
                            >
                              <div style={{ position: 'relative' }}>
                                <span
                                  style={{
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                  }}
                                  onClick={() => this.onSectionRemove(index)}
                                >
                                  &times;
                                </span>
                              </div>
                              <Field
                                name={`${field}.question`} // more of a label but will use question
                                component="input"
                                type="text"
                                validate={[required]}
                                placeholder="Insert Section Header Title here"
                                style={{
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  boxShadow: 'none',
                                  fontSize: '100%',
                                  margin: '0px',
                                }}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    }
                    const foundField = formBuilderFields.find(f => f.name === fieldTypeName);
                    if (!foundField) {
                      console.warn('unfound field for form builder'); // eslint-disable-line
                      return null;
                    }
                    const fieldAttributes = (foundField && foundField.attributes) || [];
                    return (
                      <Draggable
                        key={field}
                        draggableId={field}
                        index={index}
                      >
                        {provided => ( // eslint-disable-line
                          <div
                            key={field}
                            className="app-item cell"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}

                          >
                            <div style={{ position: 'relative' }}>
                              <span
                                style={{
                                  cursor: 'pointer',
                                  position: 'absolute',
                                  top: -5,
                                  right: 0,
                                  fontSize: '115%',
                                }}
                                onClick={() => this.onSectionRemove(index)}
                              >
                                &times;
                              </span>
                            </div>
                            <Field
                              name={`${field}.question`}
                              component={TextField}
                              label={`Question to ask for ${fieldTypeName} field`}
                              placeholder="example: What is your address"
                            />
                            <Field
                              name={`${field}.required`}
                              component={ToggleField}
                              label="Required"
                            />
                            {fieldAttributes.map((attribute, i) => (
                              <div
                                key={i} // eslint-disable-line
                              >
                                <Field
                                  name={`${field}.${attribute.name}`}
                                  {...attribute.props}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                </div>
              </div>
              {/* section and field choosers */}
              <div className="cell large-3 medium-3">
                <div className="grid-x grid-padding-x grid-padding-y">
                  <div className="cell">
                    <em>Add a section Header</em>
                  </div>
                  <div
                    className="cell app-item"
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={() => fields.push({
                      fieldType: 'Section Header',
                    })}
                  >
                    <strong>+ Add Section Header</strong>
                  </div>
                </div>
                <div style={{ padding: '25px' }} />

                {/* field chooser */}
                <div className="grid-x grid-padding-x grid-padding-y">
                  <div className="cell">
                    <em>Choose a field to add to your form</em>
                  </div>
                  {formBuilderFields.map(formBuilderField => (
                    <div
                      key={formBuilderField.name}
                      className="app-item cell"
                      style={{
                        cursor: 'pointer',
                      }}
                      onClick={() => fields.push({
                        fieldType: formBuilderField.name,
                      })}
                    >
                      <strong>{formBuilderField.name}</strong>
                    </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}


FormBuilderForm.propTypes = {
  fields: PropTypes.shape({}),
  values: PropTypes.shape({}).isRequired,
};

FormBuilderForm.defaultProps = {
  fields: {},
};

export default FormBuilderForm;
