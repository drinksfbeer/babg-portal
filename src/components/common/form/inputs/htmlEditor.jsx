import React from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';

const LoadableAceEditor = Loadable({
  loader: () => import('react-ace').then(async (ace) => {
    // `import()` returns a promise of the loaded component
    // we have to wait for `react-ace` first in order to load the files below
    // or else, you'll get an 'ace' is not defined error!
    await import('brace/mode/html'); // eslint-disable-line
    await import('brace/theme/dawn'); // eslint-disable-line
    await import('brace/ext/language_tools'); // eslint-disable-line
    return ace;
  }),
  loading: () => (
    <p>Loading the HTML editor, please wait!</p>
  ),
  render(loaded, props) {
    const AceEditor = loaded.default;
    return (
      <AceEditor
        mode="html"
        theme="dawn"
        {...props}
      />
    );
  },
});

const htmlEditor = ({
  input,
  label,
  containerClass,
}) => (
  <div className={containerClass}>
    <div>{label}</div>
    <div>
      <LoadableAceEditor
        value={input.value}
        onChange={input.onChange}
        name="addHtml"
        width="100%"
        editorProps={{ $blockScrolling: Infinity }}
        setOptions={{
          scrollPastEnd: true,
          displayIndentGuides: true,
        }}
      />
    </div>
  </div>
);


htmlEditor.propTypes = {
  label: PropTypes.string,
  containerClass: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
};

htmlEditor.defaultProps = {
  label: '',
  containerClass: '',
};


export default htmlEditor;
