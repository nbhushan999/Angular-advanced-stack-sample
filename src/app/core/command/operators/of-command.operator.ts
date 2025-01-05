import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommandEventInterface } from '../event/command.event.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ofCommand = (commandTypes: any[] | any, eventType?: string) => (source: Observable<CommandEventInterface>) => {

  return source.pipe(
    filter((event: CommandEventInterface) => {

      if (!Array.isArray(commandTypes)) {
        commandTypes = [commandTypes];
      }

      const isEventOfCommand = commandTypes.some((commandType) => event.getCommand && event.getCommand() instanceof commandType);

      const isEventOfType = !eventType || event.getName().toLowerCase().includes(eventType);

      return isEventOfCommand && isEventOfType;

    },
    ),
  );

};
