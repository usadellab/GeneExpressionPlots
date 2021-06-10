<h1 align=center>Gene Expression Plotter</h1>

<p align=center>Visualize gene expression from standard data tables generated in data analysis pipelines</p>

<p align=center>
<a href="https://zendro-dev.gitbook.io/geneexpressionplots/">Documentation</a> --
<a href="https://usadellab.github.io/GeneExpressionPlots/">Demo</a>
</p>


## &#9733; Overview

**Gene Expression Plotter** is an experimental single page application designed to allow custom visualizations of gene expression results over a custom discrete variable.

Typical **RNA-seq** pipelines output _relatively_ large transcript abundance tables, that require the use of a programming language to shape and visualize the data as a way to better understand results.

This application provides a graphical user interface to upload, process, and plot tabular data outputs from tools like [Kallisto](https://pachterlab.github.io/kallisto/), [Sailfish](https://www.cs.cmu.edu/~ckingsf/software/sailfish/), or [Salmon](https://combine-lab.github.io/salmon/).

## &lt;/&gt; Develop

This project is being developed with [React](https://reactjs.org). An installed [Node](https://nodejs.org/) version equal to or greater than `12` is required.

### Quick Start

```sh
# clone this repository
git clone git@github.com:usadellab/GeneExpressionPlots.git

# change to the repository folder
cd GeneExpressionPlots

# install node modules
yarn install

# start the development server
yarn dev
```

### Available Commands

```sh
yarn dev                # start development server
yarn build   		        # build for production
yarn lint    		        # lint code using ESLint
yarn test-components    # run component unit tests
yarn test-integration   # run integration tests
```

### Example Data

Example files to test the application functionality can be found in the [examples](https://github.com/usadellab/GeneExpressionPlots/tree/master/examples) folder. Find more information about these files and how to use them in the [Documentation](https://zendro-dev.gitbook.io/geneexpressionplots/documentation/user-manual#examples).
