import PapaParse from 'papaparse'
import React from 'react';
import HeaderCheckbox from './HeaderCheckbox'
import DelimiterTextField from './DelimiterTextField'
import SelectColumn from './SelectColumn'
import FreeTextField from './FreeTextField';
import GeneCounts from '../GeneCounts'
import { makeStyles } from '@material-ui/core/styles';


class FileReader extends React.Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined,
      header: false,
      accessionCol: undefined,
      countCol: undefined,
      condition: undefined,
      replicatNo: undefined,
      countUnit: undefined,
      delimiter: "auto"
    };
    this.updateData = this.updateData.bind(this);
  }

  handleInputFile = event => {
    this.setState({
      csvfile: event.target.files[0]
    });
  };

  importCSV = () => {
    console.log(this.state)
    const { csvfile } = this.state;
    let geneCounts = new GeneCounts({},this.state)
    PapaParse.parse(csvfile, {
      complete: () => {console.log("finished!: " + JSON.stringify(geneCounts))},
      header: this.state.header,
      skipEmptyLines: true,
      step: (row) => {
        geneCounts.geneCounts[row.data[Object.keys(row.data)[parseInt(this.state.accessionCol) - 1]]] = row.data[Object.keys(row.data)[parseInt(this.state.countCol) - 1]]
        // console.log(row.data[Object.keys(row.data)[parseInt(this.state.accessionCol) - 1]])
        // console.log(row.data[Object.keys(row.data)[parseInt(this.state.countCol) - 1]])

      }
    });


    
  };

  updateData(result) {
    var data = result.data;
    console.log(data);
  }

  handleHeader = event => {
    console.log(event.target.checked)
    this.setState( {header : event.target.checked})
  }

  handleTextField = (event, stateAttr) => {
    console.log(event.target.value)
    this.setState({[stateAttr] : event.target.value})
  }

  render() {
    return (
      <div className="App">
        <h2>Import CSV File!</h2>
        <input
          className="csv-input"
          type="file"
          ref={input => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleInputFile}
        />
        <HeaderCheckbox handleHeader = {this.handleHeader} />
        <p />
        <div className="rc">
        <DelimiterTextField handleTextField = { (e) => {this.handleTextField(e, "delimiter")}} />
        <SelectColumn label = "Gene Accession Column" handleTextField = { (e) => {this.handleTextField(e, "accessionCol")}}/>
        </div>
        {/* <DelimiterTextField handleTextField = { (e) => {this.handleTextField(e, "delimiter")}} />
        <p />
        <SelectColumn label = "Gene Accession Column" handleTextField = { (e) => {this.handleTextField(e, "accessionCol")}}/>
        <p /> */}
        <SelectColumn label = "Gene Count Column" handleTextField = { (e) => {this.handleTextField(e, "countCol")}}/>
        <p />
        <FreeTextField label = "Condition" handleTextField = { (e) => {this.handleTextField(e, "condition")}}/>
        <p />
        <SelectColumn label = "Replicate Number" handleTextField = { (e) => {this.handleTextField(e, "replicatNo")}}/>
        <p />
        <FreeTextField label = "Count Unit" handleTextField = { (e) => {this.handleTextField(e, "countUnit")}}/>
        <p />        
        <button onClick={this.importCSV}> Upload now!</button>
      </div>
    );
  }
}

export default FileReader;