import { CommandInterface } from './command.interface';

export abstract class AbstractCommand implements CommandInterface {

  public getName(): string {

    return this.constructor.name;

  }

  public toString(): string {

    return this.getName();

  }

}
