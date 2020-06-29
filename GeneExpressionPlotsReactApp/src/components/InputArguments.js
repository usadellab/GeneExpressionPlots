import React from 'react';
import HeadCheckbox from './HeadCheckbox'
import DelimiterTextField from './DelimiterTextField'

class InputArguments extends React.Component {

  constructor() {
    super();
    this.state = {
      header: false,
      accessionCol: undefined,
      countCol: undefined,
      condition: undefined,
      replicatNo: undefined,
      countUnit: undefined,
      delimiter: undefined
    };

    //this.handleHeader = this.handleHeader.bind(this)
    // this.updateData = this.updateData.bind(this);
  }
  
  handleHeader = event => {
    console.log(event.target.checked)
    this.setState( {header : event.target.checked})
  }

  handleDelimiter = event => {
    console.log(event.target.value)
    this.setState( {delimiter : event.target.value})
  }
  
  render(){
    return (
      <div>
        <HeadCheckbox handleHeader = {this.handleHeader} />
        <DelimiterTextField handleDelimiter = {this.handleDelimiter} />
      </div>
    )
  }
}

export default InputArguments