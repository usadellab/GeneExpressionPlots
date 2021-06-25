declare module 'ml-distance' {
  type distFunction = (p: number[], q: number[]) => number;

  const distance: {
    additiveSymmetric: distFunction;
    avg: distFunction;
    bhattacharyya: distFunction;
    canberra: distFunction;
    chebyshev: distFunction;
    clark: distFunction;
    czekanowski: distFunction;
    dice: distFunction;
    divergence: distFunction;
    euclidean: distFunction;
    fidelity: distFunction;
    gower: distFunction;
    harmonicMean: distFunction;
    hellinger: distFunction;
    innerProduct: distFunction;
    intersection: distFunction;
    jaccard: distFunction;
    jeffreys: distFunction;
    jensenDifference: distFunction;
    jensenShannon: distFunction;
    kdivergence: distFunction;
    kulczynski: distFunction;
    kullbackLeibler: distFunction;
    kumarHassebrook: distFunction;
    kumarJohnson: distFunction;
    lorentzian: distFunction;
    manhattan: distFunction;
    matusita: distFunction;
    minkowski: distFunction;
    motyka: distFunction;
    neyman: distFunction;
    pearson: distFunction;
    probabilisticSymmetric: distFunction;
    ruzicka: distFunction;
    soergel: distFunction;
    sorensen: distFunction;
    squared: distFunction;
    squaredChord: distFunction;
    squaredEuclidean: distFunction;
    taneja: distFunction;
    tanimoto: distFunction;
    topsoe: distFunction;
    waveHedges: distFunction;
  };

  const similarity: {
    cosine: distFunction;
    czekanowski: distFunction;
    dice: distFunction;
    intersection: distFunction;
    kulczynski: distFunction;
    kumarHassebrook: distFunction;
    motyka: distFunction;
    pearson: distFunction;
    squaredChord: distFunction;
    tanimoto: distFunction;
    tree: distFunction;
  };
}
