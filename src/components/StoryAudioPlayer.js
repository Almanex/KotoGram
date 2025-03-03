import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CircularProgress, Alert } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ReplayIcon from '@mui/icons-material/Replay';
import DownloadIcon from '@mui/icons-material/Download';

const API_BASE_URL = 'http://localhost:5000';

const StoryAudioPlayer = ({ text, language }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [sessionId, setSessionId] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const audioRef = useRef(null);
    const MAX_RETRIES = 3;

    useEffect(() => {
        console.log('Component mounted, initializing session...');
        initSession();
        return () => {
            cleanupSession();
        };
    }, []);

    const checkServerConnection = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/init-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.ok;
        } catch (err) {
            console.error('Server connection error:', err);
            return false;
        }
    };

    const initSession = async () => {
        setIsInitializing(true);
        setError(null);
        console.log('Initializing session...');

        try {
            // Проверяем подключение к серверу
            const isServerAvailable = await checkServerConnection();
            if (!isServerAvailable) {
                throw new Error('Сервер недоступен. Убедитесь, что сервер запущен.');
            }

            const response = await fetch(`${API_BASE_URL}/api/init-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || t('errors.sessionInitFailed'));
            }
            
            const data = await response.json();
            console.log('Session initialized:', data);
            setSessionId(data.session_id);
            setError(null);
            
        } catch (err) {
            console.error('Session initialization error:', err);
            setError(err.message || t('errors.sessionInitFailed'));
            setSessionId(null);
        } finally {
            setIsInitializing(false);
        }
    };

    const cleanupSession = async () => {
        if (sessionId) {
            console.log('Cleaning up session:', sessionId);
            try {
                if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                }
                
                const response = await fetch(`${API_BASE_URL}/api/cleanup-session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ session_id: sessionId })
                });
                
                if (!response.ok) {
                    console.error('Cleanup response not OK:', response.status);
                }
                
            } catch (err) {
                console.error('Session cleanup error:', err);
            }
        }
    };

    const handleGenerateAudio = async () => {
        console.log('Generating audio with params:', { text, language, sessionId });
        
        if (!text) {
            setError(t('errors.noText'));
            return;
        }

        if (!sessionId) {
            console.log('No session ID, reinitializing...');
            await initSession();
            if (!sessionId) {
                setError('Не удалось инициализировать сессию. Проверьте подключение к серверу.');
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Sending audio generation request...');
            const response = await fetch(`${API_BASE_URL}/api/generate-audio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    language,
                    session_id: sessionId
                })
            });

            console.log('Generation response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || t('errors.audioGenerationFailed'));
            }

            const blob = await response.blob();
            console.log('Received blob size:', blob.size);
            
            if (blob.size === 0) {
                throw new Error(t('errors.emptyAudioFile'));
            }

            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }

            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            setAudioBlob(blob);
            setRetryCount(0);
            console.log('Audio generated successfully');

        } catch (err) {
            console.error('Audio generation error:', err);
            setError(err.message);
            setRetryCount(prev => prev + 1);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!audioBlob) return;

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `story_audio_${timestamp}.mp3`;
        
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRetry = async () => {
        if (retryCount < MAX_RETRIES) {
            console.log('Retrying... Attempt:', retryCount + 1);
            if (!sessionId) {
                await initSession();
            }
            if (sessionId) {
                handleGenerateAudio();
            }
        } else {
            setError(t('errors.maxRetriesReached'));
        }
    };

    const handlePlayError = (e) => {
        console.error('Audio playback error:', e);
        setError(t('errors.audioPlaybackFailed'));
    };

    if (isInitializing) {
        return (
            <div className="story-audio-player">
                <CircularProgress size={24} />
                <div style={{ marginTop: '10px' }}>
                    Инициализация аудио плеера...
                </div>
            </div>
        );
    }

    return (
        <div className="story-audio-player">
            {error && (
                <Alert 
                    severity="error" 
                    action={
                        retryCount < MAX_RETRIES && (
                            <Button
                                color="inherit"
                                size="small"
                                onClick={handleRetry}
                                startIcon={<ReplayIcon />}
                            >
                                {t('buttons.retry')}
                            </Button>
                        )
                    }
                >
                    {error}
                </Alert>
            )}
            
            <div className="audio-controls">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateAudio}
                    disabled={loading || !text || isInitializing}
                    startIcon={loading ? <CircularProgress size={20} /> : <VolumeUpIcon />}
                >
                    {loading ? t('buttons.generating') : t('buttons.generateAudio')}
                </Button>

                {audioUrl && !error && (
                    <>
                        <audio
                            ref={audioRef}
                            controls
                            src={audioUrl}
                            onError={handlePlayError}
                            className="audio-player"
                        />
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleDownload}
                            startIcon={<DownloadIcon />}
                        >
                            {t('buttons.download')}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default StoryAudioPlayer; 