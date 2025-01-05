import { CommandInterface } from '../command.interface';
import { ResponseTypes } from '../handler';

export interface CommandBusInterface {

  handle(command: CommandInterface): Promise<ResponseTypes>;

}
