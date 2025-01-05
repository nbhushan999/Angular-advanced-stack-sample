import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AbstractCommand } from '../abstract-command';
import { CommandEventInterface, CommandFailedEvent, CommandSucceededEvent } from '../event';
import { ofCommandSucceededEvent } from './of-command-event.operator';

describe('ofCommandSucceededEvent', () => {

  let subject$: Subject<CommandEventInterface>;
  let subscribeSpy;

  class TestCommand extends AbstractCommand { }
  class OtherTestCommand extends AbstractCommand { }

  beforeEach(() => {

    subject$ = new Subject<CommandEventInterface>();
    subscribeSpy = jasmine.createSpy('subscribeSpy');

  });

  it('should pass CommandSucceededEvent events that contain speicified commands', () => {

    subject$.pipe(
      ofCommandSucceededEvent([TestCommand]),
    ).subscribe(subscribeSpy);

    subject$.next(new CommandSucceededEvent(new TestCommand(), { message: 'foo' }));

    expect(subscribeSpy).toHaveBeenCalled();

  });

  it('should not pass events that are not of type CommandSucceededEvent', () => {

    subject$.pipe(
      ofCommandSucceededEvent([TestCommand]),
    ).subscribe(subscribeSpy);

    subject$.next(new CommandFailedEvent(new TestCommand(), new HttpErrorResponse({})));

    expect(subscribeSpy).not.toHaveBeenCalled();

  });

  it('should not pass CommandSucceededEvent events that do not contain speicified commands', () => {

    subject$.pipe(
      ofCommandSucceededEvent([TestCommand]),
    ).subscribe(subscribeSpy);

    subject$.next(new CommandSucceededEvent(new OtherTestCommand(), { message: 'foo' }));

    expect(subscribeSpy).not.toHaveBeenCalled();

  });

});
