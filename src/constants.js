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
    'http://www.dpbolvw.net/click-5505329-13346111?url=https%3A%2F%2Fwww.namecheap.com%2Fdomains%2Fregistration%2Fresults.aspx%3Fdomain%3D$DOMAIN',
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
