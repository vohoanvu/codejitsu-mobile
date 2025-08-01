import { useNavigation } from '@react-navigation/native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';

const VideoRecordingScreen = () => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const navigation = useNavigation();

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const startRecording = async () => {
        if (cameraRef.current) {
            setIsRecording(true);
            try {
                const video = await cameraRef.current.recordAsync();
                //@ts-ignore
                navigation.navigate('UploadForm', { videoUri: video.uri });
            } catch (error) {
                console.error("Error recording video: ", error);
                setIsRecording(false);
            }
        }
    };

    const stopRecording = () => {
        if (cameraRef.current) {
            setIsRecording(false);
            cameraRef.current.stopRecording();
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <CameraView style={{ flex: 1 }} ref={cameraRef} facing={facing}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'flex-end',
                        marginBottom: 20,
                    }}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                        <Text style={{ fontSize: 18, color: 'white' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} style={{ padding: 20, backgroundColor: isRecording ? 'red' : 'white', borderRadius: 50 }}>
                        <Text style={{ fontSize: 18, color: isRecording ? 'white' : 'black' }}>{isRecording ? 'Stop' : 'Record'}</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
};

export default VideoRecordingScreen;
