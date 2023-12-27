import { useNetworkData } from '@/shared/contexts';
import { NetworkUsageData } from '@/shared/types/NetworkUsage';
import { NumberToByte } from '@/utils/ByteUtils';
import { TableCell, TableRow, Tooltip } from '@mui/material';

interface AppListItemProps {
  data: NetworkUsageData;
}

export const AppListItem: React.FC<AppListItemProps> = ({ data }) => {
  const {
    selection: { filter, filtered },
  } = useNetworkData();

  return (
    <TableRow
      key={data.Name}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        '&>td': {
          boxSizing: 'border-box',
          fontSize: 12,
          px: 1,
          borderColor: 'neutral.black',
          color: 'text.primary',
          opacity: !filtered.includes(data.Name) ? 1 : .4,
          border: "none"
        },
        cursor: 'pointer',
        '&:hover': {
          '&>td': {
            color: 'secondary.main',
            opacity: 1,
            borderBottom: '1px solid',
            borderColor: 'neutral.black',
          },
        },
      }}
      onClick={() => filter(data.Name)}
    >
      <TableCell sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {data.Name}
      </TableCell>
      <TableCell align="right">{NumberToByte(data.Download)}</TableCell>
      <TableCell align="right">{NumberToByte(data.Upload)}</TableCell>
      <TableCell align="right">{NumberToByte(data.Total)}</TableCell>
    </TableRow>
  );
};
