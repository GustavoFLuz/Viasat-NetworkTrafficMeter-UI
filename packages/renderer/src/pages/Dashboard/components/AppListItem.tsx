import {useNetworkData} from '@/shared/contexts';
import {NetworkUsageData} from '@/shared/types/NetworkUsage';
import {NumberToByte} from '@/utils/ByteUtils';
import {TableCell, TableRow, Tooltip} from '@mui/material';

interface AppListItemProps {
  data: NetworkUsageData;
}

export const AppListItem: React.FC<AppListItemProps> = ({data}) => {
  const {
    selection: {select, selected},
  } = useNetworkData();

  return (
    <TableRow
      key={data.Name}
      sx={{
        '&:last-child td, &:last-child th': {border: 0},
        '&>td': {
          boxSizing: 'border-box',
          fontSize: 12,
          px: 1,
          borderColor: 'neutral.black',
          color: selected === data.Name ? 'secondary.main' : 'text.primary',
          borderBottom: selected === data.Name ? '1px solid' : '0',
        },
        cursor: 'pointer',
        '&:hover': {
          '&>td': {
            color: 'secondary.main',
            borderBottom: '1px solid',
            borderColor: 'neutral.black',
          },
        },
      }}
      onClick={() => select(data.Name)}
    >
      <Tooltip title="Click to visualize this process' consumption">
        <TableCell sx={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>
          {data.Name}
        </TableCell>
      </Tooltip>
      <TableCell align="right">{NumberToByte(data.Download)}</TableCell>
      <TableCell align="right">{NumberToByte(data.Upload)}</TableCell>
      <TableCell align="right">{NumberToByte(data.Total)}</TableCell>
    </TableRow>
  );
};
