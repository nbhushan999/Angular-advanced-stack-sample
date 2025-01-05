import { EventInterface } from './event.interface';

export abstract class AbstractEvent implements EventInterface {

  public getName(): string {

    return this.constructor.name.replace('Event', '');

  }

}
