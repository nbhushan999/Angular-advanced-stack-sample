import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { testSuiteConfiguration } from '@cloud-ui/util/testing';
import { Store } from '@ngrx/store';
import { spyOnClass } from 'jasmine-es6-spies';
import { AbstractCommand } from '../abstract-command';
import { HandlerInterface, laravelHttpResponseInterface } from '../handler/handler.interface';
import { CommandBusService } from './command-bus.service';
import { HandlerLocatorService } from './handler-locator.service';
import { EventMiddlewareService } from './middleware/event-middleware.service';
import { COMMAND_BUS_MIDDLEWARES, MiddlewareInterface } from './middleware/middleware.interface';

describe('CommandBusService', () => {

  let commandBus: CommandBusService;
  let handlerLocatorService: jasmine.SpyObj<HandlerLocatorService>;
  let middlewares: jasmine.SpyObj<MiddlewareInterface>[];
  let command: TestCommand;
  let testHandler: TestHandler;
  let subscribeSpy;

  const successPromise = Promise.resolve(<laravelHttpResponseInterface>{ message: 'command handled'});

  class TestCommand extends AbstractCommand {
  }

  class TestHandler implements HandlerInterface {
    handle() {
      return successPromise;
    }
  }

  testSuiteConfiguration(() => {

    TestBed.configureTestingModule({
      providers: [
        CommandBusService,
        { provide: HandlerLocatorService, useFactory: () => spyOnClass(HandlerLocatorService) },
        { provide: COMMAND_BUS_MIDDLEWARES, useFactory: () => spyOnClass(EventMiddlewareService), multi: true },
        { provide: Store, useFactory: () => spyOnClass(Store) },
      ],
    });

  });

  beforeAll( () => {

    commandBus = TestBed.inject(CommandBusService) as typeof commandBus;
    handlerLocatorService = TestBed.inject(HandlerLocatorService) as typeof handlerLocatorService;
    middlewares = TestBed.inject(COMMAND_BUS_MIDDLEWARES) as typeof middlewares;
    command = new TestCommand();
    testHandler = new TestHandler();
    middlewares.forEach((middleware) => {
      middleware.execute.and.callFake((argCommand, argResult) => argResult);
    });

    handlerLocatorService.getHandlerForCommand.and.callFake(() => {
      return testHandler;
    });

  });

  beforeEach( () => {

    subscribeSpy = jasmine.createSpy('subscribeSpy');

  });

  describe('handle', () => {

    it('should handle specified command', fakeAsync(() => {

      spyOn(testHandler, 'handle').and.callThrough();

      commandBus.handle(command).then(subscribeSpy);

      tick();

      expect(subscribeSpy).toHaveBeenCalledWith(<laravelHttpResponseInterface>{ message: 'command handled'});

    }));

    it('should call "execute" method on middlewares', fakeAsync(() => {

      commandBus.handle(command).then(subscribeSpy);

      tick();

      middlewares.forEach((middleware) => {
        expect(middleware.execute).toHaveBeenCalledWith(command, successPromise);
      });

    }));

  });

});
