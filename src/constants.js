const tlds = [
  '.com',
  '.org',
  '.net',
  '.it',
  '.us',
  '.biz',
  '.info',
  '.jobs',
  '.mobi',
  '.name',
  '.ly',
  '.tel',
  '.kitchen',
  '.tech',
  '.estate',
  '.xyz',
  '.codes',
  '.bargains',
  '.bid',
  '.expert',
];

const registerAgents = [
  {
    label: 'NameCheap',
    value:
      'https://www.namecheap.com/domains/registration/results.aspx?domain=$DOMAIN',
  },
  {
    label: 'GoDaddy',
    value:
      'https://www.godaddy.com/domainsearch/find?domainToCheck=$DOMAIN',
  },
];

const matchTypes = [
  { value: 'Synonym', label: 'Related Words' },
  { value: 'Exact Match', label: 'Exact Match' }
];
export { tlds, registerAgents, matchTypes };
