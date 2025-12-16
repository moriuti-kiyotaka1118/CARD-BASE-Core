import { Box, Flex, Button, IconButton, HStack } from '@chakra-ui/react';
import { ArrowBackIcon, AddIcon, SearchIcon, ViewIcon, HamburgerIcon } from '@chakra-ui/icons';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const CommonHeader = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Box as="header" borderBottomWidth="1px" borderColor="gray.200" bg="white" px={4} py={2} boxShadow="sm">
      <Flex maxW="1200px" mx="auto" alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          {!isHome && (
            <IconButton
              as={RouterLink}
              to="/"
              aria-label="ホームに戻る"
              icon={<ArrowBackIcon />}
              variant="ghost"
              size="sm"
              mr={2}
            />
          )}
          <Box as={RouterLink} to="/" display="flex" alignItems="center">
            <Box
              as="span"
              bg="blue.500"
              color="white"
              w="40px"
              h="40px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
              mr={2}
              fontWeight="bold"
            >
              CB
            </Box>
            <Box fontWeight="bold" fontSize="xl" color="blue.500">
              Card Base
            </Box>
          </Box>
        </Flex>
        <HStack spacing={2}>
          <Button
            as={RouterLink}
            to="/"
            variant="ghost"
            size="sm"
            leftIcon={<ViewIcon />}
          >
            ホーム
          </Button>
          <Button
            as={RouterLink}
            to="/select-title"
            variant="ghost"
            size="sm"
            leftIcon={<AddIcon />}
          >
            デッキを作成
          </Button>
          <Button
            as={RouterLink}
            to="/search"
            variant="ghost"
            size="sm"
            leftIcon={<SearchIcon />}
          >
            カードを検索
          </Button>
          <Button
            as={RouterLink}
            to="/my-decks"
            variant="ghost"
            size="sm"
            leftIcon={<ViewIcon />}
          >
            デッキを探す
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default CommonHeader;
