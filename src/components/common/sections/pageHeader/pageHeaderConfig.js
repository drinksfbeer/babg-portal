import PageHeader from './pageHeader';
import {
  IconPickerField,
  TextField,
  FileStackField,
} from '../../form/inputs';

export default {
  name: 'Page Header',
  materialIcon: 'panorama',
  component: PageHeader,
  fields: {
    icon: {
      component: IconPickerField,
      props: {
        label: 'Icon *optional',
        placeholder: 'ex: bullhorn',
      },
    },
    title: {
      required: true,
      component: TextField,
      props: {
        label: 'Title *required',
      },
    },
    subtitle: {
      required: false,
      component: TextField,
      props: {
        label: 'Subtitle *optional',
      },
    },
    backgroundImageUrl: {
      required: true,
      component: FileStackField,
      props: {
        label: 'Image *required',
      },
    },
  },
};
