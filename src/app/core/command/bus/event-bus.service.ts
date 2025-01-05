import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EventInterface } from '../../event/event.interface';
import { EventBusInterface } from './event-bus.interface';

@Injectable()
export class EventBusService implements EventBusInterface {

  public readonly events: Observable<EventInterface> = new Subject<EventInterface>();

  constructor() {}

  public emit(event: EventInterface): void {

    (this.events as Subject<EventInterface>).next(event);

  }

}
