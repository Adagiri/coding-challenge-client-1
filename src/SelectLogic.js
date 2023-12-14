import { Select, IconButton, HStack, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { useState, useEffect } from 'react';

import { ArrowBackIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { useReactiveVar } from '@apollo/client';
import { fieldsDisabledVar, selectedSectorVar } from './state';

const SelectLogic = () => {
  const [sectors, setSectors] = useState([]);

  const getDefaults = (sectors) => {
    return sectors.filter((option) => option.hasParent === false);
  };

  const getChildren = (parent) => {
    return sectors.filter((option) => option.parent === parent);
  };

  const getParent = (child) => {
    const childData = sectors.find((option) => option.name === child);
    return childData.parent;
  };

  const fieldsDisabled = useReactiveVar(fieldsDisabledVar);
  const selectedSector = useReactiveVar(selectedSectorVar);
  const [options, setOptions] = useState([]);
  const [defaultOptionText, setDefaultOptionText] = useState('Choose sector');

  const getSectors = async () => {
    try {
      const response = await axios.get(
        `https://coding-challenge-1.onrender.com/api/sectors`
      );
      setSectors(response.data);
      const defaults = getDefaults(response.data);
      setOptions(defaults);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getSectors();
  }, []);

  const handleChange = (event) => {
    selectedSectorVar('');
    const value = event.target.value;

    const children = getChildren(value);
    if (children.length > 0) {
      setOptions(children);
    } else {
      selectedSectorVar(value);
    }
  };

  const handleGoBack = () => {
    selectedSectorVar('');
    const child = options[0].name;
    const parent = getParent(child);
    if (!parent) {
      setOptions(getDefaults(sectors));
      return;
    }

    const higherParent = getParent(parent);
    const higherParentChildren = getChildren(higherParent);
    setOptions(higherParentChildren);
  };

  if (options.length === 0) {
    return <Spinner size='xs' />;
  }

  return (
    <HStack spacing={2}>
      {options[0] && options[0].hasParent && (
        <IconButton
          aria-label='Go back'
          icon={<ArrowBackIcon />}
          onClick={handleGoBack}
          isDisabled={fieldsDisabled}
          colorScheme='blue'
        />
      )}

      <Select
        value={selectedSector}
        onChange={handleChange}
        width={{ base: 200, sm: 300 }}
        icon={!selectedSector && <ArrowRightIcon fontSize={10} />}
        size='md'
        cursor={'pointer'}
        isRequired
        isDisabled={fieldsDisabled}
      >
        <option style={{ cursor: 'pointer' }}>{defaultOptionText}</option>
        {options.map((option) => {
          return (
            <option
              style={{ cursor: 'pointer' }}
              value={option.name}
              key={option.value}
            >
              {option.name}
            </option>
          );
        })}
      </Select>
    </HStack>
  );
};

export default SelectLogic;
