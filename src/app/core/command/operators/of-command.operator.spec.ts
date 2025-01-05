import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { EventInterface } from '../../event/event.interface';
import { AbstractCommand } from '../abstract-command';
import { CommandFailedEvent } from '../event/command-failed-event';
import { CommandHandleEvent } from '../event/command-handle-event';
import { CommandSucceededEvent } from '../event/command-succeeded-event';
import { ofCommand } from './of-command.operator';

describe('ofCommand operator', () => {

  let testCommand: TestCommand;
  let subject$: Subject<EventInterface>;
  let subscribeSpy;
  const error: HttpErrorResponse = {
    name: null,
    message: '',
    error: 'error',
    ok: false,
    headers: null,
    status: 2,
    statusText: '',
    url: '',
    type: null,
  };
  const successResult = {message: 'data'};

  class TestCommand extends AbstractCommand {
  }

  class OtherTestCommand extends AbstractCommand {
  }

  beforeAll(() => {

    testCommand = new TestCommand();
    subscribeSpy = jasmine.createSpy('subscribeSpy');

  });

  beforeEach(() => {

    subject$ = new Subject<EventInterface>();

  });

  it('should keep emitted event when it was called by specified command', () => {

    subject$.pipe(ofCommand(TestCommand))
      .subscribe(subscribeSpy);

    const event = new CommandHandleEvent(testCommand);

    subject$.next(event);

    expect(subscribeSpy).toHaveBeenCalledWith(event);

  });

  it('should keep emitted event when it was called by one of specified command', () => {

    subject$.pipe(ofCommand([TestCommand, OtherTestCommand]))
      .subscribe(subscribeSpy);

    const event = new CommandHandleEvent(testCommand);

    subject$.next(event);

    expect(subscribeSpy).toHaveBeenCalledWith(event);

  });

  it('should skip emitted event when it was not called by specified command  ', () => {

    subject$.pipe(ofCommand(TestCommand))
      .subscribe(subscribeSpy);

    const otherTestCommand = new OtherTestCommand();

    const event = new CommandHandleEvent(otherTestCommand);

    subject$.next(event);

    expect(subscribeSpy).not.toHaveBeenCalledWith(event);

  });

  it('should keep emitted any event when event is not specified', () => {

    subject$.pipe(ofCommand(TestCommand))
      .subscribe(subscribeSpy);

    const eventHandle = new CommandHandleEvent(testCommand);
    const eventSucceed = new CommandSucceededEvent(testCommand, successResult);

    subject$.next(eventHandle);
    subject$.next(eventSucceed);

    expect(subscribeSpy).toHaveBeenCalledWith(eventHandle);
    expect(subscribeSpy).toHaveBeenCalledWith(eventSucceed);

  });

  it('should keep emitted value when it is instance of specified event', () => {

    subject$.pipe(ofCommand(TestCommand, 'succeeded'))
      .subscribe(subscribeSpy);

    const event = new CommandSucceededEvent(testCommand, successResult);

    subject$.next(event);

    expect(subscribeSpy).toHaveBeenCalledWith(event);

  });

  it('should skip emitted value when it is not an instance of specified event  ', () => {

    subject$.pipe(ofCommand(TestCommand, 'succeeded'))
      .subscribe(subscribeSpy);

    const event = new CommandFailedEvent(testCommand, error);

    subject$.next(event);

    expect(subscribeSpy).not.toHaveBeenCalledWith(event);

  });

});
