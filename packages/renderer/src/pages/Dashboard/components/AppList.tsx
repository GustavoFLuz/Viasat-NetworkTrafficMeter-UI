import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useEffect, useState} from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import {AppListItem} from './AppListItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {NetworkUsageData} from '@/shared/types/NetworkUsage';
import { useNetworkData } from '@/shared/contexts';
const DrawerWidth = '25%';

const Drawer = styled(Box, {shouldForwardProp: prop => prop !== 'open'})<{
  open?: boolean;
}>(({theme, open}) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: open ? DrawerWidth : 0,
  height: '100%',
  backgroundColor: theme.palette.background.default,
}));

interface AppListProps {
  children?: React.ReactNode;
  drawerOpen: boolean;
  data: any;
}

type SortingOptions = 'Name' | 'Download' | 'Upload' | 'Total';

export const AppList: React.FC<AppListProps> = ({children, drawerOpen, data}) => {
  const [sortedData, setSortedData] = useState<NetworkUsageData[]>(Object.values(data));
  const [sorting, setSorting] = useState<SortingOptions>('Total');
  const [sortingDirection, setSortingDirection] = useState<1 | -1>(-1);
  const { selection: { filtered, clear: filterClear, all: filterAll }, } = useNetworkData();

  const changeSorting = (column: SortingOptions) => {
    sorting == column
      ? setSortingDirection((prev: 1 | -1) => (prev === 1 ? -1 : 1))
      : setSorting(column);
  };

  const getSortingIcon = (column: string) => {
    return sorting == column ? (
      sortingDirection === 1 ? (
        <ArrowDropUpIcon sx={{verticalAlign: 'middle'}} />
      ) : (
        <ArrowDropDownIcon sx={{verticalAlign: 'middle'}} />
      )
    ) : (
      <></>
    );
  };

  useEffect(() => {
    setSortedData(
      Object.keys(data)
        .sort((a, b) =>
          typeof data[a][sorting] === 'string'
            ? sortingDirection * data[a][sorting].localeCompare(data[b][sorting])
            : sortingDirection * (data[a][sorting] - data[b][sorting]),
        )
        .map(key => data[key]),
    );
  }, [data, sorting, sortingDirection]);

  return (
    <Box sx={{position: 'relative', height: '100%'}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          height: '100%',
          width: drawerOpen ? 'calc(100% - ' + DrawerWidth + ')' : '100%',
        }}
      >
        {children}
      </Box>
      <Drawer open={drawerOpen}>
        <TableContainer
          sx={{height: '90%', pb: 8, boxSizing: 'border-box', fontSize: 5, overflow: 'auto'}}
        >
          <Table
            sx={{width: '100%', tableLayout: 'auto'}}
            size="small"
            aria-label="a dense table"
          >
            <TableHead sx={{height: '2em'}}>
              <TableRow>
                <TableCell
                  onClick={() => filtered.length?filterClear():filterAll()}
                  align="left"
                  sx={{
                    minWidth: '15px',
                    padding: 0,
                    margin: 0,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'middle',
                  }}
                >
                  <Checkbox color="secondary" checked={!filtered.length} />
                </TableCell>
                <TableCell
                  onClick={() => changeSorting('Name')}
                  align="left"
                  sx={{
                    minWidth: '100px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'middle',
                  }}
                >
                  <span>Name</span>
                  {getSortingIcon('Name')}
                </TableCell>
                <Tooltip title="Download">
                  <TableCell
                    onClick={() => changeSorting('Download')}
                    align="right"
                    sx={{
                      width: '50px',
                      px: 1,
                      cursor: 'pointer',
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getSortingIcon('Download')}
                    <DownloadIcon fontSize="small" />
                  </TableCell>
                </Tooltip>
                <Tooltip title="Upload">
                  <TableCell
                    onClick={() => changeSorting('Upload')}
                    align="right"
                    sx={{
                      width: '50px',
                      px: 1,
                      cursor: 'pointer',
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getSortingIcon('Upload')}
                    <UploadIcon fontSize="small" />
                  </TableCell>
                </Tooltip>
                <Tooltip title="Total">
                  <TableCell
                    onClick={() => changeSorting('Total')}
                    align="right"
                    sx={{
                      width: '50px',
                      px: 1,
                      cursor: 'pointer',
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getSortingIcon('Total')}
                    <ImportExportIcon fontSize="small" />
                  </TableCell>
                </Tooltip>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row: NetworkUsageData, index: number) => (
                <AppListItem
                  key={`${row.Name}_${index}`}
                  data={row}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Drawer>
    </Box>
  );
};
