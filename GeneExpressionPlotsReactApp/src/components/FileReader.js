import PapaParse from 'papaparse'
import React from 'react';
import HeaderCheckbox from './HeaderCheckbox'
import DelimiterTextField from './DelimiterTextField'
import SelectColumn from './SelectColumn'
import FreeTextField from './FreeTextField';
import GeneCounts from '../GeneCounts'
import GeneCountsDb from '../GeneCountsDb'
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';


const styles = theme => ({
  paper: {
    margin: theme.spacing(2),
  },
})

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
    const { classes } = this.props;
    return (
      <div>
        <h2>Import CSV File!</h2>
        <input
          className="csv-input"
          type="file"
          ref={ input => this.filesInput = input }
          name="file"
          placeholder={null}
          onChange={this.handleInputFile}
        />
        <HeaderCheckbox handleHeader = {this.handleHeader} />
        
        {/* <Grid justify="center" direction="row" container> */}
          
          <Grid justify="center" alignItems="center" direction="column" maxWidth="sm" container spacing={3}>

            <Grid item xs={5}>
              <DelimiterTextField
                handleTextField = { (e) => this.handleTextField(e, "delimiter") }
              />
            </Grid>

            <Grid item xs={5}>
              <SelectColumn
                label = "Gene Accession Column"
                handleTextField = { (e) => this.handleTextField(e, "accessionCol") }
              />
            </Grid>

            <Grid item xs={5}>
              <SelectColumn
                label = "Gene Count Column"
                handleTextField = { (e) => this.handleTextField(e, "countCol") }
              />
            </Grid>

          </Grid>

          <Grid justify="center" alignItems="center" direction="column" maxWidth="sm" container spacing={3}>

            <Grid item xs={5}>

              <FreeTextField
                label = "Condition"
                handleTextField = { (e) => this.handleTextField(e, "condition") }
              />
            </Grid>

            <Grid item xs={5}>
              <SelectColumn
                label = "Replicate Number"
                handleTextField = { (e) => this.handleTextField(e, "replicateNo") }
              />
            </Grid>

            <Grid item xs={5}>
              <FreeTextField
                label = "Count Unit"
                handleTextField = { (e) => this.handleTextField(e, "countUnit") }
              />
            </Grid>

          </Grid>

        {/* </Grid> */}
                
        <button onClick={this.importCSV}> Upload now!</button>
        <button onClick={this.resetGenecounts}>nuke my files</button>
      </div>
    );
  }
}

export default FileReader;