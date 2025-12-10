import React, { useState } from 'react';
import { Sparkles, Video, Zap, TrendingUp } from 'lucide-react';
import './AILandingPage.css';

const AILandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTone, setSelectedTone] = useState(null);

  const videoTones = [
    { id: 'professional', name: '전문적', icon: '💼', description: '비즈니스 & 전문가용' },
    { id: 'casual', name: '캐주얼', icon: '😊', description: '일상 & 브이로그' },
    { id: 'energetic', name: '활기찬', icon: '⚡', description: '엔터테인먼트 & 게임' },
    { id: 'educational', name: '교육적', icon: '📚', description: '튜토리얼 & 강의' }
  ];

  const sampleThumbnails = [
    {
      id: 1,
      title: 'AI가 생성한 기술 리뷰 썸네일',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=225&fit=crop',
    },
    {
      id: 2,
      title: '요리 콘텐츠 AI 썸네일',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=225&fit=crop',
    },
    {
      id: 3,
      title: '여행 브이로그 썸네일',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=225&fit=crop',
    },
    {
      id: 4,
      title: '게임 스트리밍 썸네일',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop',
    },
    {
      id: 5,
      title: '피트니스 콘텐츠 썸네일',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=225&fit=crop',
    },
    {
      id: 6,
      title: '음악 프로덕션 썸네일',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=225&fit=crop',
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('검색 쿼리:', searchQuery, '선택된 톤:', selectedTone);
    // 여기에 AI 콘텐츠 생성 로직을 추가할 수 있습니다
  };

  return (
    <div className="ai-landing-page">
      {/* 배경 애니메이션 */}
      <div className="background-animation">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`data-line line-${i + 1}`} />
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="content-wrapper">
        {/* 헤더 섹션 */}
        <header className="hero-section">
          <div className="hero-icon">
            <Sparkles size={48} strokeWidth={2} />
          </div>
          <h1 className="main-title">
            AI로 당신의 콘텐츠를 만들어보세요
          </h1>
          <p className="subtitle">
            몇 초 만에 전문가급 유튜브 콘텐츠를 자동 생성하세요
          </p>
        </header>

        {/* 검색 바 섹션 */}
        <section className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="어떤 콘텐츠를 만들고 싶으신가요? (예: 기술 리뷰, 요리 레시피, 여행 브이로그)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                <Zap size={20} />
                <span>생성하기</span>
              </button>
            </div>
          </form>
        </section>

        {/* 비디오 톤 선택 섹션 */}
        <section className="tone-section">
          <h2 className="section-title">
            <Video size={24} />
            비디오 톤 선택
          </h2>
          <div className="tone-grid">
            {videoTones.map((tone) => (
              <button
                key={tone.id}
                className={`tone-card ${selectedTone === tone.id ? 'selected' : ''}`}
                onClick={() => setSelectedTone(tone.id)}
              >
                <div className="tone-icon">{tone.icon}</div>
                <h3 className="tone-name">{tone.name}</h3>
                <p className="tone-description">{tone.description}</p>
                {selectedTone === tone.id && (
                  <div className="selected-indicator">
                    <TrendingUp size={16} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* AI 생성 썸네일 갤러리 */}
        <section className="gallery-section">
          <h2 className="section-title">
            <Sparkles size={24} />
            AI 생성 썸네일 갤러리
          </h2>
          <div className="thumbnail-grid">
            {sampleThumbnails.map((thumbnail) => (
              <div key={thumbnail.id} className="thumbnail-card">
                <div className="thumbnail-image-wrapper">
                  <img
                    src={thumbnail.image}
                    alt={thumbnail.title}
                    className="thumbnail-image"
                  />
                  <div className="thumbnail-overlay">
                    <button className="preview-button">미리보기</button>
                  </div>
                </div>
                <p className="thumbnail-title">{thumbnail.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 푸터 */}
        <footer className="footer">
          <p>© 2024 AI Content Creator. Powered by Advanced AI Technology.</p>
        </footer>
      </div>
    </div>
  );
};

export default AILandingPage;
