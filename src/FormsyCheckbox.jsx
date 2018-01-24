import React from 'react';
import Formsy, { withFormsy } from 'formsy-react';
import Checkbox from 'material-ui/Checkbox';
import { setMuiComponentAndMaybeFocus } from './utils';

class FormsyCheckbox extends React.Component { 
/*
  propTypes: {
    defaultChecked: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    validationError: PropTypes.string,
    validationErrors: PropTypes.object,
    validations: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  },
  */


  handleChange = (event, value) => {
    this.props.setValue(value);
  }

  render = () => {
    const {
      errorText,
      getErrorMessage,
      getErrorMessages,
      getValue,
      value,
      required,
      hasValue,
      hintText,
      isValid,
      isValidValue,
      isPristine,
      isRequired,
      isFormDisabled,
      isFormSubmitted,
      resetValue,
      setValidations,
      setValue,
      showError,
      showRequired,
      validations, // eslint-disable-line no-unused-vars
      validationError, // eslint-disable-line no-unused-vars
      validationErrors, // eslint-disable-line no-unused-vars
      ...rest } = this.props;

    return (
      <Checkbox
        disabled={isFormDisabled()}
        {...rest}
        checked={getValue()}
        onChange={this.handleChange}
      />
    );
  }
}

export default withFormsy(FormsyCheckbox);
