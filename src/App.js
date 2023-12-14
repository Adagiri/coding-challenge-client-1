import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Stack,
  theme,
  Input,
  Button,
  VStack,
  Checkbox,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import SelectLogic from './SelectLogic';
import {
  acceptTermsVar,
  fieldsDisabledVar,
  nameVar,
  selectedSectorVar,
  sessionIdVar,
} from './state';
import { useReactiveVar } from '@apollo/client';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { EditIcon } from '@chakra-ui/icons';

function App() {
  const toast = useToast();
  const name = useReactiveVar(nameVar);
  const acceptTerms = useReactiveVar(acceptTermsVar);
  const selectedSector = useReactiveVar(selectedSectorVar);
  const fieldsDisabled = useReactiveVar(fieldsDisabledVar);

  const [submitting, setSubmitting] = useState(false);

  const [showSaveButton, setSaveButton] = useState(true);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!selectedSector) {
      toast({
        title: 'Please choose a sector',
        status: 'error',
        duration: 3000,
        position: 'top',
      });

      return;
    }
    try {
      const sessionId = sessionStorage.getItem('sessionId');
      setSubmitting(true);

      let response = {};

      if (sessionId) {
        response = await axios.put(
          `https://coding-challenge-1.onrender.com/api/users`,
          {
            name,
            acceptTerms,
            selectedSector,
            sessionId,
          }
        );
      } else {
        response = await axios.post(
          `https://coding-challenge-1.onrender.com/api/users`,
          {
            name,
            acceptTerms,
            selectedSector,
          }
        );
      }

      nameVar('');
      acceptTermsVar(false);
      selectedSectorVar('');

      const data = response.data.user;

      setTimeout(() => {
        nameVar(data.name);
        acceptTermsVar(data.acceptTerms);
        selectedSectorVar(data.selectedSector);
        sessionStorage.setItem('sessionId', data._id);
        setSubmitting(false);
        fieldsDisabledVar(true);
        setShowEditIcon(true);
        setSaveButton(false);
        setShowEditButton(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error.message);
      setSubmitting(false);

      toast({
        title: 'Failed',
        description: 'Error occured during submission',
        status: 'error',
        duration: 3000,
        position: 'top',
      });
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="left" p={6} fontSize={17} maxW={400}>
        <HStack my={6}>
          <Text fontSize={17} textAlign={'left'}>
            Please enter your name and pick the Sectors you are currently
            involved in.
          </Text>

          {showEditIcon && (
            <IconButton
              icon={<EditIcon />}
              onClick={() => {
                setShowEditButton(true);
                setShowEditIcon(false);
                fieldsDisabledVar(false);
              }}
            />
          )}
        </HStack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={8} align={'flex-start'} maxW={350}>
            <VStack align="start">
              <Text color="lightblue" fontSize={14}>
                Name{' '}
              </Text>
              <Input
                type="text"
                size="md"
                value={name}
                onChange={e => nameVar(e.target.value)}
                isRequired
                isDisabled={fieldsDisabled}
              />
            </VStack>

            <VStack align="start">
              <Text color="lightblue" fontSize={14}>
                Sector{' '}
              </Text>
              <SelectLogic />
            </VStack>

            <Checkbox
              isChecked={acceptTerms}
              onChange={e => acceptTermsVar(!acceptTerms)}
              isRequired
              isDisabled={fieldsDisabled}
            >
              Agree to terms
            </Checkbox>

            {showSaveButton && (
              <Button
                type="submit"
                size="md"
                isLoading={submitting}
                isDisabled={submitting}
              >
                Save
              </Button>
            )}

            {showEditButton && (
              <Button
                type="submit"
                size="md"
                isLoading={submitting}
                isDisabled={submitting}
              >
                Edit
              </Button>
            )}
          </Stack>
        </form>
      </Box>
    </ChakraProvider>
  );
}

export default App;
