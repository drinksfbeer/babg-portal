import React from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
// import ReactQuill from 'react-quill';
// import swal from 'sweetalert';

const LoadableReactQuill = Loadable({
  loader: () => import('react-quill'),
  loading: () => (
    <p>Loading the rich text editor, please wait!</p>
  ),
  render(Quill, props) {
    return <Quill ref={props.quillRef} {...props} />;
  },
});

class QuillField extends React.Component {
  // currently broken (range is null)
  // imageHandler = async () => {
  //   if (this.quillRef) {
  //     // const value = prompt('What is the image URL?'); // eslint-disable-line
  //     const value = await swal({
  //       title: 'What is the image URL?',
  //       content: {
  //         element: 'input',
  //         attributes: {
  //           placeholder: 'enter url',
  //           type: 'text',
  //         },
  //       },
  //     });
  //     if (value) {
  //       const editor = this.quillRef.getEditor();
  //       const range = editor.getSelection();
  //       console.log('ref:', this.quillRef);
  //       console.log('editor:', editor);
  //       console.log('range:', range);
  //       editor.insertEmbed(!!range && !!range.index ? range.index : 0, 'image', value);
  //     }
  //   }
  // }

  render() {
    const {
      label,
      containerClass,
      input,
      height,
      formats,
      toolbar,
      disabled,
      quillStyle,
    } = this.props;

    const modules = {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          // ['link', 'image', 'video', 'fullImage'],
          ['link'],
          ['clean'],
        ],
        ...toolbar,
        // handlers: {
        //   image: this.imageHandler,
        //   fullImage: this.imageHandler,
        // },
      },
    };

    return (
      <div className={containerClass}>
        <label>{label}</label>
        <LoadableReactQuill
          quillRef={(ref) => { this.quillRef = ref; }}
          style={{
            height,
            paddingBottom: '60px',
            marginBottom: '42px',
            opacity: disabled ? 0.5 : 1,
            ...quillStyle,
          }}
          modules={modules}
          formats={formats}
          value={input.value}
          onChange={input.onChange}
          readOnly={disabled}
        />
      </div>
    );
  }
}
QuillField.propTypes = {
  label: PropTypes.string,
  containerClass: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  height: PropTypes.string,
  disabled: PropTypes.bool,
  quillStyle: PropTypes.shape({}),
  formats: PropTypes.arrayOf(PropTypes.string),
  toolbar: PropTypes.shape({}),
};

QuillField.defaultProps = {
  label: '',
  containerClass: '',
  height: '350px',
  disabled: false,
  quillStyle: {},
  formats: [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link',
  ],
  toolbar: {},
};


export default QuillField;
