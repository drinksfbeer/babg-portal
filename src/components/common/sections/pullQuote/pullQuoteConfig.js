import PullQuote from './pullQuote';
import { TextAreaField } from '../../form/inputs';

export default {
  name: 'Pull Quote',
  component: PullQuote,
  materialIcon: 'format_quote',
  fields: {
    text: {
      required: true,
      component: TextAreaField,
      props: {
        label: 'Quote Text Body',
      },
    },
  },
};
