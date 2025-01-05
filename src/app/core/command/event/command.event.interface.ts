import { EventInterface } from '../../event/event.interface';
import { CommandInterface } from '../command.interface';

export interface CommandEventInterface extends EventInterface {

  getCommand(): CommandInterface;

  getCommandName(): string;

}
