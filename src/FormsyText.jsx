import React from 'react';
import keycode from 'keycode';
import Formsy, { withFormsy } from 'formsy-react';
import TextField from 'material-ui/TextField';
import { setMuiComponentAndMaybeFocus, debounce } from './utils';

class FormsyText extends React.Component {
  static defaultProps = {
    underlineFocusStyle: {},
    underlineStyle: {},
    validationColor: '#4CAF50',
  }

  state = {
    value: ""
  }

  componentWillMount = () => {
    const { getValue } = this.props;
    this.setState({
      value: getValue()
    });
  }

  componentWillReceiveProps = (nextProps) => {
    const { getValue } = nextProps;
    this.setState({
      value: getValue()
    });

  }

  handleChange = (event) => {
    // Update the value (and so display any error) after a timeout.
    const { setValue, isValidValue, getErrorMessage } = this.props;

    // If there was an error (on loss of focus) update on each keypress to resolve same.
    const value = event.target.value;

    //Debounce notifications to Formsy
    if(!this.changeValue){
      this.changeValue = debounce(setValue, 400);
    }
    this.changeValue(value);

    this.setState({
      value
    });
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
      label,
      resetValue,
      setValidations,
      setValue,
      showError,
      showRequired,
      validations, // eslint-disable-line no-unused-vars
      validationColor,
      validationError, // eslint-disable-line no-unused-vars
      validationErrors, // eslint-disable-line no-unused-vars
      underlineStyle,
      underlineFocusStyle,
      ...rest } = this.props;

      const { value: currentValue } = this.state;

    return (
      <TextField
        error={showError()}
        required={showRequired()}
        helperText={getErrorMessage()}
        label={label}
        disabled={isFormDisabled()}
        onChange={this.handleChange}
        value={currentValue}
        {...rest}
      />
    );
  }
}

export default withFormsy(FormsyText);
