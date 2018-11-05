import Video from './video';
import {
  TextField,
  ToggleField,
  TextAreaField,
} from '../../form/inputs';

export default {
  name: 'Video',
  component: Video,
  materialIcon: 'video_library',
  fields: {
    videoUrl: {
      required: true,
      component: TextField,
      props: {
        label: 'Video Url *required (works best with vimeo)',
        placeholder: 'ex: https://vimeo.com/271372942',
      },
    },
    title: {
      component: TextField,
      props: {
        label: 'Title',
      },
    },
    description: {
      component: TextAreaField,
      props: {
        label: 'Description',
      },
    },
    fullWidth: {
      component: ToggleField,
      props: {
        label: 'Full Width',
      },
    },
    background: {
      component: ToggleField,
      props: {
        label: 'Background Color',
      },
    },
  },
};
