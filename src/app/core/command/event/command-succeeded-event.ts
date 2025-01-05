import { ResponseTypes } from '..';
import { CommandInterface } from '../command.interface';
import { AbstractCommandEvent } from './abstract-command-event';

export class CommandSucceededEvent extends AbstractCommandEvent {

  constructor(
    protected command: CommandInterface,
    private result: ResponseTypes,
  ) {
    super(command);
  }

  public getResult(): ResponseTypes {

    return this.result;

  }

}
