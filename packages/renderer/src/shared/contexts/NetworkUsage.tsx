import {NetworkUsageTypes as Types} from '@/shared/types';
import {NumberToByte} from '@/utils/ByteUtils';
import {createContext, useContext, useEffect, useState} from 'react';
import {useNotification, useSettings} from '.';
import {Alert} from '@/shared/types/Notifications';
import {NetworkRecord} from '@/shared/types/NetworkUsage';

const NetworkUsageContext = createContext<Types.NetworkUsageContext | null>(null);

interface NetworkUsageDataProps {
  children: React.ReactNode;
}

export const TimeSpans: Types.TimeSpan[] = [
  {
    id: 0,
    name: '30 seconds',
    start: () => getUnixTime(-30 * 1000),
    end: () => getUnixTime(),
    synced: true,
    custom: false,
  },
  {
    id: 1,
    name: '5 minutes',
    start: () => getUnixTime(-5 * 60 * 1000),
    end: () => getUnixTime(),
    synced: false,
    custom: false,
  },
  {
    id: 2,
    name: '1 hour',
    start: () => getUnixTime(-60 * 60 * 1000),
    end: () => getUnixTime(),
    synced: false,
    custom: false,
  },
  {
    id: 3,
    name: '1 month',
    start: () => getUnixTime(-30 * 24 * 60 * 60 * 1000),
    end: () => getUnixTime(),
    synced: false,
    custom: false,
  },
  {
    id: 4,
    name: 'Custom Range',
    start: time => (time ? time : getUnixTime()),
    end: time => (time ? time : getUnixTime()),
    synced: false,
    custom: true,
  },
];

export const NetworkUsageProvider: React.FC<NetworkUsageDataProps> = ({children}) => {
  // Data states
  const [networkUsage, setNetworkUsage] = useState<Types.NetworkUsageRecord>({});
  const [totalNotified, setTotalNotified] = useState<boolean>(false);
  const totalUsage = calculateNewTotal(networkUsage, totalNotified);

  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<Types.NetworkUsageData>(totalUsage);

  const [timeSpanMode, setTimeSpanMode] = useState<number>(0);
  const [timeSpanRange, setTimeSpanRange] = useState<[number, number]>([
    new Date().getTime() - 60 * 60 * 1000,
    new Date().getTime(),
  ]);
  const [timedNetworkUsage, setTimedNetworkUsage] = useState<Types.NetworkUsageRecord>({});

  const {
    settings: {notifications},
  } = useSettings();
  const {notify} = useNotification();

  // State operations
  //Process of adding new data to current state
  const addData = (rawData: string) => {
    const data = JSON.parse(rawData);
    let newNetworkUsage: Record<string, Types.NetworkUsageData> = {};

    const newNotificationList: Alert[] = [];
    setNetworkUsage((prev: Types.NetworkUsageRecord) => {
      newNetworkUsage = joinPreviousCurrentData(prev, data);
      if (notifications.enabled && notifications.processUsage > 0) {
        Object.values(newNetworkUsage).forEach(process => {
          if (process.Notified || process.Total < notifications.processUsage) return;
          newNotificationList.push({
            id: process.Name,
            type: 'warning',
            message: `${process.Name} reached usage of ${NumberToByte(notifications.processUsage)}`,
          });
          process.Notified = true;
        });
      }
      return newNetworkUsage;
    });

    newNotificationList.forEach(notification => {
      notify(notification);
    });
    return newNetworkUsage;
  };

  useEffect(() => {
    if (!notifications.enabled || !notifications.totalUsage) return;
    setTotalNotified(prev => {
      if (prev) return true;

      const total = Object.values(networkUsage).reduce((sum, current) => sum + current.Total, 0);
      if (total < notifications.totalUsage) return false;

      notify({
        id: 'Total',
        type: 'error',
        message: `Total consumption reached usage of ${NumberToByte(notifications.totalUsage)}`,
      });
      setTotalNotified(true);
      return true;
    });
  }, [networkUsage]);

  // Selection operations
  const selectProcess = (pid: string) => {
    setSelectedProcess(prev => (prev === pid ? null : pid));
  };

  useEffect(() => {
    if (!TimeSpans[timeSpanMode].synced) return;
    if (selectedProcess === null) return setSelectedData(totalUsage);
    if (networkUsage[selectedProcess] !== undefined)
      return setSelectedData(networkUsage[selectedProcess]);

    setSelectedProcess(null);
    setSelectedData(totalUsage);
  }, [selectedProcess, networkUsage]);

  useEffect(() => {
    if (TimeSpans[timeSpanMode].synced) return;
    const timeSpan = TimeSpans[timeSpanMode];

    window.backend
      .get_data(timeSpan.start(timeSpanRange[0]), timeSpan.end(timeSpanRange[1]))
      .then(res => {
        const totalData = calculateTotalFromQuery(
          res === null ? [] : res,
          timeSpan.end(timeSpanRange[1]) - timeSpan.start(timeSpanRange[0]),
          selectedProcess ? selectedProcess : undefined,
        );

        setSelectedData(totalData);

        const recordData = createRecordFromQuery(res === null ? [] : res);
        setTimedNetworkUsage(recordData)
      });
    return () => {};
  }, [selectedProcess, timeSpanMode, timeSpanRange]);

  return (
    <NetworkUsageContext.Provider
      value={{
        data: {
          current: TimeSpans[timeSpanMode].synced ? networkUsage : timedNetworkUsage,
          totalHistory: totalUsage,
          add: addData,
          selected: selectedData,
        },
        selection: {
          select: selectProcess,
          selected: selectedProcess,
        },
        interval: {
          set: setTimeSpanMode,
          time: TimeSpans[timeSpanMode],
          customRange: timeSpanRange,
          setCustomRange: setTimeSpanRange,
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

//Utils
function emptyRecordArray(name: string, timeSpan?: number): NetworkRecord[] {
  return Array.from({length: 30}, (_, i) =>
    emptyRecordObject(name, timeSpan ? timeSpan - i * (timeSpan / 30) : 30000 - i * 1000),
  );
}
function emptyRecordObject(name: string, timeOffSet?: number): NetworkRecord {
  return {
    Name: name,
    Upload: 0,
    Download: 0,
    Total: 0,
    Processes: {},
    Protocols: {},
    Hosts: {},
    Time: new Date().getTime() - (timeOffSet ? timeOffSet : 0),
  };
}

function formatNewRecord(newRecord: Types.SocketNetworkData): Types.NetworkRecord {
  return {...newRecord, Total: newRecord.Upload + newRecord.Download, Time: new Date().getTime()};
}

//Adding new data
function joinPreviousCurrentData(
  oldData: Types.NetworkUsageRecord,
  newData: Types.SocketNetworkRecord,
): Types.NetworkUsageRecord {
  const newNetworkUsage: Record<string, Types.NetworkUsageData> = {};
  Object.keys(newData).forEach((process_name: string) => {
    if (oldData[process_name] !== undefined)
      return (newNetworkUsage[process_name] = addNewData(
        oldData[process_name],
        newData[process_name],
      ));
    const newProcess = formatData(newData[process_name]);
    newNetworkUsage[process_name] = newProcess;
  });
  Object.keys(oldData).forEach((process_name: string) => {
    if (newNetworkUsage[process_name] !== undefined) return;
    newNetworkUsage[process_name] = addNewData(
      oldData[process_name],
      emptyRecordObject(process_name),
    );
  });
  return Object.fromEntries(
    Object.entries(newNetworkUsage).filter(([_, value]) => value.Total > 0),
  );
}

function formatData(data: Types.SocketNetworkData): Types.NetworkUsageData {
  return {
    Name: data.Name,
    Upload: data.Upload,
    Download: data.Download,
    Total: data.Upload + data.Download,
    Notified: false,
    Records: [...emptyRecordArray(data.Name), formatNewRecord(data)].slice(-30),
  };
}
function addNewData(
  oldData: Types.NetworkUsageData,
  newData: Types.SocketNetworkData,
): Types.NetworkUsageData {
  const newRecords = [...oldData.Records, formatNewRecord(newData)].slice(-30);
  return {
    Name: oldData.Name,
    Notified: oldData.Notified,
    Upload: newRecords.reduce((sum, curr) => sum + curr.Upload, 0),
    Download: newRecords.reduce((sum, curr) => sum + curr.Download, 0),
    Total: newRecords.reduce((sum, curr) => sum + curr.Total, 0),
    Records: newRecords,
  };
}

//Adding new total
function calculateNewTotal(
  currentData: Types.NetworkUsageRecord,
  notified: boolean,
): Types.NetworkUsageData {
  const newTotal = {
    Name: 'Total',
    Total: 0,
    Download: 0,
    Upload: 0,
    Notified: notified,
    Records: emptyRecordArray('Total'),
  };
  newTotal.Records = newTotal.Records.map((record: Types.NetworkRecord, index: number) => {
    return {
      ...record,
      ...Object.keys(currentData).reduce(
        (totalSum, process: string) => {
          return {
            Upload: totalSum.Upload + currentData[process].Records[index].Upload,
            Download: totalSum.Download + currentData[process].Records[index].Download,
            Total: totalSum.Total + currentData[process].Records[index].Total,
          };
        },
        {Upload: 0, Download: 0, Total: 0},
      ),
    };
  });
  newTotal.Download = newTotal.Records.reduce(
    (sum: number, curr: Types.NetworkRecord) => sum + curr.Download,
    0,
  );
  newTotal.Upload = newTotal.Records.reduce(
    (sum: number, curr: Types.NetworkRecord) => sum + curr.Upload,
    0,
  );
  newTotal.Total = newTotal.Records.reduce(
    (sum: number, curr: Types.NetworkRecord) => sum + curr.Total,
    0,
  );
  return newTotal;
}

// Calculate cummulative usage of Records
export function getCummulativeUsageOfProcess(notCummulativeData: Types.NetworkUsageData) {
  const data = structuredClone(notCummulativeData);
  data.Records = data.Records.map((record: Types.NetworkRecord, index: number) => {
    if (index === 0) return record;
    record.Download += data.Records[index - 1].Download;
    record.Upload += data.Records[index - 1].Upload;
    record.Total += data.Records[index - 1].Total;
    return record;
  });
  return data;
}

export function getUnixTime(offset: number = 0) {
  return new Date().getTime() + offset;
}

const findClosestTimeIndex = (timeArray: number[], currentTime: number) => {
  return timeArray.reduce(
    (minIndex, current, index) =>
      Math.abs(current - currentTime) < Math.abs(timeArray[minIndex] - currentTime)
        ? index
        : minIndex,
    0,
  );
};

const addRecords = (total: Types.NetworkRecord[], current: Types.SocketNetworkData) => {
  const closestTimeIndex = findClosestTimeIndex(
    total.map(el => el.Time),
    current.Update_Time!,
  );
  const newRecord = {
    Name: total[closestTimeIndex].Name,
    Time: total[closestTimeIndex].Time,
    Processes: total[closestTimeIndex].Processes,
    Hosts: total[closestTimeIndex].Hosts,
    Protocols: total[closestTimeIndex].Protocols,

    Download: total[closestTimeIndex].Download + current.Download,
    Upload: total[closestTimeIndex].Upload + current.Upload,
    Total: total[closestTimeIndex].Total + current.Download + current.Upload,
  };
  total[closestTimeIndex] = newRecord;
  return total;
};

export function calculateTotalFromQuery(
  queryResults: Types.SocketNetworkData[],
  timeSpan: number,
  filter?: string,
): Types.NetworkUsageData {
  const filteredData = filter ? queryResults.filter(el => el.Name === filter) : queryResults;

  return filteredData.reduce(
    (total, current) => ({
      Name: total.Name,
      Total: total.Total + (current.Download + current.Upload),
      Download: total.Download + current.Download,
      Upload: total.Upload + current.Upload,
      Notified: false,
      Records: addRecords(total.Records, current),
    }),
    {
      Name: filter ? filter : 'Total',
      Total: 0,
      Download: 0,
      Upload: 0,
      Notified: false,
      Records: emptyRecordArray(filter ? filter : 'Total', timeSpan),
    },
  );
}

export function createRecordFromQuery(queryResults: Types.SocketNetworkData[]) {
  const record: Types.NetworkUsageRecord = {};
  queryResults.forEach(res => {
    if (!record[res.Name]) return (record[res.Name] = formatData(res));

    return record[res.Name] = {
      Name: res.Name,
      Upload: record[res.Name].Upload + res.Upload,
      Download: record[res.Name].Download + res.Download,
      Total: record[res.Name].Total + res.Upload + res.Download,
      Notified: false,
      Records: addRecords(record[res.Name].Records, res),
    };
  });
  return record
}
