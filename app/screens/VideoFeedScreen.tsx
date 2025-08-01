import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Video as VideoIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { H2, ScrollView, Spinner, Text, View, XStack, YStack } from 'tamagui';
import { getVideos } from '../services/api-services';

type RootStackParamList = {
    AnalysisResult: { videoId: number };
    VideoRecording: undefined;
};

type VideoFeedScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'AnalysisResult'
>;


interface Video {
    id: number;
    description: string;
    uploadTimestamp: string;
    aiAnalysisResult: 'Analyzing' | 'Complete' | 'Failed';
}

const VideoFeedScreen = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<VideoFeedScreenNavigationProp>();

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await getVideos();
            setVideos(response.data);
        } catch (error) {
            console.error('Failed to fetch videos', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchVideos();
        }, [])
    );

    return (
        <YStack flex={1} paddingTop="$8" paddingHorizontal="$4" backgroundColor="$background">
            <H2 color="$foreground">My Sparring Videos</H2>
            {loading ? (
                <Spinner size="large" color="primary" />
            ) : (
                <ScrollView>
                    {videos.length === 0 ? (
                        <Text color="$muted">You haven't uploaded any videos yet. Tap the record button to start!</Text>
                    ) : (
                        videos.map(video => (
                            <XStack
                                key={video.id}
                                padding="$4"
                                backgroundColor="$card"
                                borderRadius="$4"
                                marginBottom="$4"
                                onPress={() => video.aiAnalysisResult === 'Complete' && navigation.navigate('AnalysisResult', { videoId: video.id })}
                                cursor={video.aiAnalysisResult === 'Complete' ? 'pointer' : 'default'}
                                opacity={video.aiAnalysisResult !== 'Complete' ? 0.7 : 1}
                            >
                                <YStack>
                                    <Text fontWeight="bold" color="$foreground">{video.description}</Text>
                                    <Text fontSize="$2" color="$muted">{new Date(video.uploadTimestamp).toLocaleDateString()}</Text>
                                </YStack>
                                <View flex={1} />
                                <Text color={video.aiAnalysisResult === 'Complete' ? '$green10' : video.aiAnalysisResult === 'Analyzing' ? '$orange10' : '$red10'}>
                                    {video.aiAnalysisResult}
                                </Text>
                            </XStack>
                        ))
                    )}
                </ScrollView>
            )}
            <View position="absolute" bottom="$4" right="$4">
                <VideoIcon size={48} color="primary" onPress={() => navigation.navigate('VideoRecording')} />
            </View>
        </YStack>
    );
};

export default VideoFeedScreen;
