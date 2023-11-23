import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {DateTimePicker} from '@mui/x-date-pickers';
import {TimeSpans, useNetworkData} from '@/shared/contexts';
import moment from 'moment';
import {useState} from 'react';
import {LoadingIcon} from '@/shared/components';
const DateTimePickerStyles = {
  p: 0,
  '& .MuiInputBase-input': {py: 1},
  '& .MuiFormLabel-root': {lineHeight: '.8em', overflow: 'visible'},
};

interface TopBarProps {
  toggleDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TopBar: React.FC<TopBarProps> = ({toggleDrawer}) => {
  const {interval} = useNetworkData();
  const [customRange, setCustomRange] = useState<[number, number]>([...interval.customRange]);

  const handleChange = (event: SelectChangeEvent<number>) => {
    interval.set(event.target.value as number);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '3.6rem',
        justifyContent: 'space-between',
        gap: 3,
        backgroundColor: 'background.default',
        px: 3,
        py: 1,
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{minWidth: '180px', display: 'flex', alignItems: 'end'}}>
        <FormControl sx={{flexGrow: 1, mr: 5}}>
          <InputLabel id="history-label">Show history from</InputLabel>
          <Select
            labelId="history-label"
            id="history-select"
            label="Show history from"
            value={interval.time.id}
            onChange={handleChange}
            sx={{p: 1, height: '2.3em'}}
          >
            {TimeSpans.map(time => (
              <MenuItem
                key={time.id}
                value={time.id}
              >
                {time.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {interval.time.id === 4 && (
          <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
            <DateTimePicker
              label="FROM DATE"
              sx={DateTimePickerStyles}
              value={moment(interval.customRange[0])}
              onChange={value =>
                setCustomRange([value?.valueOf() || customRange[0], customRange[1]])
              }
            />
            <Typography sx={{fontWeight: 900}}>:</Typography>
            <DateTimePicker
              label="TO DATE"
              sx={DateTimePickerStyles}
              value={moment(interval.customRange[1])}
              onChange={value =>
                setCustomRange([customRange[0], value?.valueOf() || customRange[1]])
              }
            />
            <Button
              onClick={() => interval.setCustomRange(customRange)}
              variant="contained"
            >
              {interval.loading && <LoadingIcon size="24px" />}
              <SearchIcon sx={{visibility: !interval.loading ? 'visible' : 'hidden'}} />
            </Button>
          </Box>
        )}
      </Box>
      <Button onClick={() => toggleDrawer(prev => !prev)}>
        <FormatListBulletedIcon />
      </Button>
    </Box>
  );
};
