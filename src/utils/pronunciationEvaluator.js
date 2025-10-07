const evaluatePronunciation = (targetPhrase, sourcePhrase, useLevenshtein = false, languageCode) => {
  console.log("Evaluating:", { targetPhrase, sourcePhrase, useLevenshtein, languageCode });
  
  function removeParentheses(str) {
    return str?.replace(/\([^)]*\)/g, "").trim();
  }
  
  targetPhrase = removeParentheses(targetPhrase);

  const Soundex = (name) => {
    if (!name) return "0000";
    let s = [];
    let si = 1;
    let c;

    const dictionaries = {
      english: { A: "0", B: "1", C: "2", D: "3", E: "0", F: "1", G: "2", H: "", I: "0", J: "2", K: "2", L: "4", M: "5", N: "5", O: "0", P: "1", Q: "2", R: "6", S: "2", T: "3", U: "0", V: "1", W: "", X: "2", Y: "" },
      french: { A: "0", À: "0", Â: "0", B: "1", C: "2", Ç: "2", D: "3", E: "0", É: "0", È: "0", Ê: "0", Ë: "0", F: "1", G: "2", H: "", I: "0", Î: "0", Ï: "0", J: "2", K: "2", L: "4", M: "5", N: "5", O: "0", Ô: "0", P: "1", Q: "2", R: "6", S: "2", T: "3", U: "0", Û: "0", Ü: "0", V: "1", W: "", X: "2", Y: "" },
    };

    const languageCodes = {
      "en-US": "english", "en-GB": "english",
      "fr-FR": "french",
    };
    
    const mappings = dictionaries[languageCodes[languageCode]];
    if (!mappings) {
      console.error("Unsupported language code for Soundex:", languageCode);
      return "0000";
    }

    s[0] = name[0]?.toUpperCase();
    for (let i = 1; i < name.length; i++) {
      let char = name[i].toUpperCase();
      let code = mappings[char];
      
      if (code && code !== "0") {
        // Get the code of the previous character to handle duplicates
        let prevChar = name[i - 1].toUpperCase();
        let prevCode = mappings[prevChar];
        if (code !== prevCode) {
          s[si++] = code;
        }
      }
      
      if (si >= 4) break;
    }
    
    if (s.length === 0) return "0000"; // Handle empty input after processing
    
    // Fill with zeros
    while (s.length < 4) s.push("0");
    return s.slice(0, 4).join("");
  };

  const calculateSoundexDifference = (code1, code2) => {
    if (code1.length !== 4 || code2.length !== 4) return 0;
    let matchingCount = 0;
    if (code1[0] === code2[0]) {
        matchingCount++;
    }
    const sub1 = code1.substring(1).split('').sort().join('');
    const sub2 = code2.substring(1).split('').sort().join('');
    
    for (let i = 0; i < 3; i++) {
        if (sub2.includes(sub1[i])) {
            matchingCount++;
        }
    }
    return matchingCount;
  };

  const levenshteinDistance = (a, b) => {
    if (!a || !b) return (a || b).length;
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) { matrix[0][j] = j; }
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // Deletion
          matrix[i][j - 1] + 1,      // Insertion
          matrix[i - 1][j - 1] + cost // Substitution
        );
      }
    }
    return matrix[a.length][b.length];
  };

  const f1 = targetPhrase?.split(" ") || [];
  const f2 = sourcePhrase?.split(" ") || [];
  const maxLength = Math.max(f1.length, f2.length);
  let overallScore = 0;
  let highlightedWords = [];

  for (let i = 0; i < maxLength; i++) {
    const word1 = f1[i] || "";
    const word2 = f2[i] || "";
    const soundex1 = Soundex(word1);
    const soundex2 = Soundex(word2);
    const soundexDiff = calculateSoundexDifference(soundex1, soundex2);
    
    overallScore += soundexDiff;
    
    let highlightColors = { 4: "green", 3: "orange", 2: "red", 1: "red", 0: "red" };
    if (word2) {
      highlightedWords.push({
        word: word2,
        color: highlightColors[soundexDiff],
      });
    }
  }
  
  const averageSoundexScore = maxLength > 0 ? overallScore / maxLength : 0;
  let status = "";
  
  if (useLevenshtein) {
    const maxLengthPhrase = Math.max(targetPhrase.length, sourcePhrase.length);
    if (maxLengthPhrase === 0) {
        status = 'success'; // both empty
    } else {
        const distScore = 1 - levenshteinDistance(targetPhrase.toLowerCase(), sourcePhrase.toLowerCase()) / maxLengthPhrase;
        if (distScore > 0.85) status = "success";
        else if (distScore > 0.6) status = "partial";
        else status = "fail";
    }
  } else { // Soundex
    if (averageSoundexScore >= 3.8) status = "success";
    else if (averageSoundexScore >= 2.5) status = "partial";
    else status = "fail";
  }

  let userFriendlyMessage = "";
  if (status === 'success') {
    userFriendlyMessage = `Perfect! You said "${sourcePhrase}".`;
  } else if (status === 'partial') {
    userFriendlyMessage = `Good try! Let's review the pronunciation.`;
  } else { // 'fail'
    userFriendlyMessage = `Not quite. The correct answer is "${targetPhrase}".`;
  }

  return {
    status: status,
    message: userFriendlyMessage,
    highlightedPhrase: highlightedWords,
  };
};

export default evaluatePronunciation;