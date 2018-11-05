import FullWidthImage from './fullWidthImage';

import { TextField, FileStackField } from '../../../form/inputs/index';

export default {
  name: 'Full Width Image',
  component: FullWidthImage,
  materialIcon: 'photo_size_select_large',
  styleClass: 'grid-x grid-padding-x grid-padding-y',
  fields: {
    backgroundImageUrl: {
      required: true,
      component: FileStackField,
      props: {
        label: 'Background Image',
        placeholder: 'ex: https://via.placeholder.com/1000x450',
        containerClass: 'cell medium-6',
      },
    },
    height: {
      component: TextField,
      props: {
        label: 'Height *optional*',
        placeholder: '1000px or 40vh',
        containerClass: 'cell medium-6',
      },
    },
  },
};
