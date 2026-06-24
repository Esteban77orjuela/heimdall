import { useCallback, useEffect, useState } from 'react';
import type { Alarm } from '../../../domain/entities/alarm';
import type { IAlarmRepository } from '../../../domain/repositories/IAlarmRepository';
import { InMemoryAlarmRepository } from '../../../data/repositories/InMemoryAlarmRepository';

const defaultRepository = new InMemoryAlarmRepository();

export function useAlarms(repository: IAlarmRepository = defaultRepository) {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    repository.getAll().then((data) => {
      if (isMounted) {
        setAlarms(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [repository]);

  const toggleAlarm = useCallback(
    async (id: string) => {
      const updated = await repository.toggleActive(id);
      setAlarms(updated);
    },
    [repository],
  );

  return { alarms, isLoading, toggleAlarm };
}
