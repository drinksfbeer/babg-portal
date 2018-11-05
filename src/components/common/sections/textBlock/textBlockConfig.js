import TextBlock from './textBlock';

import { TextAreaField } from '../../form/inputs/index';

export default {
  name: 'Text Block',
  component: TextBlock,
  materialIcon: 'notes',
  // styleClass: the classname for the component wrapping all the fields
  styleClass: 'grid-x grid-padding-x grid-padding-y',
  fields: {
    text: {
      required: true,
      component: TextAreaField,
      props: {
        label: 'Title',
        containerClass: 'cell large-6 medium-6',
      },
    },
    body: {
      required: false,
      component: TextAreaField,
      props: {
        label: 'Body',
        containerClass: 'cell large-6 medium-6',
      },
    },
  },
};
