import React from 'react'
import createClass from 'create-react-class';
import Formsy, { withFormsy } from 'formsy-react';

class FormsyRadio extends React.Component {
  // Material-UI replaces any component inside RadioButtonGroup with RadioButton, so no need to render it here
  render() {}
}

export default withFormsy(FormsyRadio);
