---
description: A user guide to the Enrichment analysis tool
---

# Enrichment analysis

The enrichment analysis tool allows you to run an enrichment analysis on your meta-data (The info table you can upload via the data tab).

## Form

The form has several options to select.

![](../../.gitbook/assets/enrichment\_form\_with\_example.png)

#### Test enrichment for

This input is for selecting a column of your metadata table to run the enrichment test for. Directly below you choose a selector and a selector value to determine which rows of the table you want to select.

Alternatively you can pass a list of transcript identifiers to filter for by choosing the **Filter Gene Identifiers** option. Copy and paste your list of identifiers, separated by a **newline** into the text-area.

#### Test enrichment in

As the **Test enrichment for** selector you can choose one of the columns from your metadata table to test enrichment against. We offer two different types of selectors: **binary** and **multinomial.**

* binary will select rows from the table in a binary manner. A row either gets selected or not. This will lead to a single result in the enrichment test.
* multinomial will generate a list of unique selectors from your input and run multiple **binary** analyses for every unique value, for example, every distinct **PFAM**  or **Mapman bin code** entry.&#x20;

The tool will then run the enrichment analysis in the background via a web-worker.

The Add description column allow you to include to put description from your gene information table to your test entries. See enrichment card details below for an example where Mapman description was used to describe the test entries.

### Enrichment cards

In the home screen of the tool, you can get an overview of the enrichment tests you have run and the input parameters you chose. You can add perform more of these analyses by clicking on the round plus icon button in the bottom right corner. They will be included to the already list of  enrichment analyses done.

![](<../../.gitbook/assets/multiple\_enrichment\_analysis (1).png>)

You can directly download specific analyses as **TSV** (**Tab-**separated) from the UI, or delete an analysis you don't want to show anymore.&#x20;

### Enrichment details

When clicking on one of the cards you can view the details of the enrichment analysis.

![](<../../.gitbook/assets/enrichment\_form\_with\_example\_and\_background (1).png>)

You can also chose to display test entries that are significant. That is their adjusted p-Values are less or equal to 0.05. You can do this by clicking the rectangle button at the bottom right "Show significant Entries".

![](<../../.gitbook/assets/enrichment\_form\_only\_significant (1).png>)

The table will show you the resulting p-value as well as a Benjamini-Hochberg adjusted p-value for every test entry.
