import { AbstractEvent } from './abstract-event';

describe('AbstractEvent', () => {

  let testEvent: AbstractEvent;

  class TestEvent extends AbstractEvent {
  }

  beforeAll(() => {

    testEvent = new TestEvent();

  });

  describe('getName', () => {

    it('should return name of event', () => {

      expect(testEvent.getName()).toBe('Test');

    });

  });

});
