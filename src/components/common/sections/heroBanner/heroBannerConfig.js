import heroBanner from './heroBanner';

import { FileStackField, TextField, TextAreaField, IconPickerField } from '../../form/inputs/index';

export default {
  name: 'Hero Banner',
  component: heroBanner,
  materialIcon: 'calendar_view_day',
  // styleClass: the classname for the component wrapping all the fields
  styleClass: 'grid-x grid-padding-x',
  fields: {
    title: {
      component: TextField,
      props: {
        label: 'Title',
        containerClass: 'cell large-6 medium-6',
      },
    },
    subtitle: {
      component: TextField,
      props: {
        label: 'Subtitle',
        containerClass: 'cell large-6 medium-6',
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
    description: {
      component: TextAreaField,
      props: {
        label: 'Description',
        containerClass: 'cell large-6 medium-6',
        rows: 5,
      },
    },
    buttonTitle1: {
      component: TextField,
      props: {
        label: 'Button Title 1',
        containerClass: 'cell large-4 medium-4',
      },
    },
    buttonLink1: {
      component: TextField,
      props: {
        label: 'Button Link 1',
        containerClass: 'cell large-4 medium-4',
      },
    },
    buttonIcon1: {
      component: IconPickerField,
      props: {
        label: 'Button Icon 1',
        containerClass: 'cell large-4 medium-4',
      },
    },
    buttonTitle2: {
      component: TextField,
      props: {
        label: 'Button Title 2',
        containerClass: 'cell large-4 medium-4',
      },
    },
    buttonLink2: {
      component: TextField,
      props: {
        label: 'Button Link 2',
        containerClass: 'cell large-4 medium-4',
      },
    },
    buttonIcon2: {
      component: IconPickerField,
      props: {
        label: 'Button Icon 2',
        containerClass: 'cell large-4 medium-4',
      },
    },
    minHeight: {
      component: TextField,
      props: {
        label: 'Height (example 50vh)',
        containerClass: 'cell large-4 medium-4',
      },
    },
  },
};
