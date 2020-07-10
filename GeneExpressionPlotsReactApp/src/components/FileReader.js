import PapaParse from 'papaparse'
import React from 'react';
import HeaderCheckbox from './HeaderCheckbox'
import DelimiterTextField from './DelimiterTextField'
import SelectColumn from './SelectColumn'
import FreeTextField from './FreeTextField';
import GeneCounts from '../GeneCounts'
import GeneCountsDb from '../GeneCountsDb'
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';


class FileReader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvfile: undefined,
      header: false,
      accessionCol: undefined,
      countCol: undefined,
      condition: undefined,
      replicateNo: undefined,
      countUnit: undefined,
      delimiter: "auto",
      // geneCounts: {},
      geneCountsDb: new GeneCountsDb()
    };
    // this.updateData = this.updateData.bind(this);
  }

  handleInputFile = event => {
    this.setState({
      csvfile: event.target.files[0]
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    let geneCounts = new GeneCounts({},this.state)
    PapaParse.parse(csvfile, {
      complete: () => {
        console.log("finished!: " + JSON.stringify(geneCounts));
        // this.setState(state => {
        //   return state.geneCountsDb.add(geneCounts);
        // })
        this.state.geneCountsDb.add(geneCounts);
        this.props.callback(this.state.geneCountsDb);
        // alert(`upload finished`);
        // this.props.geneCountsDb.add(geneCounts);
        // console.log("geneCounstDb: " + JSON.stringify(this.state.geneCountsDb));
        // this.props.callback()
      },
      header: this.state.header,
      skipEmptyLines: true,
      step: (row) => {
        geneCounts.geneCounts[row.data[Object.keys(row.data)[parseInt(this.state.accessionCol) - 1]]] = row.data[Object.keys(row.data)[parseInt(this.state.countCol) - 1]]
        // console.log(row.data[Object.keys(row.data)[parseInt(this.state.accessionCol) - 1]])
        // console.log(row.data[Object.keys(row.data)[parseInt(this.state.countCol) - 1]])

      }
    });


    
  };

  // updateData(result) {
  //   var data = result.data;
  //   console.log(data);
  // }

  handleHeader = event => {
    console.log(event.target.checked)
    this.setState( {header : event.target.checked})
    // this.props.callback(event.target.checked)
  }

  handleTextField = (event, stateAttr) => {
    console.log(event.target.value)
    this.setState({[stateAttr] : event.target.value})
  }

  resetGenecounts = event => {
    this.setState({geneCountsDb : new GeneCountsDb()})
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
        <div className="inputFields">
        <Grid container spacing={5}>
          <Grid item xs={6}>
          <p />
             <DelimiterTextField handleTextField = { (e) => {this.handleTextField(e, "delimiter")}} />
             <p />
             <SelectColumn label = "Gene Accession Column" handleTextField = { (e) => {this.handleTextField(e, "accessionCol")}}/>
             <p />
             <SelectColumn label = "Gene Count Column" handleTextField = { (e) => {this.handleTextField(e, "countCol")}}/>
          </Grid>

          <Grid item xs={6}>
            <p />
            <FreeTextField label = "Condition" handleTextField = { (e) => {this.handleTextField(e, "condition")}}/>
            <p />
            <SelectColumn label = "Replicate Number" handleTextField = { (e) => {this.handleTextField(e, "replicateNo")}}/>
            <p />
            <FreeTextField label = "Count Unit" handleTextField = { (e) => {this.handleTextField(e, "countUnit")}}/>
          </Grid>

        </Grid>
        </div>
        <p />
                
        <button onClick={this.importCSV}> Upload now!</button>
        <button onClick={this.resetGenecounts}>nuke my files</button>
      </div>
    );
  }
}

export default FileReader;