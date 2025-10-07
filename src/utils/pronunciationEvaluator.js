// src/utils/pronunciationEvaluator.js

const evaluatePronunciation = (targetPhrase, sourcePhrase, useLevenshtein = false, languageCode) => {
  console.log(targetPhrase, sourcePhrase, useLevenshtein, languageCode, "ParamsGetting");
  
  function removeParentheses(str) {
    return str?.replace(/\([^)]*\)/g, "");
  }
  
  targetPhrase = removeParentheses(targetPhrase)?.trim();

  const Soundex = (name) => {
    if (!name) return "0000";
    let s = [];
    let si = 1;
    let c;

    // A curated, smaller set of dictionaries for the POC
    const dictionaries = {
      english: { A:"0",B:"1",C:"2",D:"3",E:"0",F:"1",G:"2",H:"",I:"0",J:"2",K:"2",L:"4",M:"5",N:"5",O:"0",P:"1",Q:"2",R:"6",S:"2",T:"3",U:"0",V:"1",W:"",X:"2",Y:"", },
      french: { A:"0",À:"0",Â:"0",B:"1",C:"2",Ç:"2",D:"3",E:"0",É:"0",È:"0",Ê:"0",Ë:"0",F:"1",G:"2",H:"",I:"0",Î:"0",Ï:"0",J:"2",K:"2",L:"4",M:"5",N:"5",O:"0",Ô:"0",P:"1",Q:"2",R:"6",S:"2",T:"3",U:"0",Û:"0",Ü:"0",V:"1",W:"",X:"2",Y:"", },
    };

    const languageCodes = {
      "en-US": "english",
      "fr-FR": "french",
    };
    
    const mappings = dictionaries[languageCodes[languageCode]];
    if (!mappings) {
      console.error("Unsupported language code for Soundex:", languageCode);
      return "0000";
    }

    s[0] = name[0]?.toUpperCase();
    for (let i = 1; i < name.length; i++) {
      let c = name.substring(i, i + 2).toUpperCase();
      if (mappings[c] && mappings[c] !== "0" && mappings[c] !== s[si - 1]) {
        s[si] = mappings[c];
        si++;
        i++;
      } else {
        c = name[i].toUpperCase();
        if (mappings[c] && mappings[c] !== "0" && mappings[c] !== s[si - 1]) {
          s[si] = mappings[c];
          si++;
        }
      }
      if (si >= 4) break;
    }
    while (si < 4) s[si++] = "0";
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
    
    let highlightColors = { 4: "green", 3: "red", 2: "orange", 1: "red", 0: "red" };
    if (word2) {
      highlightedWords.push({
        word: word2,
        targetSoundex: SoundexValue1,
        sourceSoundex: SoundexValue2,
        isSameSoundex: isSameSoundex,
        color: SoundexValue1 === "0000" ? "red" : highlightColors[isSameSoundex],
      });
    }
    
    let localSounds = { 4: true, 3: true, 2: false, 1: false, 0: false };
    localSoundsSame.push(localSounds[isSameSoundex]);
  }

  let similarityScore = "";
  let distanceScore = "";
  let status = "";
  let targetSoundexValues = f1.map((word) => Soundex(word || ""));
  let sourceSoundexValues = f2.map((word) => Soundex(word || ""));

  if (useLevenshtein) {
    const distScore = 1 - levenshteinDistance(targetPhrase.toLowerCase(), sourcePhrase.toLowerCase()) / Math.max(targetPhrase.length, sourcePhrase.length);
    const nearnessThreshold = 0.75;
    const isNear = distScore >= nearnessThreshold;
    if (distScore === 0.0) { status = "fail"; } 
    else if (localSoundsSame.includes(false)) { status = "fail"; } 
    else if (distScore <= nearnessThreshold) { status = "fail"; } 
    else if (!isNear && distScore !== 0.0) { status = "partial"; } 
    else { status = "success"; }
    distanceScore = `Levenshtein Score: ${distScore.toFixed(2)}`;
  } else {
    if (localSoundsSame.includes(false)) { status = "fail"; } 
    else if (isSameSoundex === 4) { status = "success"; } 
    else if (isSameSoundex === 3) { status = "fail"; } 
    else if (isSameSoundex === 2) { status = "partial"; } 
    else { status = "fail"; }
  }

  // Simplified messaging for the return object
  if (status === 'success') similarityScore = 'Perfect Pronunciation... Great going!!!';
  else if (status === 'partial') similarityScore = 'Good try!!! Move on or try saying again...';
  else similarityScore = 'You got the pronunciation wrong!!! Try saying again...';

  return {
    result: `You said: ${sourcePhrase}`,
    score: `Similarity: ${similarityScore}`,
    distanceScore: distanceScore,
    highlightedPhrase: highlightedWords,
    targetSoundexValues: targetSoundexValues,
    sourceSoundexValues: sourceSoundexValues,
    targetPhrase,
    sourcePhrase,
    status: status,
  };
};

export default evaluatePronunciation;