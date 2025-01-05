import { CommandInterface } from '../command.interface';
import { CreateTokenResponseInterface } from './create-token-handler';

export interface laravelHttpResponseInterface {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _links?: any;
}

/* eslint-disable @typescript-eslint/indent */
export type ResponseTypes = laravelHttpResponseInterface
  | CreateTokenResponseInterface;

export interface HandlerInterface {

  handle(command: CommandInterface): Promise<ResponseTypes>;

}
