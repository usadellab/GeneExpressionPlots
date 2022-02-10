---
description: >-
  Simple instructions on how to use the terminal to generate your custom
  expression count table for the Gene Expression Plotter (GXP).
---

# Generate custom expression table from quantified RNA-extracts

## Generate expression-count-table from raw output files

RNA-Seq gene expression quantification is done by several popular and well established tools like e.g. [**Kallisto**](https://pachterlab.github.io/kallisto/), [**Sailfish**](https://www.cs.cmu.edu/\~ckingsf/software/sailfish/), [**Salmon**](https://combine-lab.github.io/salmon/), [**Tophat**](https://ccb.jhu.edu/software/tophat/index.shtml), or [**Bowtie**](http://bowtie-bio.sourceforge.net/index.shtml). These consume the results of RNA sequencing and produce tabular output files for each sequenced RNA-extract. Typically, one ends up with a set of file system directories, one for each RNA-extract, each of which contains a single count table. This section shows how to use the terminal to generate from these single tables one single expression count table that you can use with GXP.&#x20;

{% hint style="info" %}
Note that such a shell environment as used in the following instructions is available for [Windows](https://docs.microsoft.com/en-us/windows/wsl/install-win10), [Mac OS](https://support.apple.com/en-lk/guide/terminal/apd5265185d-f365-44cb-8b09-71a064a42125/mac), and of course Linux.
{% endhint %}

{% hint style="info" %}
The following instructions are tailored for **Kallisto**'s quantification tables. See the [section "Adopt for other quantifiers" at the end of this page](generate-custom-expression-table-from-quantified-rna-extracts.md#adopt-for-other-quantifiers). Be ensured the changes to be made are simple and minimal.
{% endhint %}

Have a look at this example output from quantifying three RNA-extracts with Kallisto. Each extract has its own gene expression count table called `abundance.tsv`

```
./Extract1/abundance.tsv
./Extract2/abundance.tsv
./Extract3/abundance.tsv
```

To get an idea of what these `abundance.tsv` tables contain we have a look at the first ten lines of `Extract1/abundance.tsv`:

```
head -10 ./Extract1/abundance.tsv

target_id       length  eff_length      est_counts      tpm
Soltu.DM.01G000010.1    1684    1461.33 72.8903 1.43835
Soltu.DM.01G000010.3    1855    1632.33 0       0
Soltu.DM.01G000010.4    1873    1650.33 105.247 1.839
Soltu.DM.01G000010.5    1895    1672.33 1526.06 26.3143
Soltu.DM.01G000010.6    1784    1561.33 126.385 2.33424
Soltu.DM.01G000010.2    1851    1628.33 251.074 4.44635
Soltu.DM.01G000020.1    225     44.5778 30      19.4065
Soltu.DM.01G000030.1    1814    1591.33 626.771 11.3578
Soltu.DM.01G000030.2    1906    1683.33 6.12559 0.104936
```

As you can see, Kallisto generates a simple tab delimited table (text-file) with a header line and five columns. The gene expression plotter is interested in just the first column, the transcript identifier (`target_id`) and the respective expression count, you want to visualize. Here, we assume you are interested in transcripts per million (`tpm`).

We generate the tab delimited Gene Expression Plots `expression_table.txt` in a few steps:

(1) First, define an array `a` with all quantified gene expression result tables, one for each RNA-extract:

```
a=($(find . -type f -name 'abundance.tsv'))
```

(2) Next, generate the header row and temporarily save it in the text file `header_tmp.txt`:

```
echo -n "Gene-ID\t$(printf "%s\t" $a)" | sed -e 's/\t$//' > header_tmp.txt
```

(3) Next, copy the `tpm` column from each quantified gene expression result table and paste it into a single temporary `expression_table_tmp.txt` table, which still misses the header row from above:

```
echo "paste $(echo $a | sed -e 's/\(\S\+\)/<(sed -e "1d" \1 | sort | cut -f5)/g' -e 's/-f5/-f1,5/') > expression_table_tmp.txt" | bash
```

(4) Now paste the header row and table content into a single and final GXP `expression_table.txt`:

```
cat header_tmp.txt expression_table_tmp.txt > expression_table.txt && \
  rm header_tmp.txt expression_table_tmp.txt
```

(5) Finally, open the new `expression_table_tmp.txt` in any Spreadsheet editor, e.g. MS Excel, LibreOffice Calc, or Google Spreadsheet, and **edit the header row**. Here, you need to **manually replace** the **RNA-extract names** `./Extract1/abundance.tsv` **with** the **correct GXP replicate names** ([see section "From A Custom Expression Table"](https://zendro-dev.gitbook.io/geneexpressionplots/documentation/user-manual#from-a-custom-expression-table) for details on the GXP header row format). Note that correct naming influences placement on the x-axis and colors of gene expression plots (see [section "Terminology"](https://zendro-dev.gitbook.io/geneexpressionplots/documentation/user-manual#terminology) for details).

### Adopt for other quantifiers

Other quantifiers, i.e. tools that estimate gene expression in the form of counts from raw RNA-Seq `fastq` generate output tables very similar to the above Kallisto examples. You need to adjust the above `bash` instructions depending on the format of your quantifier output format. For example consider the following output format found in Salmon result tables:

```
Name    Length  EffectiveLength TPM     NumReads
AT2G07213.1     1330    1162.458        0.027311        1.000000
AT5G03780.1     1530    1362.458        3.005682        128.988402
AT5G03780.2     1517    1349.458        0.335136        14.245105
AT5G03780.3     1207    1039.458        0.115039        3.766492
AT2G43980.1     1691    1523.458        13.107974       629.000000
AT5G30490.1     1252    1084.458        6.654348        227.301742
AT5G30490.3     984     816.462 7.706337        198.184038
AT5G30490.2     1163    995.458 0.399113        12.514221
AT5G51520.1     932     764.464 0.000000        0.000000
```

As you can see to extract transcripts per million counts (`TPM`) you need to copy column four instead of column five in the above case of Kallisto. To adjust the `bash` instructions to copy different column number change the commands in above step (3) replacing `5` with `4`.

&#x20;In detail

1. `cut -f5` needs to become `cut -f4`, and
2. `sed -e 's/-f5/-f1,5/'` needs to become `sed -e 's/-f4/-f1,4/'`

resulting in:

```
echo "paste $(echo $a | sed -e 's/\(\S\+\)/<(sed -e "1d" \1 | sort | cut -f4)/g' -e 's/-f4/-f1,4/') > expression_table_tmp.txt" | bash
```

{% hint style="info" %}
Note that the above **change** of the **column number to be copied** applies also, in case you want to use e.g. **raw counts** instead of the normalized `TPM` values.
{% endhint %}

Finally, let's consider an example output count table generated by running first Bowtie or Hisat and then obtaining the count estimates with featureCounts (first two lines shown only):

```
# Program:featureCounts v1.6.4; Command:"featureCounts" "-T" "6" "-p" "-t" "exon" "-g" "gene_id" "-a" "Arabidopsis_thaliana.TAIR10.42.gtf" "-o" "counts_bowtie.txt" "tophat_out/accepted_hits.bam" 
Geneid  Chr     Start   End     Strand  Length  tophat_out/accepted_hits.bam
```

As you can see, in this case the resulting table has two header rows. We thus need to remove not one but two lines from the beginning of each file, before copy pasting the count columns into our expression count table. In order to achieve this, the commands in above step (3) needs to be adjusted as follows:

In detail, `sed -e "1d"` needs to become `sed -e "2d"`. Resulting in:

```
echo "paste $(echo $a | sed -e 's/\(\S\+\)/<(sed -e "2d" \1 | sort | cut -f5)/g' -e 's/-f5/-f1,5/') > expression_table_tmp.txt" | bash
```

