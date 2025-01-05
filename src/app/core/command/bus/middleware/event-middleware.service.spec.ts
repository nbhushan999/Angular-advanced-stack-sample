import { HttpErrorResponse } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { testSuiteConfiguration } from 'libs/util/src/lib/testing';
// import { spyOnClass } from 'jasmine-es6-spies';
import { AbstractCommand } from '../../abstract-command';
import { CommandFailedEvent, CommandHandleEvent, CommandSucceededEvent } from '../../event';
import { laravelHttpResponseInterface } from '../../handler';
import { EventBusService } from '../event-bus.service';
import { EventMiddlewareService } from './event-middleware.service';

describe('EventMiddlewareService', () => {

  let eventBus: jasmine.SpyObj<EventBusService>;
  let eventMiddlewareService: EventMiddlewareService;
  let command: TestCommand;
  let subscribeSpy:any;

  class TestCommand extends AbstractCommand {
  }

  testSuiteConfiguration(() => {

    TestBed.configureTestingModule({
      providers: [
        { provide: EventBusService, useFactory: () => spyOnClass(EventBusService) },
        EventMiddlewareService,
      ],
    });

  });

  beforeAll(() => {

    eventBus = TestBed.inject(EventBusService) as typeof eventBus;
    eventMiddlewareService = TestBed.inject(EventMiddlewareService) as typeof eventMiddlewareService;

    command = new TestCommand();

  });

  beforeEach(() => {

    subscribeSpy = jasmine.createSpy('subscribeSpy');

  });

  describe('execute', () => {

    it('should emit handle event', () => {

      eventMiddlewareService
        .execute(command, Promise.resolve(<laravelHttpResponseInterface>{ message: 'data'}));

      expect(eventBus.emit).toHaveBeenCalledWith(new CommandHandleEvent(command));

    });

    it('should emit success event when promise succeeded', fakeAsync(() => {

      eventMiddlewareService
        .execute(command, Promise.resolve(<laravelHttpResponseInterface>{ message: 'data'}))
        .then(subscribeSpy);

      tick();

      expect(subscribeSpy).toHaveBeenCalledWith(<laravelHttpResponseInterface>{ message: 'data'});
      expect(eventBus.emit).toHaveBeenCalledWith(new CommandSucceededEvent(command, <laravelHttpResponseInterface>{ message: 'data'}));

    }));

    it('should emit fail event when promise failed', fakeAsync(() => {

      const error = new HttpErrorResponse({ error: 'error'} );

      eventMiddlewareService
        .execute(command, Promise.reject(error))
        .then().catch(subscribeSpy);

      tick();

      expect(subscribeSpy).toHaveBeenCalledWith(error);
      expect(eventBus.emit).toHaveBeenCalledWith(new CommandFailedEvent(command, error));

    }));

  });

});
