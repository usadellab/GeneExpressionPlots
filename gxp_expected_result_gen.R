require(parallel)
require(cluster)
require(ape)
options(mc.cores = (detectCores() -
    1))


#' Read gene expression count data downloaded from supplement of publication
#'
#' Reimer, J.J., Thiele, B., Biermann, R.T. et al. Tomato leaves under stress:
#' a comparison of stress response to mild abiotic stress between a cultivated
#' and a wild tomato species. Plant Mol Biol 107, 177–206 (2021).
#' https://doi.org/10.1007/s11103-021-01194-0
#'
#' The sheet 'S_lycopersicum_cpm_all' of the supplemental table one
#' ('./Sup_table_1_transcriptome_Reimer_et_al.xlsx') has been saved as tab
#' separated value file './Sup_table_1_transcriptome_Reimer_et_al.csv'). The
#' names of the biological replicates have been adjusted to Gene Expression
#' Plotter standards, separating group factors, x-axis factors, and replicate
#' numbers (see manual for details). Furthermore, the column 'moduleColor' was
#' removed. Both steps were executed using the following shell command:
#' cat Sup_table_1_transcriptome_Reimer_et_al.csv | \
#'   cut --complement -f2 | \
#'   sed -e '1 s/\(\S\+\)/S_lycopersicum.\1/g' \
#'       -e '1 s/S_lycopersicum\.gene_ID/gene_ID/' > \
#'   Sup_table_1_transcriptome_Reimer_et_al_no_module_color.csv
slyc.cpm <- read.table("./Sup_table_1_transcriptome_Reimer_et_al_no_module_color.csv",
    sep = "\t", header = TRUE,
    stringsAsFactors = FALSE)



#' ----------------
#' HELPER FUNCTIONS
#' ----------------

#' Build a data.frame from a z-transformed row
make.z.transf.df <- function(z.vals,
    col.names, gene.id) {
    res.df <- data.frame(gene_ID = gene.id,
        stringsAsFactors = FALSE)
    if (length(z.vals) !=
        length(col.names)) {
        stop("Unequal values and column name lengths")
    }
    for (i in 1:length(z.vals)) {
        res.df[[col.names[[i]]]] <- z.vals[[i]]
    }
    res.df
}

#' Add rownames as column:
add.gene_ID.col <- function(in.df) {
    res.df <- as.data.frame(in.df,
        stringsAsFactors = FALSE)
    res.df$gene_ID <- rownames(in.df)
    res.df
}

#' --------------------
#' END HELPER FUNCTIONS
#' --------------------


#' Z-Transformation:
count.cols <- setdiff(colnames(slyc.cpm),
    colnames(slyc.cpm)[[1]])
slyc.cpm.z.vals.df <- do.call(rbind,
    mclapply(1:nrow(slyc.cpm),
        function(i.row) {
            gene.row <- slyc.cpm[i.row,
                ]
            gene.cpm.vals <- as.numeric(unlist(gene.row[,
                count.cols]))
            gr.sd.cpm <- sd(gene.cpm.vals,
                na.rm = TRUE)
            if (gr.sd.cpm ==
                0) {
                make.z.transf.df(gene.cpm.vals,
                  count.cols,
                  gene.row$gene_ID[[1]])
            } else {
                gr.mean.cpm <- mean(gene.cpm.vals,
                  na.rm = TRUE)
                gr.z.vals <- (gene.cpm.vals -
                  gr.mean.cpm)/gr.sd.cpm
                make.z.transf.df(gr.z.vals,
                  count.cols,
                  gene.row$gene_ID[[1]])
            }
        }))
#' Save Z-Transformed table:
write.table(slyc.cpm.z.vals.df,
    "./Sup_table_1_transcriptome_Reimer_et_al_no_module_color_z_transformed.csv",
    row.names = FALSE,
    sep = "\t", quote = FALSE)


#' Do a PCA of the CPM values, comparing biological replicates:
slyc.cpm.z.trans <- t(slyc.cpm.z.vals.df[,
    count.cols])
colnames(slyc.cpm.z.trans) <- slyc.cpm$gene_ID
slyc.cpm.z.trans.pca <- prcomp(slyc.cpm.z.trans,
    center = FALSE, scale = FALSE)
#' Save results:
write.table(add.gene_ID.col(slyc.cpm.z.trans.pca$x),
    "./Sup_table_1_transcriptome_Reimer_et_al_Solyc_CPM_PCA_mtrx.tsv",
    sep = "\t", quote = FALSE)
write.table(add.gene_ID.col(summary(slyc.cpm.z.trans.pca)$importance),
    "./Sup_table_1_transcriptome_Reimer_et_al_Solyc_CPM_PCA_frac_var_per_PC.tsv",
    sep = "\t", quote = FALSE)

#' Plot for visual confirmation:
lbls <- sub("^S_lycopersicum\\.",
    "", sub("\\.\\d+",
        "", count.cols))
rainb <- rainbow(length(unique(lbls)))
clrs <- unlist(lapply(1:length(rainb),
    function(i) rep(rainb[[i]],
        3)))
fraq.var.explained <- summary(slyc.cpm.z.trans.pca)$importance
pdf("./Sup_table_1_transcriptome_Reimer_et_al_Solyc_CPM_PCA.pdf")
plot(slyc.cpm.z.trans.pca$x[,
    1], slyc.cpm.z.trans.pca$x[,
    2], type = "n", xlab = paste0("PCA1 (frac. var explnd ",
    sprintf("%.3f", fraq.var.explained[,
        "PC1"][[2]]),
    ")"), ylab = paste0("PCA2 (frac. var explnd ",
    sprintf("%.3f", fraq.var.explained[,
        "PC2"][[2]]),
    ")"))
text(slyc.cpm.z.trans.pca$x[,
    1], slyc.cpm.z.trans.pca$x[,
    2], labels = lbls,
    col = clrs, cex = 1)
dev.off()


#' Correlation between z-transformed gene expression counts:
slyc.cpm.z.trans.cor <- cor(slyc.cpm.z.vals.df[,
    count.cols])
#' Save correlation table:
slyc.cpm.z.trans.cor.df <- as.data.frame(slyc.cpm.z.trans.cor,
    stringsAsFactors = FALSE)
slyc.cpm.z.trans.cor.df$`*` <- rownames(slyc.cpm.z.trans.cor.df)
write.table(slyc.cpm.z.trans.cor.df[,
    c("*", colnames(slyc.cpm.z.trans.cor))],
    "./Sup_table_1_transcriptome_Reimer_et_al_Solyc_z_transf_correlation.txt",
    row.names = FALSE,
    sep = "\t", quote = FALSE)


#' AGNES clustering based on correlation -
#' See chapter 5 of Kaufman and Rousseeuw (1990).
slyc.cpm.z.trans.cor.dist <- 1 -
    abs(as.matrix(slyc.cpm.z.trans.cor))
slyc.cpm.z.trans.cor.dist.df <- as.data.frame(slyc.cpm.z.trans.cor.dist,
    stringsAsFactors = FALSE)
slyc.cpm.z.trans.cor.dist.df$`*` <- rownames(slyc.cpm.z.trans.cor.dist)
write.table(slyc.cpm.z.trans.cor.dist.df[,
    c("*", count.cols)],
    "./Sup_table_1_transcriptome_Reimer_et_al_Solyc_z_transf_correlation_distance.txt",
    sep = "\t", quote = FALSE,
    row.names = FALSE)
slyc.cpm.z.trans.cor.agnes <- agnes(as.dist(slyc.cpm.z.trans.cor.dist))
#' Save trees in text and newick format, plot as pdf:
slyc.cpm.z.trans.cor.agnes.tree <- as.phylo(as.hclust(as.dendrogram(slyc.cpm.z.trans.cor.agnes)))
write.tree(slyc.cpm.z.trans.cor.agnes.tree,
    "./Sup_table_1_transcriptome_Reimer_et_al_Solyc_z_transf_correlation_hierarch_cluster_tree.newick")
sink("./Sup_table_1_transcriptome_Reimer_et_al_Solyc_z_transf_correlation_hierarch_cluster_tree.txt")
str(as.dendrogram(slyc.cpm.z.trans.cor.agnes))
sink()
pdf("./Sup_table_1_transcriptome_Reimer_et_al_Solyc_z_transf_correlation_hierarch_cluster_tree.pdf")
plot(slyc.cpm.z.trans.cor.agnes.tree)
dev.off()
