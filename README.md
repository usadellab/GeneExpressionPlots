# Branch `prepare_test_data`

This branch contains the documentation and scripts used to prepare the data used in the [unit tests](https://en.wikipedia.org/wiki/Unit_testing) of the source code of "Gene Expression Plotter".

## Scientific source data

We used gene expression data from two tomato species _Solanum lycopersicum_ and _Solanum pennellii_ from the following publication 

> Reimer, J.J., Thiele, B., Biermann, R.T. et al. Tomato leaves under stress: a comparison of stress response to mild abiotic stress between a cultivated and a wild tomato species. Plant Mol Biol 107, 177–206 (2021). https://doi.org/10.1007/s11103-021-01194-0

## Preparation of the count data for Gene Expression Plotter

The procedure is documented in the script `./gxp_expected_result_gen.R`, quote:

> The sheet 'S_lycopersicum_cpm_all' of the supplemental table one
> ('./Sup_table_1_transcriptome_Reimer_et_al.xlsx') has been saved as tab
> separated value file './Sup_table_1_transcriptome_Reimer_et_al.csv'). The
> names of the biological replicates have been adjusted to Gene Expression
> Plotter standards, separating group factors, x-axis factors, and replicate
> numbers (see manual for details). Furthermore, the column 'moduleColor' was
> removed. Both steps were executed using the following shell command:

```sh
cat Sup_table_1_transcriptome_Reimer_et_al.csv | \
  cut --complement -f2 | \
  sed -e '1 s/\(\S\+\)/S_lycopersicum.\1/g' \
      -e '1 s/S_lycopersicum\.gene_ID/gene_ID/' > \
  Sup_table_1_transcriptome_Reimer_et_al_no_module_color.csv
```

## Generation of the expected data for the unit tests

We applied standard methods used widely in the scientific community to carry out the various analyses implemented in Gene Expression Plotter. The methods applied and whose results were used as expected outcome for the unit tests are:

* Z-Transformation
* Principal Component Analysis
* Correlation Matrix construction
* Hierarchical clustering using "AGNES"
* Over-representation analysis using Fischer's exact test

All of the above were carried out on the gene expression data downloaded from the above publication. 

### Z-Transformation

See script `./gxp_expected_result_gen.R` for details. Z-Transformation was carried out in R transforming gene expression count values by first subtracting the mean expression and then by dividing with the standard deviation.

Results are stored in file `./Sup_table_1_transcriptome_Reimer_et_al_no_module_color_z_transformed.csv`

### Principal Component Analysis

A standard PCA was carried out on Z-Transformed gene expression count values (see previous section). The PCA was done with the standard R function `prcomp` (see script `./gxp_expected_result_gen.R` for details).

The resulting principal component vectors are stored in `./Sup_table_1_transcriptome_Reimer_et_al_Solyc_CPM_PCA_mtrx.tsv` and the respective fractions of the total variance explained by the respective PCs is stored in `./Sup_table_1_transcriptome_Reimer_et_al_Solyc_CPM_PCA_frac_var_per_PC.tsv`.
