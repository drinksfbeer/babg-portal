import CallOutWithImage from './callOutWithImage';

import { FileStackField, TextField, TextAreaField, SelectField, IconPickerField } from '../../form/inputs/index';

export default {
  name: 'Call Out With Image',
  component: CallOutWithImage,
  materialIcon: 'comment_add_photo',
  // styleClass: the classname for the component wrapping all the fields
  styleClass: 'grid-x grid-padding-x grid-padding-y',
  fields: {
    title: {
      component: TextField,
      props: {
        label: 'Title',
        containerClass: 'cell',
      },
    },
    backgroundImage: {
      required: true,
      component: FileStackField,
      props: {
        label: 'Background Image',
        containerClass: 'cell large-6 medium-6',
      },
    },
    bodyText: {
      component: TextAreaField,
      props: {
        label: 'Body Text',
        containerClass: 'cell large-6 medium-6',
      },
    },
    buttonText: {
      component: TextField,
      props: {
        label: 'Button Text',
        containerClass: 'cell large-4',
      },
    },
    buttonLink: {
      component: TextField,
      props: {
        label: 'Button Links To:',
        containerClass: 'cell large-4',
      },
    },
    icon: {
      component: IconPickerField,
      props: {
        label: 'Icon',
        containerClass: 'cell large-4',
      },
    },
    positionSelect: {
      component: SelectField,
      props: {
        label: 'Position Options',
        options: [{
          value: 'left',
          title: 'Left',
        }, {
          value: 'right',
          title: 'Right',
        }, {
          value: 'center',
          title: 'Center',
        }],
        placeholder: 'Choose one',
        containerClass: 'cell',
      },
    },
  },
};
