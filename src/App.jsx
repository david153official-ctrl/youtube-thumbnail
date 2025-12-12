import React, { useState, useEffect } from 'react';
import { Youtube, Search, Key, X } from 'lucide-react';
import { getYouTubeVideoId, getUrlType, getChannelIdentifier } from './utils/youtube';
import { extractChannelVideos } from './utils/channelExtractor';
import ThumbnailDisplay from './components/ThumbnailDisplay';
import ChannelVideosDisplay from './components/ChannelVideosDisplay';
import ApiGuide from './components/ApiGuide';
import UnicornStudioEmbed from './components/UnicornStudioEmbed';
import './App.css';
import './ThumbnailExtractorPage.css';

function App() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [channelVideos, setChannelVideos] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showApiGuide, setShowApiGuide] = useState(false);
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

    console.log('🎬 Extract clicked! URL:', url);
    const urlType = getUrlType(url);
    console.log('📋 URL Type detected:', urlType);

    if (!urlType) {
      console.error('❌ Invalid URL - no type detected');
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
    <div className="thumbnail-page">
      {/* 배경 애니메이션 */}
      <div className="background-animation" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`data-line line-${i + 1}`} />
        ))}
      </div>

      {/* API Guide Modal */}
      {showApiGuide && <ApiGuide onClose={() => setShowApiGuide(false)} />}

      {/* 상단 UnicornStudio 히어로 */}
      <section className="us-hero">
        <div className="us-hero-bg" aria-hidden="true">
          <UnicornStudioEmbed projectId="yliYCk9TOikh4aGNlWjn" className="us-embed" />
        </div>
        <div className="us-hero-overlay" aria-hidden="true" />

        <div className="content-wrapper us-hero-content">
          <header className="hero-section">
            <div className="hero-icon" aria-hidden="true">
              <Youtube size={44} strokeWidth={2} />
            </div>
            <h1 className="main-title">유튜브 썸네일 추출기</h1>
            <p className="subtitle">유튜브 영상 또는 채널의 고화질 썸네일을 즉시 다운로드하세요.</p>

            {/* API Key Management */}
            <div className="api-key-row">
          {apiKey ? (
              <div className="api-key-status">
              <Key size={16} />
              <span>API 키 설정됨</span>
              <button
                onClick={clearApiKey}
                className="api-key-clear"
                title="API 키 삭제"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="btn-secondary api-key-btn"
            >
              <Key size={16} />
              API 키 설정
            </button>
          )}
            </div>

            {/* 검색 바 */}
            <section className="search-section">
              <form onSubmit={handleExtract} className="search-form">
                <div className="search-container">
                  <div className="search-input-wrap">
                    <Search size={20} className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="유튜브 영상 또는 채널 URL을 붙여넣으세요..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <button type="submit" className="search-button" disabled={loading}>
                    {loading ? '로딩 중...' : '썸네일 추출'}
                  </button>
                </div>
              </form>

              {error && <p className="form-error">{error}</p>}
            </section>
          </header>

          {/* API Key Input */}
          {showApiKeyInput && (
            <div className="card api-key-card">
              <h3 className="api-key-title">YouTube Data API 키 입력</h3>
              <p className="api-key-desc">
                채널의 모든 영상을 가져오려면 YouTube Data API v3 키가 필요합니다.
                <button onClick={() => setShowApiGuide(true)} className="api-guide-link">
                  API 키 발급 가이드 보기
                </button>
              </p>
              <div className="api-key-input-row">
                <input
                  type="text"
                  placeholder="여기에 API 키를 입력하세요..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
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
        </div>
      </section>

      <div className="content-wrapper">
        {/* Display results */}
        {videoId && <ThumbnailDisplay videoId={videoId} />}
        {channelVideos && (
          <ChannelVideosDisplay videos={channelVideos.videos} totalResults={channelVideos.totalResults} />
        )}

        <footer className="page-footer">
          <p>
            Made with{' '}
            <a
              href="https://unicorn.studio/"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Unicorn Studio
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
