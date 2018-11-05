import React from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import VisualBuilderSection from './visualBuilderSection';

import sections from '../../../sections/index';

const sectionKeys = Object.keys(sections);


class VisualBuilderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      htmlActive: false,
    };

    this.disableHtmlDrag = this.disableHtmlDrag.bind(this);
  }

  onDragEnd = (result) => {
    const {
      fields,
    } = this.props;
    if (!result.destination) {
      return;
    }
    fields.move(result.source.index, result.destination.index);
  }

  disableHtmlDrag = (newstate) => {
    this.setState(newstate);
  }

  render() {
    const {
      fields,
      sectionsFromStore,
    } = this.props;

    return (
      <div>
        <div>
          <select
            ref={(ref) => { this.selector = ref; }}
            onChange={(e) => {
              const alreadyHasInstagram = sectionsFromStore.map(sec => sec.component).includes('instagramFeedConfig') && e.target.value === 'instagramFeedConfig';
              if (alreadyHasInstagram) {
                swal({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Cannot have more than one instagram section!',
                });
              } else {
                fields.push({
                  component: e.target.value,
                });
              }
              if (this.selector) {
                this.selector.value = '';
              }
            }}
          >
            <option value="">add a new section</option>
            {sectionKeys.map(section => (
              <option
                key={section}
                value={section}
              >
                {sections[section].name}
              </option>
            ))}
          </select>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
              <div
                ref={provided.innerRef}
              >
                {fields.map((field, index) => {
                  const section = sectionsFromStore[index];
                  if (!section) return null;
                  const {
                    component: componentReferenceName,
                    ...componentProps
                  } = section;
                  if (!componentReferenceName) {
                    console.warn('no component reference name'); // eslint-disable-line no-console
                    return null;
                  }
                  return (
                    <Draggable
                      key={field}
                      draggableId={field}
                      index={index}
                      isDragDisabled={(componentReferenceName === 'AddHtmlConfig' && this.state.htmlActive) ? 'true' : null}
                    >
                      {provided => ( // eslint-disable-line
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <VisualBuilderSection
                            componentReferenceName={componentReferenceName}
                            index={index}
                            componentProps={componentProps}
                            fields={fields}
                            disableHtmlDrag={this.disableHtmlDrag}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

VisualBuilderForm.propTypes = {
  fields: PropTypes.shape({}),
  sectionsFromStore: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

VisualBuilderForm.defaultProps = {
  fields: {},
};

export default VisualBuilderForm;
