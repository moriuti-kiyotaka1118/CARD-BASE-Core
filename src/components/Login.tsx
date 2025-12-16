import React, { useState } from 'react';
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, VStack, useToast } from '@chakra-ui/react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 簡単なバリデーション
    if (username && password) {
      onLogin();
    } else {
      toast({
        title: 'エラー',
        description: 'ユーザー名とパスワードを入力してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" mb={6}>
            カードデッキビルダー
          </Heading>
          <Heading as="h2" size="lg" textAlign="center" mb={8}>
            ログイン
          </Heading>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl id="username">
                <FormLabel>ユーザー名</FormLabel>
                <Input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ユーザー名を入力"
                />
              </FormControl>
              
              <FormControl id="password">
                <FormLabel>パスワード</FormLabel>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="パスワードを入力"
                />
              </FormControl>
              
              <Button 
                type="submit" 
                colorScheme="blue" 
                size="lg" 
                width="100%"
                mt={8}
              >
                ログイン
              </Button>
              
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;
