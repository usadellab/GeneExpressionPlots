import React, { Component } from 'react';

import '@/css/markdown.css';

export default class documentation extends Component {
  render() {
    return (
      <div className="flex justify-center w-full">
        <div className="markdown">
          <h1 id="gene-expression-plots">Gene Expression Plots</h1>
          <h2 id="user-manual">User manual</h2>
          <h3 id="disclaimer">Disclaimer</h3>
          <p>Note that the Application is a prototype. It is not stable, as some necessary things are missing like validations, Error-handling, etc..  </p>
          <h3 id="terminology">Terminology</h3>
          <p>Imagine you want to plot gene expression counts resulting from a heat shock experiment carried out on your model organism of choice, e.g. witch plants.</p>
          <ul>
            <li><strong>Group</strong>: represents a collection of samples for a specific experimental condition, e.g. apical meristem exposed to heat shock for ten minutes. A group has one or more samples:</li>
            <li><strong>Sample</strong>: represents a collection of replicates within a group, e.g. tissue sample obtained after zero days, three, and five days after exposure to the heat shock, respectively. A sample has one or more replicates:</li>
            <li><strong>Replicate</strong>: typical for RNA-Seq experiments is the requirement of biological replicates in order to obtain robustness of results against noise. A &#39;replicate&#39; thus is a single measurement of RNA-Seq counts from a respective tissue sample. Each replicate has a single count table as produced by the typical RNA-Seq analysis pipelines (e.g. Kallisto or Salmon).</li>
          </ul>
          <p><em>Note: All groups, samples, and replicates must have the same gene gene accession identifiers.</em></p>
          <h3 id="uploading-data">Uploading Data</h3>
          <p>Data upload is done in the <em>Data</em> Tab of the app. There are 2 different ways of uploading your data to the application.</p>
          <h4 id="from-replicate-tables">From replicate-tables</h4>
          <p>See above terminology for details on &#39;replicate tables&#39;.</p>
          <ul>
            <li>In the <em>Data</em> page, click the <em>plus</em> icon and fill out the presented form. </li>
            <li>The form represents the upload of either a single replicate file, or many replicates that belong to a specific sample within a specific group.</li>
            <li>When uploading several replicates at once, make sure the table parameters match.</li>
            <li>When uploading replicates for an existing group and sample, make sure the group and sample names match, otherwise a new group or sample will be created.</li>
            <li>Each uploaded Group will appear on the main <em>Data</em> page. Further replicate uploads to an existing group will update its <em>sample</em> and <em>replicates</em> count.</li>
            <li>Delete a group by clicking on the <em>trashbin</em> icon.</li>
          </ul>
          <p><em>Note: it is recommended to export the uploaded data, so that it can be reimported more easily in the future.</em></p>
          <h4 id="from-existing-json-source">From existing json source</h4>
          <p>This basically is picking up plotting after having saved a previous &#39;project&#39;. Load exported data and continue plotting.</p>
          <ul>
            <li>Access the menu via the right Side-Drawer (grey bar at the right of your browser window) in the <em>Data</em> page. </li>
            <li>Here you can either import previously exported data or directly export your processed data (from replicate-tables - see below) to JSON.</li>
            <li>Once the import is done, you can see your data in the respective list.</li>
          </ul>
          <h3 id="plotting">Plotting</h3>
          <h4 id="create-an-expression-plot-for-a-gene">Create an expression plot for a gene</h4>
          <ul>
            <li>Switch to the <em>Plots</em> page and open the side-drawer on the right.</li>
            <li>Choose a gene by its accessionId. You can search by typing in the input field. <em>Be aware that <em>for now</em> only the first 10 matches are displayed in the drop-down.</em></li>
            <li>Optionally select whether to show the legend using the <em>showlegend</em> checkbox.</li>
            <li>Once you hit <strong>SAVE</strong> a bar plot for the chosen gene is displayed.</li>
            <li>Hovering the mouse over a plot will show a <em>modebar</em> with various controls (e.g. export plot to a PNG file).</li>
          </ul>
          <h4 id="add-another-plot">Add another plot</h4>
          <p>You can compare gene expression by putting side by side expression bar-plots. Just repeat the process for creating a plot this time selecting the other gene identifier.</p>
          <h3 id="current-issues">Current Issues</h3>
          <ul>
            <li><strong>WARNING</strong>: Do not reload the page. Your data will be lost.</li>
            <li>For now there is no way to edit or delete data and plots. If you make a mistake in the upload form, you have to reload the page and go again.</li>
            <li>There are no validations for your input tables. Make sure they are in the correct format.</li>
            <li>Manual navigation using the URL bar is not correctly configured.</li>
          </ul>
        </div>
      </div>
    );
  }
}
