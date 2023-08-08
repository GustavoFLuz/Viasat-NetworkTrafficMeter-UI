import { NetworkUsageContext } from '@/shared/contexts';
import { TableRow, TableCell, Tooltip } from '@mui/material'
import React, { useContext } from 'react'

interface AppListItemProps {
  data: any;
}

export const AppListItem: React.FC<AppListItemProps> = ({ data }) => {
  const { selection: { select, selected } } = useContext(NetworkUsageContext)!;

  return (
    <TableRow
      key={data.pid}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        "&>td": {
          fontSize: 12,
          px: 1,
          borderColor: "neutral.black",
          color: selected === data.pid ? "secondary.main" : "text.primary",
          borderBottom: selected === data.pid ? "1px solid" : "0",
        },
        cursor: "pointer",
        "&:hover": {
          "&>td": {
            color: "secondary.main",
            borderBottom: "1px solid",
            borderColor: "neutral.black",
          }
        },

      }}
      onClick={() => select(data.pid)}
    >
      <Tooltip title="Click to visualize this process' consumption">
        <TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: 'hidden', }}>
          {data.name}
        </TableCell>
      </Tooltip>
      <TableCell align="right">{data.download}</TableCell>
      <TableCell align="right">{data.upload}</TableCell>
      <TableCell align="right">{data.total}</TableCell>
    </TableRow>
  )
}
