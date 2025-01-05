import { UserFixtureInterface } from './interface';

export const ACCOUNT_FIXTURE: UserFixtureInterface = {
  'uuid': '550e8400-e29b-41d4-a716-446655440000',
  'name': 'jane.doe',
  'first_name': 'Jane',
  'last_name': 'Doe',
  'created_at': '2016-03-04T12:01:05-0500',
  'last_login_at': '2016-03-05T13:07:54-0500',
  'mail': 'jane.doe@test.com',
  'phone': {
    'office': '1111111111',
    'mobile': '2222222222',
  },
  'job_title': 'Developer',
  'job_function': 'Digital Marketing',
  'company': 'Acquia, Inc.',
  'country': 'USA',
  'state': 'MA',
  'timezone': 'America/New_York',
  'picture_url': 'https://accounts.acquia.com/sites/default/files/avatars/123abc?mail=jane.doe@test.com',
  'scope': 'role:authenticated-user',
  'flags': {
    'active': true,
    'tfa': true,
    'support': false,
  },
  '_links': {
    'self': {
      'href': '{baseUri}/account',
    },
    'invites': {
      'href': '{baseUri}/account/invites',
    },
    'messages': {
      'href': '{baseUri}/account/messages',
    },
    'tokens': {
      'href': '{baseUri}/account/tokens',
    },
    'parent': {
      'href': '{baseUri}',
    },
  },
};

const items: UserFixtureInterface[] = [
  {
    'uuid': '550e8400-e29b-41d4-a716-446655440000',
    'name': 'jane.doe',
    'first_name': 'Jane',
    'last_name': 'Doe',
    'created_at': '2016-03-04T12:01:05-0500',
    'last_login_at': '2016-03-04T13:07:54-0500',
    'mail': 'jane.doe@test.com',
    'phone': {
      'office': '1111111111',
      'mobile': '2222222222',
    },
    'job_title': 'Developer',
    'job_function': 'Digital Marketing',
    'company': 'Acquia, Inc.',
    'country': 'USA',
    'state': 'MA',
    'timezone': 'America/New_York',
    'picture_url': 'https://accounts.acquia.com/sites/default/files/avatars/123abc?mail=jane.doe@test.com',
    'scope': 'role:authenticated-user',
    'flags': {
      'active': true,
      'tfa': true,
      'support': false,
    },
    '_links': {
      'self': {
        'href': '{baseUri}/account',
      },
      'invites': {
        'href': '{baseUri}/account/invites',
      },
      'messages': {
        'href': '{baseUri}/account/messages',
      },
      'tokens': {
        'href': '{baseUri}/account/tokens',
      },
      'parent': {
        'href': '{baseUri}',
      },
    },
  },
  {
    'uuid': 'ec65affe-072c-4c50-9137-bd2f8568db6c',
    'name': 'john.doe',
    'first_name': 'John',
    'last_name': 'Doe',
    'created_at': '2016-03-04T12:01:05-0500',
    'last_login_at': '2016-03-04T13:07:54-0500',
    'mail': 'john.doe@test.com',
    'phone': {
      'office': '1111111111',
      'mobile': '2222222222',
    },
    'job_title': 'Developer',
    'job_function': 'Digital Marketing',
    'company': 'Acquia, Inc.',
    'country': 'USA',
    'state': 'MA',
    'timezone': 'America/New_York',
    'picture_url': 'https://accounts.acquia.com/sites/default/files/avatars/123abc?mail=jane.doe@test.com',
    'scope': 'role:authenticated-user',
    'flags': {
      'active': true,
      'tfa': true,
      'support': false,
    },
    '_links': {
      'self': {
        'href': '{baseUri}/account',
      },
      'invites': {
        'href': '{baseUri}/account/invites',
      },
      'messages': {
        'href': '{baseUri}/account/messages',
      },
      'tokens': {
        'href': '{baseUri}/account/tokens',
      },
      'parent': {
        'href': '{baseUri}',
      },
    },
  },
];

export const ACCOUNT_ITEMS_FIXTURE = {
  'total': 2,
  '_links': {},
  '_embedded': {
    'items': items,
  },
};
