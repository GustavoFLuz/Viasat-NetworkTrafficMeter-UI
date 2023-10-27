import {FormControl, Select, SelectChangeEvent, MenuItem} from '@mui/material';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Interface} from '../../../../types';

type InterfaceSelectProps = {
  selected?: Interface | undefined;
  setSelected: Dispatch<SetStateAction<Interface | undefined>>
};

export const InterfaceSelect: React.FC<InterfaceSelectProps> = ({selected, setSelected}) => {
  const [interfaceOptions, setInterfaceOptions] = useState<Interface[]>([]);

  useEffect(() => {
    window.backend.get_interfaces().then(interfaces => {
      setInterfaceOptions(interfaces);
    });
  }, []);

  const handleSelect = (value: number) => {
    const found = interfaceOptions.find(el => el.Index === value);
    setSelected(found ? found : undefined);
  };
  return (
    <FormControl>
      <Select
        value={selected && interfaceOptions.length ? selected.Index : -1}
        sx={{width: '100%'}}
        onChange={(e: SelectChangeEvent<number>) => handleSelect(e.target.value as number)}
        displayEmpty
        inputProps={{'aria-label': 'Without label'}}
      >
        <MenuItem
          value={-1}
          disabled
        >
          Select an interface
        </MenuItem>
        {interfaceOptions.map(interfaceOption => (
          <MenuItem
            key={interfaceOption.Description}
            value={interfaceOption.Index}
          >
            {interfaceOption.Description}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
