import { NetworkUsageTypes as Types } from '@/shared/types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { joinPreviousCurrentData, calculateNewTotal, formatFromQuery, addNewRecord } from "./utils"
import { TimeSpans, RECORD_ARRAY_LENGTH } from './constants';
export * from "./utils"
export * from "./constants"

const NetworkUsageContext = createContext<Types.NetworkUsageContext | null>(null);

interface NetworkUsageDataProps {
  children: React.ReactNode;
}

export const NetworkUsageProvider: React.FC<NetworkUsageDataProps> = ({ children }) => {
  const [networkUsage, setNetworkUsage] = useState<Types.NetworkUsageRecord>({});
  const [networkUsageBuffer, setNetworkUsageBuffer] = useState<Types.SocketNetworkData[]>([])
  const [sync, setSync] = useState<boolean>(true)

  const [ignoredProcesses, setIgnoredProcesses] = useState<string[]>([]);

  const [timeSpanMode, setTimeSpanMode] = useState<number>(0);
  const [timeSpanRange, setTimeSpanRange] = useState<[number, number]>([
    new Date().getTime() - 60 * 60 * 1000,
    new Date().getTime(),
  ]);
  const [queryLoading, setQueryLoading] = useState<boolean>(false);

  /**
   * Converts rawData from webSocket to NetworkUsageData and adds to a buffer
   * @param rawData String obtained from the webSocket
  **/
  const addData = useCallback((rawData: string) => {
    if (!sync || queryLoading) return networkUsageBuffer
    const data = Object.values(JSON.parse(rawData)) as Types.SocketNetworkData[];
    let newNetworkUsageBuffer: Types.SocketNetworkData[] = [];

    setNetworkUsageBuffer((prev) => {
      newNetworkUsageBuffer = [...prev, ...data];
      return newNetworkUsageBuffer;
    });

    return newNetworkUsageBuffer;
  }, [sync, queryLoading])

  // Handle request of "old data" when timeSpan is changed
  useEffect(() => {
    setQueryLoading(true)
    const timeSpan = TimeSpans[timeSpanMode];
    setSync(timeSpan.synced)
    window.backend
      .get_data(timeSpan.start(timeSpanRange[0]), timeSpan.end(timeSpanRange[1]))
      .then(res => {
        const networkData = formatFromQuery(
          res === null ? [] : res,
          timeSpan.start(timeSpanRange[0]),
          timeSpan.end(timeSpanRange[1]),
        );
        setNetworkUsage(networkData);
        setQueryLoading(false)
      });
    return () => { };
  }, [timeSpanMode, timeSpanRange]);


  // Every "UPDATES_PER_SECOND" miliseconds, a new record is added to networkUsage
  useEffect(() => {
    if (!sync) return;
    const UPDATES_PER_SECOND = Math.floor(RECORD_ARRAY_LENGTH / 30)
    const interval = setInterval(() => {
      let websocketBuffer: Types.SocketNetworkData[] = [];
      let removedKeys: string[] = []
      setNetworkUsageBuffer(prev => {
        websocketBuffer = prev;
        return []
      })
      setNetworkUsage(prev => {
        const networkDataWithNewRecord = addNewRecord(prev);
        const newNetworkData = joinPreviousCurrentData(networkDataWithNewRecord, websocketBuffer)
        Object.keys(prev).forEach(key => newNetworkData[key] === undefined ? removedKeys.push(key) : null)
        return newNetworkData
      })

      if (removedKeys.length)
        setIgnoredProcesses(prev => prev.filter(el=>!removedKeys.includes(el)))
    }, 1000 / UPDATES_PER_SECOND)

    return () => clearInterval(interval)
  }, [sync])

  /**
   * Adds a process to the ignore list
   * @param name String of the name of the process
  **/
  const ignoreProcess = (name: string) => {
    setIgnoredProcesses(prev => prev.includes(name) ? prev.filter(el => el != name) : [...prev, name]);
  };

  const totalUsage = useMemo(() => calculateNewTotal(
    networkUsage,
    ignoredProcesses,
    [TimeSpans[timeSpanMode].start(timeSpanRange[0]),
    TimeSpans[timeSpanMode].end(timeSpanRange[1])]
  ), [networkUsage, ignoredProcesses])

  return (
    <NetworkUsageContext.Provider
      value={{
        data: {
          processes: networkUsage,
          filteredTotal: totalUsage,
          add: addData,
          synced: sync
        },
        selection: {
          filter: ignoreProcess,
          filtered: ignoredProcesses,
        },
        interval: {
          set: setTimeSpanMode,
          time: TimeSpans[timeSpanMode],
          customRange: timeSpanRange,
          setCustomRange: setTimeSpanRange,
          loading: queryLoading,
          setLoading: setQueryLoading
        },
      }}
    >
      {children}
    </NetworkUsageContext.Provider>
  );
};

export const useNetworkData = () => {
  const context = useContext(NetworkUsageContext);

  if (context === null) {
    throw new Error('Network usage context is null');
  }

  return context;
};