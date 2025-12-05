import React, { useState, useEffect } from 'react';
import { Youtube, Search, Key, X } from 'lucide-react';
import { getYouTubeVideoId, getUrlType, getChannelIdentifier } from './utils/youtube';
import { extractChannelVideos } from './utils/channelExtractor';
import ThumbnailDisplay from './components/ThumbnailDisplay';
import ChannelVideosDisplay from './components/ChannelVideosDisplay';

function App() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [channelVideos, setChannelVideos] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('youtube_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const saveApiKey = () => {
    localStorage.setItem('youtube_api_key', tempApiKey);
    setApiKey(tempApiKey);
    setShowApiKeyInput(false);
  };

  const clearApiKey = () => {
    localStorage.removeItem('youtube_api_key');
    setApiKey('');
    setTempApiKey('');
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    setError('');
    setVideoId(null);
    setChannelVideos(null);

    const urlType = getUrlType(url);

    if (!urlType) {
      setError('유효하지 않은 유튜브 URL입니다. 영상 URL 또는 채널 URL을 입력해주세요.');
      return;
    }

    if (urlType === 'video') {
      // Handle video URL
      const id = getYouTubeVideoId(url);
      if (id) {
        setVideoId(id);
      }
    } else if (urlType === 'channel') {
      // Handle channel URL
      if (!apiKey) {
        setError('채널의 영상을 가져오려면 YouTube API 키가 필요합니다. 상단의 "API 키 설정" 버튼을 클릭해주세요.');
        setShowApiKeyInput(true);
        return;
      }

      setLoading(true);
      try {
        const channelId = getChannelIdentifier(url);
        const result = await extractChannelVideos(channelId, apiKey, 50);
        setChannelVideos(result);
      } catch (err) {
        setError(`채널 영상을 가져오는데 실패했습니다: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="App">
      <header style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Youtube size={48} color="#ef4444" />
          <h1>유튜브 썸네일 추출기</h1>
        </div>
        <p style={{ fontSize: '1.2rem', color: '#aaa', maxWidth: '600px', margin: '0 auto' }}>
          유튜브 영상 또는 채널의 고화질 썸네일을 즉시 다운로드하세요.
        </p>

        {/* API Key Management */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
          {apiKey ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontSize: '0.9rem' }}>
              <Key size={16} />
              <span>API 키 설정됨</span>
              <button
                onClick={clearApiKey}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title="API 키 삭제"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="btn-secondary"
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              <Key size={16} />
              API 키 설정
            </button>
          )}
        </div>

        {/* API Key Input */}
        {showApiKeyInput && (
          <div className="card" style={{ maxWidth: '600px', margin: '1rem auto', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>YouTube Data API 키 입력</h3>
            <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
              채널의 모든 영상을 가져오려면 YouTube Data API v3 키가 필요합니다.
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3b82f6', marginLeft: '0.5rem' }}
              >
                API 키 발급받기
              </a>
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="여기에 API 키를 입력하세요..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                style={{ flex: 1 }}
              />
              <button onClick={saveApiKey} className="btn-primary">
                저장
              </button>
              <button onClick={() => setShowApiKeyInput(false)} className="btn-secondary">
                취소
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleExtract} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input
              type="text"
              placeholder="유튜브 영상 또는 채널 URL을 붙여넣으세요..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ paddingLeft: '40px' }}
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '로딩 중...' : '썸네일 추출'}
          </button>
        </form>
        {error && <p style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'left' }}>{error}</p>}
      </div>

      {/* Display results based on mode */}
      {videoId && <ThumbnailDisplay videoId={videoId} />}
      {channelVideos && (
        <ChannelVideosDisplay
          videos={channelVideos.videos}
          totalResults={channelVideos.totalResults}
        />
      )}

      <footer style={{ marginTop: '4rem', color: '#666', fontSize: '0.9rem' }}>
        <p>© {new Date().getFullYear()} YouTube Thumbnail Extractor. Built with React & Vite.</p>
      </footer>
    </div>
  );
}

export default App;
