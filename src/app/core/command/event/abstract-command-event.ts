import { AbstractEvent } from '../../event/abstract-event';
import { CommandInterface } from '../command.interface';
import { CommandEventInterface } from './command.event.interface';

export abstract class AbstractCommandEvent extends AbstractEvent implements CommandEventInterface {

  constructor(protected command: CommandInterface) {
    super();
  }

  public getCommand(): CommandInterface {
    return this.command;
  }

  public getCommandName(): string {

    return this.command.getName();

  }

}
