var synonyms = require("synonyms");
const moby = require('moby');
const thesaurus = require('thesaurus')
const _ = require('lodash');
const englishWords = require('an-array-of-english-words')

function concatArrays(acc, cur){
  if(!acc){
    acc = [];
  }
  if(!cur){
    cur = [];
  }
  acc = acc.concat(cur);
  return acc;
}

function termToTermWords(term) {
  let termWords = term
    .split(' ')
    .join(',')
    .split(',')
    .filter(term => {
      if (cleanupWord(term)) return true;
      return false;
    });
  termWords.forEach(term => {
    let lastChar = term.substr(-1);
    let lastTwoChars = term.substr(-2);
    let lastThreeChars = term.substr(-3);
    if ((lastTwoChars === 'es' || lastTwoChars === 'ed') && (englishWords.includes(term.substr(0, term.length - 2)))){
      termWords.push(term.substr(0, term.length - 2));
    } else if ((lastChar === 's') && (englishWords.includes(term.substr(0, term.length - 2)))) {
      termWords.push(term.substr(0, term.length - 1));
    }
    if ((lastThreeChars === 'ing') && (englishWords.includes(term.substr(0, term.length - 3)))){
      termWords.push(term.substr(0, term.length - 3));
    }
  });
  return termWords;
}

function findSimilarWords(term) {
  let termWords = termToTermWords(term);
  let result = [];
  termWords.forEach(term => {
    result = result.concat(moby.search(term));
    let arrayOfArrays = _.values(synonyms(term));
    if (!_.isEmpty(arrayOfArrays)) {
      result = result.concat(arrayOfArrays.reduce(concatArrays));
    }
    result = result.concat(thesaurus.find(term));
  });
  result = _.uniq(result.map(cleanupWord).filter(lengthLessThanCurry(9)));
  result.push(cleanupWord(term));
  return result;
}

function lengthLessThanCurry(num){
  return function lessThan(str){
    if(!str){
      return true;
    }
    return str.length < num;
  }
}

function cleanupWord(str) {
  str = str.replace(/[^a-z0-9]+/gi, "").toLowerCase().trim();
  str = str.charAt(0) /*.toUpperCase()*/ + str.substring(1);
  return str;
}

console.log(findSimilarWords('masts'));

module.exports = {
  findSimilarWords,
  cleanupWord,
  termToTermWords
}