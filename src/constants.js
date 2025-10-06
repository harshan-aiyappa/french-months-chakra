export const MONTHS_DATA = [
  { id: 1, question: "janvier", answer: "january", pronunciation: "zhahn-vee-ay" },
  { id: 2, question: "février", answer: "february", pronunciation: "fay-vree-ay" },
  { id: 3, question: "mars", answer: "march", pronunciation: "mahrs" },
  { id: 4, question: "avril", answer: "april", pronunciation: "ah-vreel" },
  { id: 5, question: "mai", answer: "may", pronunciation: "meh" },
  { id: 6, question: "juin", answer: "june", pronunciation: "zhwan" },
  { id: 7, question: "juillet", answer: "july", pronunciation: "zhwee-eh" },
  { id: 8, question: "août", answer: "august", pronunciation: "oot" },
  { id: 9, question: "septembre", answer: "september", pronunciation: "sep-tahm-bruh" },
  { id: 10, question: "octobre", answer: "october", pronunciation: "ok-toh-bruh" },
  { id: 11, question: "novembre", answer: "november", pronunciation: "noh-vahm-bruh" },
  { id: 12, question: "décembre", answer: "december", pronunciation: "day-sahm-bruh" },
];

export const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) { matrix[i] = [i]; }
  for (let j = 0; j <= str1.length; j++) { matrix[0][j] = j; }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[str2.length][str1.length];
};