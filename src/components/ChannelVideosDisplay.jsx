import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

const QUALITIES = [
    { label: '최대 해상도 (HD)', suffix: 'maxresdefault', width: 1280, height: 720 },
    { label: '표준 화질', suffix: 'sddefault', width: 640, height: 480 },
    { label: '고화질', suffix: 'hqdefault', width: 480, height: 360 },
    { label: '중간 화질', suffix: 'mqdefault', width: 320, height: 180 },
];

const VideoCard = ({ video }) => {
    const [expanded, setExpanded] = useState(false);

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(url, '_blank');
        }
    };

    return (
        <div className="video-card">
            <div className="video-thumbnail-preview">
                <img
                    src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    alt={video.title}
                />
            </div>
            <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <button
                    className="expand-btn"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? (
                        <>
                            <ChevronUp size={16} />
                            품질 옵션 숨기기
                        </>
                    ) : (
                        <>
                            <ChevronDown size={16} />
                            품질 옵션 보기
                        </>
                    )}
                </button>
            </div>

            {expanded && (
                <div className="quality-options">
                    {QUALITIES.map((quality) => {
                        const imgUrl = `https://img.youtube.com/vi/${video.videoId}/${quality.suffix}.jpg`;

                        return (
                            <div key={quality.suffix} className="quality-item">
                                <div className="quality-info">
                                    <span className="quality-label">{quality.label}</span>
                                    <span className="quality-size">{quality.width}x{quality.height}</span>
                                </div>
                                <button
                                    className="download-btn-small"
                                    onClick={() => handleDownload(imgUrl, `${video.title}-${quality.suffix}.jpg`)}
                                >
                                    <Download size={14} />
                                    다운로드
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const ChannelVideosDisplay = ({ videos, totalResults }) => {
    if (!videos || videos.length === 0) return null;

    return (
        <div className="channel-results">
            <div className="channel-header">
                <h2>채널 영상 ({videos.length}개{totalResults > videos.length ? ` / 총 ${totalResults}개` : ''})</h2>
                <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    각 영상을 클릭하여 다양한 품질의 썸네일을 다운로드하세요
                </p>
            </div>

            <div className="videos-grid">
                {videos.map((video) => (
                    <VideoCard key={video.videoId} video={video} />
                ))}
            </div>
        </div>
    );
};

export default ChannelVideosDisplay;
