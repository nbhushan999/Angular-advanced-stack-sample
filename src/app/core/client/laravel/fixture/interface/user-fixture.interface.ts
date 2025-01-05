/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserFixtureInterface {
  uuid: string;
  name: string;
  first_name: string;
  last_name: string;
  created_at: string;
  last_login_at: string;
  mail: string;
  phone: {
    office: string | null;
    mobile: string;
  };
  job_title: string | null;
  job_function: string | null;
  company: string | null;
  country: string | null;
  state: string | null;
  timezone: string;
  picture_url: string;
  scope: string;
  flags: {
    active: boolean;
    tfa: boolean;
    support: boolean;
  };
  _links: any;
}
