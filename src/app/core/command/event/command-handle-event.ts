import { CommandInterface } from '../command.interface';
import { AbstractCommandEvent } from './abstract-command-event';

export class CommandHandleEvent extends AbstractCommandEvent {

  constructor(
    protected command: CommandInterface,
  ) {
    super(command);
  }

}
