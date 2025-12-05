import React from 'react';
import { Download, ExternalLink, Image as ImageIcon } from 'lucide-react';

const QUALITIES = [
    { label: '최대 해상도 (HD)', suffix: 'maxresdefault', width: 1280, height: 720 },
    { label: '표준 화질', suffix: 'sddefault', width: 640, height: 480 },
    { label: '고화질', suffix: 'hqdefault', width: 480, height: 360 },
    { label: '중간 화질', suffix: 'mqdefault', width: 320, height: 180 },
];

const ThumbnailDisplay = ({ videoId }) => {
    if (!videoId) return null;

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
        <div className="thumbnail-grid">
            {QUALITIES.map((quality) => {
                const imgUrl = `https://img.youtube.com/vi/${videoId}/${quality.suffix}.jpg`;

                return (
                    <div key={quality.suffix} className="thumbnail-card">
                        <div style={{ position: 'relative' }}>
                            <img
                                src={imgUrl}
                                alt={quality.label}
                                className="thumbnail-image"
                                onError={(e) => {
                                    e.target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; // Fallback
                                    e.target.parentElement.parentElement.style.opacity = '0.5'; // Indicate low quality/missing
                                }}
                            />
                        </div>
                        <div className="thumbnail-info">
                            <div>
                                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{quality.label}</div>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>{quality.width}x{quality.height}</div>
                            </div>
                            <button
                                className="download-btn"
                                onClick={() => handleDownload(imgUrl, `thumbnail-${videoId}-${quality.suffix}.jpg`)}
                            >
                                <Download size={16} />
                                다운로드
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ThumbnailDisplay;
