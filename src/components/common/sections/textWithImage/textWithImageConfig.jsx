import TextWithImage from './textWithImage';

import {
  TextAreaField,
  TextField,
  ToggleField,
  FileStackField,
  IconPickerField,
} from '../../form/inputs/index';

export default {
  name: 'Text With Image',
  materialIcon: 'notes_add_photo',
  component: TextWithImage,
  styleClass: 'grid-x grid-padding-x grid-padding-y',
  fields: {
    icon: {
      required: true,
      component: IconPickerField,
      props: {
        label: 'Icon',
        placeholder: 'ex: bullhorn',
        containerClass: 'cell large-4 medium-4',
      },
    },
    title: {
      required: true,
      component: TextField,
      props: {
        label: 'Title',
        containerClass: 'cell large-4 medium-4',
      },
    },
    subtitle: {
      required: true,
      component: TextAreaField,
      props: {
        label: 'Subtitle',
        containerClass: 'cell large-4 medium-4',
      },
    },
    buttonLink: {
      component: TextField,
      props: {
        label: 'Button Link',
        containerClass: 'cell large-4 medium-4',
      },
    },
    buttonText: {
      component: TextField,
      props: {
        label: 'Button Text',
        containerClass: 'cell large-4 medium-4',
      },
    },
    image: {
      required: true,
      component: FileStackField,
      props: {
        label: 'Image',
        containerClass: 'cell large-4 medium-4',
      },
    },
    hexCode: {

      component: TextField,
      props: {
        label: 'Background Color',
        containerClass: 'cell large-4 medium-4',
      },
    },
    flipped: {
      component: ToggleField,
      props: {
        label: 'Flipped',
        containerClass: 'cell large-4 medium-4',
      },
    },
    stacked: {
      component: ToggleField,
      props: {
        label: 'Stacked',
        containerClass: 'cell large-4 medium-4',
      },
    },
  },

  // fields: {
  //   image: {
  //     required: true,
  //     component: FileStackField,
  //     props: {
  //       label: 'Image',
  //       containerClass: 'cell large-4 medium-4',
  //     },
  //   },
  //   text: {
  //     required: true,
  //     component: TextAreaField,
  //     props: {
  //       label: 'Text',
  //       containerClass: 'cell large-7 medium-7',
  //     },
  //   },
  //   flipped: {
  //     component: ToggleField,
  //     props: {
  //       label: 'Flipped',
  //       containerCLass: 'cell large-1',
  //     },
  //   },
  // },
};
