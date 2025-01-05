import { TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@app/core/testing';
import { provideMockClass, testSuiteConfiguration } from '@cloud-ui/util/testing';
import { WindowRefService } from '@cloud-ui/window-ref';
import * as fromCommand from '../';
import { laravelHttpClientService } from '../../client/laravel';
import * as fromCommandBusHandlers from '../handler';
import { HandlerLocatorService } from './handler-locator.service';

describe('HandlerLocatorService', () => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let handlerLocatorService: HandlerLocatorService;

  testSuiteConfiguration(() => {

    TestBed.configureTestingModule({
      imports: [
        CoreTestingModule,
      ],
      providers: [
        HandlerLocatorService,
        provideMockClass(() => (laravelHttpClientService)),
        provideMockClass(() => (WindowRefService)),
        ...fromCommandBusHandlers.handlers,
      ],
    });

    handlerLocatorService = TestBed.inject(HandlerLocatorService);

  });

  describe('getHandlerForCommand', () => {

    it('should return handler for `CreateTokenCommand` if it was defined', () => {

      const command = new fromCommand.CreateTokenCommand('api-token');

      const commandHandler = handlerLocatorService.getHandlerForCommand(command);

      expect(commandHandler instanceof fromCommandBusHandlers.CreateTokenHandler).toBeTruthy();

    });

    it('should return handler for `RemoveTokenCommand` if it was defined', () => {

      const command = new fromCommand.RemoveTokenCommand('token-uuid');

      const commandHandler = handlerLocatorService.getHandlerForCommand(command);

      expect(commandHandler instanceof fromCommandBusHandlers.RemoveTokenHandler).toBeTruthy();

    });

  });

});
