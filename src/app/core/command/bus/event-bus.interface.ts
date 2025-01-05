import { EventInterface } from '../../event/event.interface';

export interface EventBusInterface {

  emit(event: EventInterface): void;

}
