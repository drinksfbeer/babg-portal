import VideoBackground from './videoBackground';
import {
  TextField,
  QuillField,
} from '../../form/inputs';

export default {
  name: 'Video Background',
  component: VideoBackground,
  materialIcon: 'video_library_featured_video',
  fields: {
    videoUrl: {
      required: true,
      component: TextField,
      props: {
        label: 'Video Background Url *required (works best with your own mp4 link)',
        placeholder: 'ex: https://amazonawsstuff.com/video/1.mp4',
      },
    },
    height: {
      component: TextField,
      props: {
        label: 'Height *optional defaults to 100vh',
        placeholder: 'ex: 40vh or 40%',
      },
    },
    // mobileFallBackImage: {
    //   component: TextField,
    //   props: {
    //     label: 'Fall Back for Mobile (video does not auto play)',
    //   },
    // },
    content: {
      component: QuillField,
      props: {
        label: 'Centered Content',
      },
    },
  },
};
