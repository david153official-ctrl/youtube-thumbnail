import React, { useState } from 'react';
import { Youtube, Search } from 'lucide-react';
import { getYouTubeVideoId } from './utils/youtube';
import ThumbnailDisplay from './components/ThumbnailDisplay';

function App() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState('');

  const handleExtract = (e) => {
    e.preventDefault();
    setError('');
    const id = getYouTubeVideoId(url);
    if (id) {
      setVideoId(id);
    } else {
      setVideoId(null);
      setError('유효하지 않은 유튜브 URL입니다. 확인 후 다시 시도해주세요.');
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
          유튜브 영상의 고화질 썸네일을 즉시 다운로드하세요.
        </p>
      </header>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleExtract} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input
              type="text"
              placeholder="유튜브 URL을 여기에 붙여넣으세요..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <button type="submit" className="btn-primary">
            썸네일 추출
          </button>
        </form>
        {error && <p style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'left' }}>{error}</p>}
      </div>

      <ThumbnailDisplay videoId={videoId} />

      <footer style={{ marginTop: '4rem', color: '#666', fontSize: '0.9rem' }}>
        <p>© {new Date().getFullYear()} YouTube Thumbnail Extractor. Built with React & Vite.</p>
      </footer>
    </div>
  );
}

export default App;
