import React from 'react';
import { ChakraProvider, Box, useColorModeValue } from '@chakra-ui/react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { GameLayout } from './components/GameLayout';
import { PokemonGame } from './games/pokemon/PokemonGame';
import YugiohGame from './games/yugioh/YugiohGame';
import HomePage from './pages/HomePage';
import CardSearchPage from './pages/CardSearchPage';
import ComingSoonPage from './components/ComingSoonPage';
import TitleSelectionPage from './pages/TitleSelectionPage';
import theme from './theme';
import CommonHeader from './components/CommonHeader';

// Main App component
function App() {
  const [currentGame, setCurrentGame] = React.useState('pokemon');
  const navigate = useNavigate();

  const handleGameChange = (gameId: string) => {
    setCurrentGame(gameId);
    // Navigate to the selected game's path
    if (gameId === 'pokemon') {
      navigate('/pokemon');
    } else if (gameId === 'yugioh') {
      navigate('/yugioh');
    } else if (gameId === 'duelmasters') {
      navigate('/duelmasters');
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <CommonHeader />
      <Box as="main" minH="calc(100vh - 64px)" bg={useColorModeValue('gray.50', 'gray.900')}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/select-title" element={<TitleSelectionPage />} />
          
          {/* Deck Building Routes */}
          <Route path="/decks/select-title" element={<TitleSelectionPage />} />
          
          {/* Game-specific Routes */}
          <Route path="/pokemon/*" element={
            <GameLayout>
              <PokemonGame onGameChange={handleGameChange} />
            </GameLayout>
          } />
          
          <Route path="/yugioh/*" element={
            <GameLayout>
              <YugiohGame onGameChange={handleGameChange} />
            </GameLayout>
          } />
          
          <Route path="/duelmasters/*" element={
            <ComingSoonPage 
              title="デュエル・マスターズ（準備中）"
              description="デュエル・マスターズの機能は現在準備中です。"
            />
          } />
          
          {/* Deck Builders */}
          <Route path="/pokemon/deck-builder" element={
            <GameLayout>
              <PokemonGame onGameChange={handleGameChange} />
            </GameLayout>
          } />
          
          <Route path="/yugioh/deck-builder" element={
            <GameLayout>
              <YugiohGame onGameChange={handleGameChange} />
            </GameLayout>
          } />
          
          <Route path="/duelmasters/deck-builder" element={
            <ComingSoonPage 
              title="デュエル・マスターズ デッキビルダー（準備中）"
              description="デュエル・マスターズのデッキビルダーは現在準備中です。"
            />
          } />
          
          {/* Other Pages */}
          <Route path="/search" element={
            <CardSearchPage />
          } />
          
          <Route path="/my-decks" element={
            <ComingSoonPage 
              title="マイデッキ（準備中）"
              description="マイデッキ機能は現在準備中です。"
            />
          } />
          
          <Route path="/settings" element={
            <ComingSoonPage 
              title="設定（準備中）"
              description="設定画面は現在準備中です。"
            />
          } />
          
          {/* 404 - Not Found */}
          <Route path="*" element={
            <ComingSoonPage 
              title="ページが見つかりません"
              description="お探しのページは見つかりませんでした。"
            />
          } />
        </Routes>
      </Box>
    </ChakraProvider>
  );
}

export default App;
