import React from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import VisualBuilderSection from './pageBuilderSection';

import sections from '../../../sections/index';

const sectionKeys = Object.keys(sections);


class PageBuilderForm extends React.Component {
  onDragEnd = (result) => {
    const {
      fields,
    } = this.props;
    if (!result.destination) {
      return;
    }
    fields.move(result.source.index, result.destination.index);
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
                      isDragDisabled={(componentReferenceName === 'AddHtmlConfig') ? 'true' : null}
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

PageBuilderForm.propTypes = {
  fields: PropTypes.shape({}),
  sectionsFromStore: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

PageBuilderForm.defaultProps = {
  fields: {},
};

export default PageBuilderForm;
