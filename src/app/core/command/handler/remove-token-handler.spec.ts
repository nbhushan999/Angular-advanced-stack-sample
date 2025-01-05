import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { testSuiteConfiguration } from '@cloud-ui/util/testing';
import { spyOnClass } from 'jasmine-es6-spies';
import { of } from 'rxjs';
import { laravelHttpClientService } from '../../client/laravel';
import { RemoveTokenCommand } from '../remove-token-command';
import { RemoveTokenHandler } from './remove-token-handler';

describe('RemoveTokenHandler', () => {

  let removeTokenHandler: RemoveTokenHandler;
  let laravelHttpClientService: jasmine.SpyObj<laravelHttpClientService>;
  let subscribeSpy;

  testSuiteConfiguration(() => {

    TestBed.configureTestingModule({
      providers: [
        { provide: laravelHttpClientService, useFactory: () => spyOnClass(laravelHttpClientService) },
        RemoveTokenHandler,
      ],
    });

    laravelHttpClientService = TestBed.inject(laravelHttpClientService) as typeof laravelHttpClientService;
    removeTokenHandler = new RemoveTokenHandler(laravelHttpClientService);
    subscribeSpy = jasmine.createSpy('subscribeSpy');

  });

  describe('handle', () => {

    it('should emit specified event', fakeAsync(() => {

      laravelHttpClientService.delete.and.returnValue(of({ message: 'Removed token.' }));

      const command = new RemoveTokenCommand('token-uuid-1');

      removeTokenHandler.handle(command).then(subscribeSpy);

      tick();

      expect(subscribeSpy).toHaveBeenCalled();
      expect(laravelHttpClientService.delete).toHaveBeenCalledWith('/account/tokens/token-uuid-1');

    }));

  });

});
