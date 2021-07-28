import init from '@/utils/gsl/gsl';

// Direction:
// -1 = left, which means a - 1
// 1 = right, which means a + 1
// Returns undefined if cannot extremify any more
function extremifyMatrix(
  a: number,
  b: number,
  c: number,
  d: number,
  direction: number
): number[] | undefined {
  const extremeMatrix = [
    a + direction,
    b - direction,
    c - direction,
    d + direction,
  ];
  if (extremeMatrix.findIndex((el) => el < 0) !== -1) return undefined;
  return extremeMatrix;
}

function calcHypergeometricPMF(
  a: number,
  b: number,
  c: number,
  d: number
): Promise<number> {
  return init().then((instance: any) =>
    instance._gsl_ran_hypergeometric_pdf(a, a + b, c + d, a + c)
  );
}

// Formula: http://mathworld.wolfram.com/FishersExactTest.html
// The values are in a matrix as follows:
// a   b
// c   d
export default async function fishersExactTest(
  a: number,
  b: number,
  c: number,
  d: number
): Promise<{
  leftPValue: number;
  rightPValue: number;
  oneTailedPValue: number;
  twoTailedPValue: number;
}> {
  // Validate
  const vals = [a, b, c, d];
  if (vals.findIndex((v) => v < 0) !== -1)
    throw new Error('Negative numbers are not supported.');
  if (vals.findIndex((v) => !Number.isInteger(v)) !== -1)
    throw new Error('Only positive integers are supported.');

  // Extremify left
  let leftPValue = 0;
  let matrix: number[] | undefined = [a, b, c, d];
  do {
    const probability = await calcHypergeometricPMF(
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[3]
    );
    if (probability === 0) break;
    leftPValue += probability;
    matrix = extremifyMatrix(matrix[0], matrix[1], matrix[2], matrix[3], -1);
  } while (matrix !== undefined);

  // Extremify right
  let rightPValue = 0;
  matrix = [a, b, c, d];
  do {
    const probability = await calcHypergeometricPMF(
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[3]
    );
    if (probability === 0) break;
    rightPValue += probability;
    matrix = extremifyMatrix(matrix[0], matrix[1], matrix[2], matrix[3], 1);
  } while (matrix !== undefined);

  // Tailed
  const oneTailedPValue = Math.min(leftPValue, rightPValue);
  const twoTailedPValue = Math.min(oneTailedPValue * 2, 1);

  return {
    leftPValue,
    rightPValue,
    oneTailedPValue,
    twoTailedPValue,
  };
}
