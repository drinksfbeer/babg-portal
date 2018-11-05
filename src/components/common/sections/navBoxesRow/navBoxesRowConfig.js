import NavBoxesRow from './navBoxesRow';
import { FileStackField, TextField, ToggleField, IconPickerField } from '../../form/inputs/index';

export default {
  name: 'Nav Box Row',
  component: NavBoxesRow,
  materialIcon: 'apps',
  styleClass: 'grid-x grid-padding-x grid-padding-y',
  fields: {
    backgroundImage1: {
      required: true,
      component: FileStackField,
      props: {
        label: 'Background Image 1',
        containerClass: 'cell large-4',
      },
    },
    title1: {
      component: TextField,
      props: {
        label: 'Title 1',
        containerClass: 'cell large-6',
      },
    },
    toggle1: {
      component: ToggleField,
      props: {
        label: 'Hide Nav Box 1',
        containerClass: 'cell large-2',
      },
    },
    icon1: {
      component: IconPickerField,
      props: {
        label: 'Icon 1',
        containerClass: 'cell large-4',
      },
    },
    callToAction1: {
      component: TextField,
      props: {
        label: 'Call To Action 1',
        containerClass: 'cell large-4',
      },
    },
    link1: {
      component: TextField,
      props: {
        label: 'Nav Box 1 Page Redirect',
        containerClass: 'cell large-4',
      },
    },
    backgroundImage2: {
      required: true,
      component: FileStackField,
      props: {
        label: 'Background Image 2',
        containerClass: 'cell large-4',
      },
    },
    title2: {
      component: TextField,
      props: {
        label: 'Title 2',
        containerClass: 'cell medium-6',
      },
    },
    toggle2: {
      component: ToggleField,
      props: {
        label: 'Hide Nav Box 2',
        containerClass: 'cell large-2',
      },
    },
    icon2: {
      component: IconPickerField,
      props: {
        label: 'Icon 2',
        containerClass: 'cell large-4',
      },
    },
    callToAction2: {
      component: TextField,
      props: {
        label: 'Call To Action 2',
        containerClass: 'cell large-4',
      },
    },
    link2: {
      component: TextField,
      props: {
        label: 'Nav Box 2 Page Redirect',
        containerClass: 'cell medium-4',
      },
    },
    backgroundImage3: {
      required: true,
      component: FileStackField,
      props: {
        label: 'Background Image 3',
        containerClass: 'cell large-4',
      },
    },
    title3: {
      component: TextField,
      props: {
        label: 'Title 3',
        containerClass: 'cell large-6',
      },
    },
    toggle3: {
      component: ToggleField,
      props: {
        label: 'Hide Nav Box 3',
        containerClass: 'cell large-2',
      },
    },
    icon3: {
      component: IconPickerField,
      props: {
        label: 'Icon 3',
        containerClass: 'cell large-4',
      },
    },
    callToAction3: {
      component: TextField,
      props: {
        label: 'Call To Action 3',
        containerClass: 'cell large-4',
      },
    },
    link3: {
      component: TextField,
      props: {
        label: 'Nav Box 3 Page Redirect',
        containerClass: 'cell large-4',
      },
    },
  },
};
