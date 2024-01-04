export type NetworkUsageContext = {
  data: {
    processes: NetworkUsageRecord;
    filteredTotal: NetworkUsageData;
    add: (rawData: string) => SocketNetworkData[];
    synced: boolean
  };
  selection: {
    filter: (pid: string) => void;
    filtered: string[];
    clear: ()=>void;
    all: ()=>void;
  };
  interval: {
    set: (id: number) => void;
    time: TimeSpan;
    customRange: [number, number];
    setCustomRange: (range: [number, number]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
  };
};

export type NetworkUsageRecord = Record<string, NetworkUsageData>;

export type NetworkUsageData = {
  Name: string;
  Download: number;
  Upload: number;
  Total: number;
  Records: NetworkRecord[];
  Hosts: HostList;
  Protocols: ProtocolList;
  Processes: ProcessList;
};

export type NetworkRecord = {
  Name: string;
  Upload: number;
  Download: number;
  Total: number;
  Processes: ProcessList;
  Protocols: ProtocolList;
  Hosts: HostList;
  Time: number;
};

export type ProcessList = Record<
  string,
  {
    Pid: number;
    Create_Time?: number;
    Update_Time?: number;
    Upload: number;
    Download: number;
  }
>;

export type ProtocolList = Record<
  string,
  {
    Protocol_Name: string;
    Upload: number;
    Download: number;
  }
>;
export type HostList = Record<
  string,
  {
    Host_Name: string;
    Upload: number;
    Download: number;
  }
>;

export type SocketNetworkData = {
  Name: string;
  Download: number;
  Upload: number;
  Processes: ProcessList;
  Protocols: ProtocolList;
  Hosts: HostList;
  Update_Time?: number;
};

export type DataSettings = {
  sorting?: 'total' | 'download' | 'upload';
  sortingDirection?: 'asc' | 'desc';
};

export type TimeSpan = {
  id: number;
  name: string;
  start: (time?: number) => number;
  end: (time?: number) => number;
  synced: boolean;
  custom: boolean;
};
