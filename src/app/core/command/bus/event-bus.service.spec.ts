import { TestBed } from '@angular/core/testing';
import { testSuiteConfiguration } from '@cloud-ui/util/testing';
import { Subject } from 'rxjs';
import { EventInterface } from '../../event/event.interface';
import { AbstractCommand } from '../abstract-command';
import { CommandHandleEvent } from '../event/command-handle-event';
import { EventBusService } from './event-bus.service';

describe('EventBusService', () => {

  let eventBus: EventBusService;

  class TestCommand extends AbstractCommand {
  }

  testSuiteConfiguration(() => {

    TestBed.configureTestingModule({
      providers: [
        EventBusService,
      ],
    });

    eventBus = TestBed.inject(EventBusService) as typeof eventBus;

  });

  describe('emit', () => {

    it('should emit specified event', () => {

      spyOn((eventBus.events as Subject<EventInterface>), 'next');

      const command = new TestCommand();

      const event = new CommandHandleEvent(command);
      eventBus.emit(event);

      expect((eventBus.events as Subject<EventInterface>).next).toHaveBeenCalledWith(event);

    });

  });

});
