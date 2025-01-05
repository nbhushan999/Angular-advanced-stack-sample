import { AccountTokensUuidFixtureInterface } from './interface/account-tokens-uuid-fixture.interface';

const items: AccountTokensUuidFixtureInterface[] = [
  {
    'uuid': '17feaf34-5d04-402b-9a67-15d5161d24e1',
    'flags': {
      'active': true,
    },
    'label': 'My First Token',
    'created_at': '2016-01-22T17:41:57-0500',
    'revocation': null,
    '_links': {
      'self': {
        'href': '{baseUri}/account/tokens/17feaf34-5d04-402b-9a67-15d5161d24e1',
      },
    },
  },
  {
    'uuid': '81e8965d-0af0-460d-9e46-977dfcc38c29',
    'flags': {
      'active': true,
    },
    'label': 'My Second Token',
    'created_at': '2016-01-22T17:55:15-0500',
    'revocation': null,
    '_links': {
      'self': {
        'href': '{baseUri}/account/tokens/81e8965d-0af0-460d-9e46-977dfcc38c29',
      },
    },
  },
];

export const ACCOUNT_TOKENS_FIXTURE = {
  'total': 2,
  '_links': {
    'self': {
      'href': '{baseUri}/account/tokens',
    },
    'parent': {
      'href': '{baseUri}/account',
    },
  },
  '_embedded': {
    'items': items,
  },
};
