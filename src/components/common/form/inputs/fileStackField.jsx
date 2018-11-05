import React from 'react';
import PropTypes from 'prop-types';
import ReactFilestack from 'filestack-react';

const fileStackApiKey = 'AZJE4LvOmQzeIJUiL5I5Az';

const FileStackField = ({
  input: {
    value,
    onChange,
  },
  label,
  options,
  containerClass,
  preview,
  description,
  disabled, // eslint-disable-line
  meta: {
    error,
    touched,
  },
}) => {
  const fileStackProps = {
    apikey: fileStackApiKey,
    options: {
      maxFiles: 1,
      ...options,
    },
    buttonClass: 'button filestackButton',
    buttonText: value ? `Replace ${label}` : `Upload ${label}`,
    onSuccess: response => onChange(response.filesUploaded[0].url),
  };
  const maxWidth = Array.isArray(options.imageMax) ? options.imageMax[0] : 1920;
  const maxHeight = Array.isArray(options.imageMax) ? options.imageMax[1] : 1080;

  return (
    <div className={containerClass}>
      <label>
        {label}
        {
          (touched && error) &&
          <span className="errorMessage">
            {error}
          </span>
        }
      </label>
      <div className="grid-x grid-margin-x align-center align-justify">
        <div className="cell large-6 text-center">
          {(preview && value) ? (
            <img
              className="render-image"
              alt="uploaded"
              width="100%"
              src={value}
            />
          ) : (
            <img
              alt="uploaded"
              src={`https://via.placeholder.com/${maxWidth}x${maxHeight}`}
            />
          )}
        </div>
        <div className="cell large-6">
          {
            !disabled &&
            <ReactFilestack {...fileStackProps} />
          }
          {
            disabled &&
            <button
              className={fileStackProps.buttonClass}
              disabled
            >
              {fileStackProps.buttonText}
            </button>
          }
          {
            description &&
            <div className="description">
              {description}
            </div>
          }
        </div>
      </div>
    </div>
  );
};

FileStackField.propTypes = {
  description: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.string,
  options: PropTypes.shape({}),
  containerClass: PropTypes.string,
  preview: PropTypes.bool,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool,
  }).isRequired,
};

FileStackField.defaultProps = {
  description: '',
  label: '',
  options: {
    imageMax: [1920, 1920],
    imageMin: [800, 600],
  },
  containerClass: 'cell file-stack-field',
  preview: true,
};
export default FileStackField;
