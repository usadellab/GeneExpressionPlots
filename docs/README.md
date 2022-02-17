---
description: >-
  A web application to visualize gene expression counts over a custom discrete
  variable.
---

# Gene Expression Plots

## Overview

**Gene Expression Plots** is a web application to visualize and analyze gene expression data. It consumes RNA-Seq results in the form of gene count tables and enables the user to plot and compare single gene expression over different samples, cluster samples or genes by correlation and show the result in a heatmap with an accompanying tree, carry out a principal component analysis to identify genes or samples that are alike in their expression, and find enriched features among certain (definable) sets of genes or samples.&#x20;

## Features

* [x] Visualize and compare gene expression using a number of pre-made **plots** and **charts**.
* [x] Load standard output **** tabular **data**, as produced by common **RNA-seq** processing tools, such as [**Kallisto**](https://pachterlab.github.io/kallisto/), [**Sailfish**](https://www.cs.cmu.edu/\~ckingsf/software/sailfish/), [**Salmon**](https://combine-lab.github.io/salmon/), [**Tophat**](https://ccb.jhu.edu/software/tophat/index.shtml), [**Bowtie**](http://bowtie-bio.sourceforge.net/index.shtml), and many others. Or load your own gene expression counts table you made with any **Spreadsheet** program, e.g. with **Microsoft Excel**.&#x20;
* [x] **Group** and visualize data samples by up to two **different factors**: replicates **** and groups.
* [x] **Cluster** genes or samples by **correlation**, get a likeliness measure using **principal component analysis**.
* [x] **Browse** your **gene** (transcript) **characteristics** in a luxurious searchable interactive database, including gene function annotations, short human readable descriptions, differential gene expression, and much more.
* [x] Find **enriched** gene features, like e.g. **Gene Ontology terms** among differentially expressed genes.
* [x] **Export and safe your work**: load your data, start plotting, analyzing, and export your current state to a simple file, to load it later and pick up where you left off. You can also share such export-files with colleagues and have them contribute to your work.
* [x] **Publish** your data, interactive plots, and analyses **with great ease** and **for free** on any static server, e.g. on Github. You can include a link in you article to your data, interactive plots, and correlation, PCA, and enrichment results. Include a **custom legend** with your interactive plots and make use of a **pre-written methods section** in your article.
* [x] Enjoy the tool with guaranteed data safety and **secrecy: No data is **_**ever**_** sent over the web** to any server or other device anywhere. All analyses and plotting are done on your device.

## Documentation

The user manual explains everything from loading your data, to plot gene expression, cluster samples or genes by correlation, carry out a principal component analysis, and identify enriched gene features.

{% content-ref url="documentation/user-manual/" %}
[user-manual](documentation/user-manual/)
{% endcontent-ref %}

The deployment section holds documentation on how to publish your data, plots, and analyses on a static web-server, e.g. [GitHub Pages](https://pages.github.com), for free and include a single link to it in your article.

{% content-ref url="documentation/api.md" %}
[api.md](documentation/api.md)
{% endcontent-ref %}







