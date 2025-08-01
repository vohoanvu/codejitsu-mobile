import { Chrome } from 'lucide-react-native';
import { Button, H1, Text, YStack } from 'tamagui';
import { useAuth } from '../context/AuthContext';

const WelcomeScreen = () => {
    const { signIn } = useAuth();

    return (
        <YStack flex={1} justifyContent="center" alignItems="center" space="$4">
            <H1>CodeJitsu</H1>
            <Text>Analyze your sparring with AI.</Text>
            <Button icon={<Chrome />} onPress={signIn}>
                Continue with Google
            </Button>
        </YStack>
    );
};

export default WelcomeScreen;
