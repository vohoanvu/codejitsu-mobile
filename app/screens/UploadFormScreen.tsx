import { useNavigation } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';
import { useState } from 'react';
import { Button, H2, Input, Spinner, TextArea, YStack } from 'tamagui';
import { uploadVideo } from '../services/api-services';

const UploadFormScreen = ({ route }: any) => {
    const { videoUri } = route.params;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [studentIdentifier, setStudentIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();


    const handleUpload = async () => {
        setLoading(true);
        try {
            await uploadVideo(videoUri, title, description, studentIdentifier);
            //@ts-ignore
            navigation.navigate('VideoFeed');
        } catch (error) {
            console.error('Failed to upload video', error);
            // Handle error (e.g., show a toast message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <YStack flex={1} padding="$4" space="$4" backgroundColor="$background">
            <H2 color="$foreground">Upload Video</H2>
            <Video
                source={{ uri: videoUri }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                style={{ height: 200 }}
            />
            <Input placeholder="Video Title" value={title} onChangeText={setTitle} />
            <TextArea placeholder="Description (optional)" value={description} onChangeText={setDescription} />
            <Input
                placeholder="Who are you in the video? (e.g., Fighter in the blue gi)"
                value={studentIdentifier}
                onChangeText={setStudentIdentifier}
            />
            <Button onPress={handleUpload} disabled={loading} icon={loading ? <Spinner /> : undefined}>
                {loading ? 'Uploading...' : 'Upload for Analysis'}
            </Button>
            <Button variant="outlined" onPress={() => navigation.goBack()}>
                Discard and Record Again
            </Button>
        </YStack>
    );
};

export default UploadFormScreen;
