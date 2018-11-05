import {
  // FileStackField,
  TextField,
  TextAreaField,
  SelectField,
  ToggleField,
  MultiSelectField,
  DatePickerField,
  // QuillField,
  CommaTextField,
} from '../../../common/form/inputs/index';

const fields = [{
  name: 'Text',
  component: TextField,
  attributes: [],
}, {
  name: 'Text Area',
  component: TextAreaField,
  attributes: [],
}, {
  name: 'Dropdown',
  component: SelectField,
  attributes: [{
    name: 'options',
    required: true,
    props: {
      component: CommaTextField,
      label: 'Options *separate options with commas',
    },
  }],
}, {
  name: 'Toggle',
  component: ToggleField,
  attributes: [],
}, {
  name: 'Multi-Select Dropdown',
  component: MultiSelectField,
  attributes: [{
    name: 'options',
    required: true,
    props: {
      label: 'Options *separate options with commas*',
      component: CommaTextField,
    },
  }],
}, {
  name: 'Date Picker',
  component: DatePickerField,
  attributes: [],
}];

export default fields;
