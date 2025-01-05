import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AbstractCommandEvent } from '@app/core/command/event/abstract-command-event';
import { CoreTestingModule, CoreTestingService } from '@app/core/testing';
import { testSuiteConfiguration } from '@cloud-ui/util/testing';
import { Subject } from 'rxjs/internal/Subject';
import { ContainerService } from '@dxp-web/shared/util/ngx-container-resolver';
import * as commands from '../commands';
import { CommandUncacheApiService } from './command-uncache-api.service';

class TestCommandEvent extends AbstractCommandEvent {}

describe('CommandUncacheApiService', () => {

  let cmdApiService: CommandUncacheApiService;
  let containerService: jasmine.SpyObj<ContainerService>;
  let coreTesting: CoreTestingService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const events$: Subject<any> = new Subject();

  testSuiteConfiguration(() => {

    TestBed.configureTestingModule({
      imports: [
        CoreTestingModule,
      ],
      providers: [
        CommandUncacheApiService,
      ],
    });
    cmdApiService = TestBed.inject(CommandUncacheApiService);
    containerService = TestBed.inject(ContainerService) as typeof containerService;
    coreTesting = TestBed.inject(CoreTestingService) as typeof coreTesting;

    spyOnProperty(containerService, 'events').and.returnValue(events$);

  });

  describe('clearCacheOnCommands', () => {

    beforeEach(() => {

      spyOn(cmdApiService, 'clearCacheForUrl');

      cmdApiService.clearCacheOnCommands();

    });

    it('should clear cache on CreateTokenCommand command', fakeAsync(() => {

      events$.next(new TestCommandEvent(new commands.CreateTokenCommand('test')));
      tick();
      expect(cmdApiService.clearCacheForUrl).toHaveBeenCalledWith('/account/tokens');

    }));

    it('should clear cache on RemoveTokenCommand command', fakeAsync(() => {

      events$.next(new TestCommandEvent(new commands.RemoveTokenCommand('token-uuid')));
      tick();
      expect(cmdApiService.clearCacheForUrl).toHaveBeenCalledWith('/account/tokens');

    }));

  });

});
