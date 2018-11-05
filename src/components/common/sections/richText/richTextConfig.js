import RichText from './richText';
import { QuillField } from '../../form/inputs';

export default {
  name: 'Rich Text',
  component: RichText,
  materialIcon: 'text_fields',
  fields: {
    input: {
      component: QuillField,
      props: {
        label: 'Rich Text Input',
        containerClass: 'cell',
      },
    },
  },
};
