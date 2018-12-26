const db = require('./mongo')();
const { validator } = require('./validation');
var exec = require('child_process').exec;
const { findSimilarWords, cleanupWord, termToTermWords } = require('./similar-words');
var _ = require('lodash');

function handleFormErrors(socket, errors) {
  socket.data.formErrors = errors;
  socket.update('formErrors', errors);
}

function register({ username, password, retypePassword }, socket) {
  validator('register', { username, password, retypePassword }, function (errors) {
    if (errors) {
      return handleFormErrors(socket, errors);
    }
  })
}

function updateConstraints(fields, socket) {
  const nums = [0, 1, 2];
  const wordLists = [[], [], []]
  for (var i = 0; i <= 2; i += 1) {
    let term = fields[`term${i}`];
    let matchType = fields[`matchType${i}`];
    term = term.trim();
    if (matchType === 'Exact Match') {
      wordLists[i] = termToTermWords(term);
    } else {
      list = findSimilarWords(term);
      wordLists[i] = list;
    }
  }
  socket.tld = fields.tld;
  socket.wordLists = wordLists;
  updateDomains(socket);
}

const randomFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

const createDomainNameFromWordLists = function (wordLists) {
  let domain = '';
  let domainParts = [];
  if (wordLists) {
    for (var i = 0; i < wordLists.length; i++) {
      let list = wordLists[i];

      let word = randomFromArray(list);
      if (!word) {
        word = '';
      }
      domainParts.push(word);
      domain += word;
    }
  }
  return { domainParts, domain };
}

function updateDomains(socket) {
  socket.data.domains = [];
  socket.sendUpdatedData();
  for (i = 0; i < 20; i += 1) {
    let { domainParts, domain } = createDomainNameFromWordLists(socket.wordLists);
    const tld = socket.tld;
    let domainWithTLD = domain + tld;
    if (domain) {
      checkHostAvailable(domainWithTLD, function callback(isAvailable) {
        const domainObj = { domainParts, domain, domainWithTLD, isAvailable, tld };
        socket.data.domains.push(domainObj);
        socket.data.domains = _.uniqBy(socket.data.domains, (domainObj)=>domainObj.domain);
        socket.sendUpdatedData();
      });
    }
  }
}

function checkHostAvailable(domain, callback) {
  domain = domain.replace(/[^a-z0-9\.]/gi, '');
  exec(`host ${domain}`, function (error, stdout, stderr) {
    if (!domain) {
      return callback(false);
    }
    if (stdout.includes('NXDOMAIN')) {
      callback(true);
    } else {
      callback(false);
    }
  });
}


module.exports = {
  register,
  updateConstraints,
  createDomainNameFromWordLists,
  updateDomains,
}