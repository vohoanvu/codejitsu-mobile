
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getVideos = () => api.get('/api/video/getall-uploaded');

export const uploadVideo = async (uri: string, title: string, description: string, studentIdentifier: string) => {
    const formData = new FormData();
    const file = {
        uri,
        name: 'video.mp4',
        type: 'video/mp4',
    } as any;
    formData.append('videoFile', file)
    formData.append('description', description);
    formData.append('studentIdentifier', studentIdentifier);
    formData.append('martialArt', 'BrazilianJiuJitsu_GI');
    formData.append('title', title);


    return api.post('/api/video/upload-sparring', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


export const getAnalysisResult = (videoId: number) => api.get(`/api/video/${videoId}/feedback`);
