import React, { useMemo } from 'react';
import { 
  Box, 
  Flex, 
  HStack, 
  IconButton, 
  useColorMode, 
  useColorModeValue,
  Image,
  Text,
  useBreakpointValue,
  Select,
  Button,
  SelectProps
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { GAMES } from '../types/game';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  currentGame?: string;
  onGameChange?: (game: string) => void;
}

// Create a separate component for the GameSelect to isolate hooks
const GameSelect: React.FC<{
  currentGame?: string;
  onSelect: (gameId: string) => void;
}> = ({ currentGame, onSelect }) => {
  const selectBg = useColorModeValue('gray.100', 'gray.700');
  const selectHoverBg = useColorModeValue('gray.200', 'gray.600');
  
  const selectProps: SelectProps = {
    value: currentGame,
    onChange: (e) => onSelect(e.target.value),
    size: 'sm',
    variant: 'filled',
    bg: selectBg,
    _hover: { bg: selectHoverBg },
    maxW: '200px',
    ml: 2
  };

  return (
    <Select {...selectProps}>
      {Object.entries(GAMES).map(([id, game]) => (
        <option key={id} value={id}>
          {game.name}
        </option>
      ))}
    </Select>
  );
};

export const Header: React.FC<HeaderProps> = ({ currentGame, onGameChange }) => {
  // All hooks must be called unconditionally at the top level
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const logoDisplay = useBreakpointValue({ base: 'none', md: 'block' });
  const navDisplay = useBreakpointValue({ base: 'none', md: 'block' });
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';
  
  // Memoize the navigation items to prevent unnecessary re-renders
  const navItems = useMemo(() => {
    return Object.entries(GAMES).map(([id, game]) => (
      <Button
        key={id}
        variant={currentGame === id ? 'solid' : 'ghost'}
        size="sm"
        onClick={() => onGameChange?.(id)}
        colorScheme={currentGame === id ? 'brand' : 'gray'}
      >
        {game.name}
      </Button>
    ));
  }, [currentGame, onGameChange]);
  
  const handleGameSelect = useMemo(() => (gameId: string) => {
    onGameChange?.(gameId);
    navigate(GAMES[gameId as keyof typeof GAMES].path);
  }, [navigate, onGameChange]);


  return (
    <Box 
      as="header" 
      position="sticky" 
      top="0" 
      zIndex="sticky" 
      bg={bg}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      boxShadow="sm"
    >
      <Flex 
        maxW="container.xl" 
        mx="auto" 
        px={{ base: 4, md: 6 }}
        py={3}
        justify="space-between"
        align="center"
      >
        {/* Logo */}
        <HStack spacing={4} minW="220px">
          <Box 
            as="button" 
            onClick={() => navigate('/')}
            display="flex"
            alignItems="center"
            _hover={{ opacity: 0.9, transform: 'scale(1.02)' }}
            transition="all 0.2s"
            p={2}
            borderRadius="md"
            _active={{
              transform: 'scale(0.98)',
            }}
          >
            {/* Placeholder Logo */}
            <Image
              src="https://via.placeholder.com/40/4a5568/ffffff?text=CB"
              alt="Card Base"
              boxSize="40px"
              objectFit="cover"
              borderRadius="md"
              mr={3}
              flexShrink={0}
              fallbackSrc="https://via.placeholder.com/40/4a5568/ffffff?text=CB"
            />
            <Box textAlign="left">
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                bgGradient="linear(to-r, brand.500, brand.400)"
                bgClip="text"
                lineHeight="1.1"
              >
                Card Base
              </Text>
              <Text 
                fontSize="xs" 
                color="gray.500" 
                mt={-1}
                display={logoDisplay}
              >
                カードゲームデッキビルダー
              </Text>
            </Box>
          </Box>

          {!isHomePage && onGameChange && (
            <GameSelect 
              currentGame={currentGame}
              onSelect={handleGameSelect}
            />
          )}
        </HStack>

        {/* Navigation */}
        <HStack spacing={{ base: 2, md: 4 }}>
          {!isHomePage && (
            <Box display={navDisplay}>
              <HStack spacing={1}>
                {navItems}
              </HStack>
            </Box>
          )}

          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
