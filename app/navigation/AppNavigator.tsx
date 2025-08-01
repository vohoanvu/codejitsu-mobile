import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

import AnalysisResultScreen from '../screens/AnalysisResultScreen';
import UploadFormScreen from '../screens/UploadFormScreen';
import VideoFeedScreen from '../screens/VideoFeedScreen';
import VideoRecordingScreen from '../screens/VideoRecordingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    const { accessToken, isLoading } = useAuth();

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {accessToken ? (
                    <>
                        <Stack.Screen name="VideoFeed" component={VideoFeedScreen} />
                        <Stack.Screen name="VideoRecording" component={VideoRecordingScreen} />
                        <Stack.Screen name="UploadForm" component={UploadFormScreen} />
                        <Stack.Screen name="AnalysisResult" component={AnalysisResultScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
