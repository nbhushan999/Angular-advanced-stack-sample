export interface AccountTokensUuidFixtureInterface {
  uuid: string;
  flags: {
    active: boolean;
  };
  label: string;
  created_at: string;
  revocation: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _links?: any;
}
