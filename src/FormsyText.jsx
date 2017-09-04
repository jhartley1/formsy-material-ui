import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import { HOC } from 'formsy-react';
import MUITextField from 'material-ui/TextField';
import { debounce, filterHOCProps } from './utils';

class FormsyText extends React.Component {
  static displayName = 'formsyMUI(FormsyText)';

  static propTypes = {
    FormHelperTextProps: PropTypes.object,
    convertValue       : PropTypes.func,
    defaultValue       : PropTypes.any,
    name               : PropTypes.string.isRequired,
    onBlur             : PropTypes.func,
    onChange           : PropTypes.func,
    onKeyDown          : PropTypes.func,
    requiredError      : PropTypes.string,
    updateImmediately  : PropTypes.bool,
    validations        : PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    value              : PropTypes.any,

    // Formsy HOC
    setValue        : PropTypes.func.isRequired,
    resetValue      : PropTypes.func.isRequired,
    getValue        : PropTypes.func.isRequired,
    hasValue        : PropTypes.func.isRequired,
    getErrorMessage : PropTypes.func.isRequired,
    getErrorMessages: PropTypes.func.isRequired,
    isFormDisabled  : PropTypes.func.isRequired,
    isValid         : PropTypes.func.isRequired,
    isPristine      : PropTypes.func.isRequired,
    isFormSubmitted : PropTypes.func.isRequired,
    isRequired      : PropTypes.func.isRequired,
    showRequired    : PropTypes.func.isRequired,
    showError       : PropTypes.func.isRequired,
    isValidValue    : PropTypes.func.isRequired,
    validationError : PropTypes.string,
    validationErrors: PropTypes.object,
  };

  static defaultProps = {
    onChange : () => {},
    onKeyDown: () => {},
  };

  constructor(props) {
    super(props);
    const value = this.controlledValue();
    this.state = { value };
  }

  componentWillMount() {
    this.props.setValue(this.controlledValue());
  }

  componentWillReceiveProps(nextProps) {
    const isValueChanging = nextProps.value !== this.props.value;
    if (isValueChanging || nextProps.defaultValue !== this.props.defaultValue) {
      const value = this.controlledValue(nextProps);
      const isValid = this.props.isValidValue(value);

      if (isValueChanging || this.props.defaultValue === this.props.getValue()) {
        this.setState({ value, isValid });
        if (this.props.getValue() !== value) this.props.setValue(value);
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState._isPristine && // eslint-disable-line no-underscore-dangle
      nextState._isPristine !== this.state._isPristine) { // eslint-disable-line no-underscore-dangle
      // Calling state here is valid, as it cannot cause infinite recursion.
      const value = this.controlledValue(nextProps);
      const isValid = this.props.isValidValue(value);

      this.props.setValue(value);
      this.setState({ value, isValid });
    }
  }

  controlledValue(props = this.props) {
    return props.value || props.defaultValue || this.convertValue('');
  }

  handleBlur = (event) => {
    this.props.setValue(this.convertValue(event.target.value));

    delete this.changeValue;
    if (this.props.onBlur) this.props.onBlur(event);
  }

  handleChange = (event) => {
    event.persist();
    const { value } = event.target;
    const { updateImmediately } = this.props;

    // Update the value (and so display any error) after a timeout.
    if (updateImmediately) {
      if (!this.changeValue) {
        this.changeValue = debounce(this.props.setValue, 400);
      }
      this.changeValue(this.convertValue(value));
    } else {
      // If there was an error (on loss of focus) update on each keypress to resolve same.
      if (this.props.getErrorMessage() != null) {
        this.props.setValue(this.convertValue(value));
      } else {
        // Only update on valid values, so as to not generate an error until focus is lost.
        if (this.props.isValidValue(value)) {
          this.props.setValue(this.convertValue(value));
          // If it becomes invalid, and there isn't an error message, invalidate without error.
        }
      }
    }

    // Controlled component
    this.setState({
      value,
      isValid: this.props.isValidValue(value),
    });

    if (this.props.onChange) {
      this.props.onChange(event, event.target.value);
    }
  }

  handleKeyDown = (event) => {
    if (keycode(event) === 'enter') {
      this.props.setValue(this.convertValue(event.target.value));
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event, event.target.value);
    }
  }

  convertValue = (value) => {
    if (this.props.convertValue) {
      return this.props.convertValue(value);
    } else {
      return value;
    }
  }

  isRequiredError() {
    const { isRequired, isPristine, isValid, isFormSubmitted } = this.props;
    const { requiredError } = this.props;

    return isRequired() &&
           !isPristine() &&
           !isValid() &&
           isFormSubmitted() &&
           requiredError;
  }

  render() {
    const {
      defaultValue     : _defaultValue,
      convertValue     : _convertValue,
      requiredError    : _requiredError,
      updateImmediately: _updateImmediately,
      validations      : _validations,
      value            : _value,
      isFormDisabled   : isFormDisabled,
      FormHelperTextProps,
      ...rest,
    } = this.props;

    const {
      value,
      isValid,
    } = this.state;

    const helperText = this.props.getErrorMessage() || this.isRequiredError();
    const error     = (isValid === false || Boolean(this.isRequiredError()));

    const helperProps = {
      ...FormHelperTextProps,
      error,
    };
    const extraProps = filterHOCProps(rest);

    return (
      <MUITextField
        disabled={isFormDisabled()}
        {...extraProps}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        value={value}
        error={error}
        helperText={helperText}
        FormHelperTextProps={helperProps}
      />
    );
  }
}

export default HOC(FormsyText);
