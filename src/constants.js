// Each item in the array is now an "activity" in our unit.
export const UNIT_DATA = [
  { 
    id: 1, 
    type: 'SPEAKING', 
    question: "janvier", 
    answer: "january", 
    pronunciation: "zhahn-vee-ay" 
  },
  { 
    id: 2, 
    type: 'MCQ', 
    question: "What is 'juin' in English?", 
    options: ["July", "June", "January"],
    answer: "June"
  },
  { 
    id: 3, 
    type: 'SPEAKING', 
    question: "février", 
    answer: "february", 
    pronunciation: "fay-vree-ay" 
  },
  { 
    id: 4, 
    type: 'SPEAKING', 
    question: "mars", 
    answer: "march", 
    pronunciation: "mahrs" 
  },
  { 
    id: 5, 
    type: 'MCQ', 
    question: "What is 'avril' in English?", 
    options: ["April", "August", "May"],
    answer: "April"
  },
  { 
    id: 6, 
    type: 'SPEAKING', 
    question: "mai", 
    answer: "may", 
    pronunciation: "meh" 
  },
  { 
    id: 7, 
    type: 'SPEAKING', 
    question: "juin", 
    answer: "june", 
    pronunciation: "zhwa" 
  },
  { 
    id: 8, 
    type: 'MCQ', 
    question: "What is 'juillet' in English?", 
    options: ["July", "June", "January"],
    answer: "July"
  },
  { 
    id: 9, 
    type: 'SPEAKING', 
    question: "août", 
    answer: "august", 
    pronunciation: "oot" 
  },
  { 
    id: 10, 
    type: 'SPEAKING', 
    question: "septembre", 
    answer: "september", 
    pronunciation: "sep-tahm-br" 
  },
  { 
    id: 11, 
    type: 'MCQ', 
    question: "What is 'octobre' in English?", 
    options: ["October", "November", "August"],
    answer: "October"
  },
  { 
    id: 12, 
    type: 'SPEAKING', 
    question: "novembre", 
    answer: "november", 
    pronunciation: "noh-vahm-br" 
  },
  { 
    id: 13, 
    type: 'SPEAKING', 
    question: "décembre", 
    answer: "december", 
    pronunciation: "day-sahm-br" 
  }
];
;

// Levenshtein distance function for similarity check
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