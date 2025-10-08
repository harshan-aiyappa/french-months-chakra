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
    const dictionaries = {
      english: { A: "0", B: "1", C: "2", D: "3", E: "0", F: "1", G: "2", H: "", I: "0", J: "2", K: "2", L: "4", M: "5", N: "5", O: "0", P: "1", Q: "2", R: "6", S: "2", T: "3", U: "0", V: "1", W: "", X: "2", Y: "" },
    };
    const languageCodes = { "en-US": "english" };
    const mappings = dictionaries[languageCodes[languageCode]];
    if (!mappings) {
      console.error("Unsupported language code for Soundex:", languageCode);
      return "0000";
    }
    if (name.length === 0) return "0000";
    s[0] = name[0].toUpperCase();
    for (let i = 1; i < name.length && si < 4; i++) {
      let code = mappings[name[i].toUpperCase()];
      if (code && code !== '0' && code !== mappings[name[i-1].toUpperCase()]) {
        s[si++] = code;
      }
    }
    while (s.length < 4) s.push("0");
    return s.join("");
  };

  const calculateSoundexDifference = (code1, code2) => {
    if (code1.length !== 4 || code2.length !== 4) return 0;
    let matchingCount = 0;
    for (let j = 0; j < 4; j++) {
      if (code1[j] === code2[j]) matchingCount++;
    }
    return matchingCount;
  };

  const levenshteinDistance = (a, b) => {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) {
      for (let j = 0; j <= b.length; j++) {
        if (i === 0) matrix[i][j] = j;
        else if (j === 0) matrix[i][j] = i;
        else {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
        }
      }
    }
    return matrix[a.length][b.length];
  };

  const f1 = targetPhrase?.split(" ") || [];
  const f2 = sourcePhrase?.split(" ") || [];
  const maxLength = Math.max(f1.length, f2.length);
  let localSoundsSame = [];
  let highlightedWords = [];
  let isSameSoundex = 0;

  for (let i = 0; i < maxLength; i++) {
    const word1 = f1[i] || "";
    const word2 = f2[i] || "";
    const SoundexValue1 = word1 ? Soundex(word1) : "0000";
    const SoundexValue2 = word2 ? Soundex(word2) : "0000";
    isSameSoundex = calculateSoundexDifference(SoundexValue1, SoundexValue2);
    
    let highlightColors = { 4: "green", 3: "orange", 2: "red", 1: "red", 0: "red" };
    if (word2) {
      highlightedWords.push({
        word: word2,
        color: highlightColors[isSameSoundex],
      });
    }
    
    let localSounds = { 4: true, 3: true, 2: false, 1: false, 0: false };
    localSoundsSame.push(localSounds[isSameSoundex]);
  }

  let status = "";

  if (useLevenshtein) {
    const distScore = 1 - levenshteinDistance(targetPhrase.toLowerCase(), sourcePhrase.toLowerCase()) / Math.max(targetPhrase.length, sourcePhrase.length || 1);
    if (distScore > 0.85) status = "success";
    else if (distScore > 0.6) status = "partial";
    else status = "fail";
  } else { // Soundex
    const allMatch = localSoundsSame.every(val => val === true);
    if (allMatch) {
      status = "success";
    } else if (localSoundsSame.some(val => val === true)) {
      status = "partial";
    } else {
      status = "fail";
    }
  }
  
  let userFriendlyMessage = "";
  if (status === 'success') { userFriendlyMessage = `Perfect! You said "${sourcePhrase}".`; } 
  else if (status === 'partial') { userFriendlyMessage = `Good try! Let's review the pronunciation.`; } 
  else { userFriendlyMessage = `Not quite. The correct answer is "${targetPhrase}".`; }

  return { status, message: userFriendlyMessage, highlightedPhrase };
};

export default evaluatePronunciation;