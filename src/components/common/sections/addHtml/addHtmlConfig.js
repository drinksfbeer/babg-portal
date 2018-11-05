import addHtml from './addHtml';
import { HtmlEditor } from '../../form/inputs';

export default {
  name: 'Raw HTML',
  component: addHtml,
  materialIcon: 'code',
  fields: {
    input: {
      component: HtmlEditor,
      props: {
        label: 'HTML Input',
        containerClass: 'cell',
      },
    },
  },
};
