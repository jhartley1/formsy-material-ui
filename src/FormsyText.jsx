import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Formsy from 'formsy-react';
import TextField from 'material-ui/TextField';
import { setMuiComponentAndMaybeFocus, debounce } from './utils';

const FormsyText = createClass({

  propTypes: {
    FormHelperTextProps: PropTypes.object,
    defaultValue       : PropTypes.any,
    name               : PropTypes.string.isRequired,
    onBlur             : PropTypes.func,
    onChange           : PropTypes.func,
    onKeyDown          : PropTypes.func,
    requiredError      : PropTypes.string,
    updateImmediately  : PropTypes.bool,
    validationError    : PropTypes.string,
    validationErrors   : PropTypes.object,
    validations        : PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    value              : PropTypes.any,
  },

  mixins: [Formsy.Mixin],

  getDefaultProps() {
    return {
      onChange : () => {},
      onKeyDown: () => {},
    };
  },

  getInitialState() {
    const value = this.controlledValue();
    return { value };
  },

  componentWillMount() {
    this.setValue(this.controlledValue());
  },

  componentWillReceiveProps(nextProps) {
    const isValueChanging = nextProps.value !== this.props.value;
    if (isValueChanging || nextProps.defaultValue !== this.props.defaultValue) {
      const value = this.controlledValue(nextProps);
      const isValid = this.isValidValue(value);

      if (isValueChanging || this.props.defaultValue === this.getValue()) {
        this.setState({ value, isValid });
        if (this.getValue() !== value) this.setValue(value);
      }
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextState._isPristine && // eslint-disable-line no-underscore-dangle
      nextState._isPristine !== this.state._isPristine) { // eslint-disable-line no-underscore-dangle
      // Calling state here is valid, as it cannot cause infinite recursion.
      const value = this.controlledValue(nextProps);
      const isValid = this.isValidValue(value);

      this.setValue(value);
      this.setState({ value, isValid });
    }
  },

  setMuiComponentAndMaybeFocus: setMuiComponentAndMaybeFocus,

  controlledValue(props = this.props) {
    return props.value || props.defaultValue || this.convertValue('');
  },

  handleBlur(event) {
    this.setValue(this.convertValue(event.target.value));

    delete this.changeValue;
    if (this.props.onBlur) this.props.onBlur(event);
  },

  handleChange(event) {
    event.persist();
    const { value } = event.target;
    const { updateImmediately } = this.props;

    // Update the value (and so display any error) after a timeout.
    if (updateImmediately) {
      if (!this.changeValue) {
        this.changeValue = debounce(this.setValue, 400);
      }
      this.changeValue(this.convertValue(value));
    } else {
      // If there was an error (on loss of focus) update on each keypress to resolve same.
      if (this.getErrorMessage() != null) {
        this.setValue(this.convertValue(value));
      } else {
        // Only update on valid values, so as to not generate an error until focus is lost.
        if (this.isValidValue(value)) {
          this.setValue(this.convertValue(value));
          // If it becomes invalid, and there isn't an error message, invalidate without error.
        }
      }
    }

    // Controlled component
    this.setState({
      value,
      isValid: this.isValidValue(value),
    });

    if (this.props.onChange) {
      this.props.onChange(event, event.target.value);
    }
  },

  handleKeyDown(event) {
    if (keycode(event) === 'enter') {
      this.setValue(this.convertValue(event.target.value));
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event, event.target.value);
    }
  },

  convertValue(value) {
    if (this.props.convertValue) {
      return this.props.convertValue(value);
    } else {
      return value;
    }
  },

  setMuiComponentAndMaybeFocus: setMuiComponentAndMaybeFocus,

  isRequiredError() {
    const { isRequired, isPristine, isValid, isFormSubmitted } = this;
    const { requiredError } = this.props;

    return isRequired() &&
           !isPristine() &&
           !isValid() &&
           isFormSubmitted() &&
           requiredError;
  },

  render() {
    const {
      defaultValue     : _defaultValue,
      convertValue     : _convertValue,
      requiredError    : _requiredError,
      updateImmediately: _updateImmediately,
      validations      : _validations,
      validationError  : _validationError,
      validationErrors : _validationErrors,
      value            : _value,
      FormHelperTextProps,
      ...rest,
    } = this.props;

    const {
      value,
      isValid,
    } = this.state;

    const errorText = this.getErrorMessage() || this.isRequiredError();
    const error     = isValid === false;

    const helperProps = {
      ...FormHelperTextProps,
      children: errorText,
      error,
    };

    return (
      <TextField
        disabled={this.isFormDisabled()}
        {...rest}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        ref={this.setMuiComponentAndMaybeFocus}
        value={value}
        error={error}
        FormHelperTextProps={helperProps}
      />
    );
  },
});

export default FormsyText;
