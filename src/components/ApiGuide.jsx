import React from 'react';
import { X, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

const ApiGuide = ({ onClose }) => {
    const steps = [
        {
            title: "1단계. Google Cloud Console 접속",
            items: [
                { text: "아래 버튼을 클릭하여 Google Cloud Console로 이동하세요", hasButton: true },
                { text: "Google 계정으로 로그인합니다" },
                { text: "화면 상단의 프로젝트 선택 드롭다운을 클릭합니다" },
                { text: "\"새 프로젝트\" 버튼을 클릭하여 프로젝트를 생성합니다", tip: "기존 프로젝트가 있다면 그것을 사용해도 됩니다" },
                { text: "프로젝트 이름을 입력하고 \"만들기\" 버튼을 클릭합니다", example: "예: YouTube Thumbnail Extractor" }
            ]
        },
        {
            title: "2단계. YouTube Data API v3 활성화",
            items: [
                { text: "좌측 메뉴에서 \"API 및 서비스\" > \"라이브러리\"를 클릭합니다" },
                { text: "검색창에 \"YouTube Data API v3\"를 입력합니다" },
                { text: "검색 결과에서 \"YouTube Data API v3\"를 클릭합니다" },
                { text: "\"사용\" 또는 \"Enable\" 버튼을 클릭하여 API를 활성화합니다" },
                { text: "API가 활성화되면 \"사용자 인증 정보\" 페이지로 이동합니다" }
            ]
        },
        {
            title: "3단계. API 키 생성",
            items: [
                { text: "\"사용자 인증 정보\" 페이지에서 상단의 \"+ 사용자 인증 정보 만들기\" 버튼을 클릭합니다" },
                { text: "드롭다운 메뉴에서 \"API 키\"를 선택합니다" },
                { text: "API 키가 자동으로 생성됩니다", important: true },
                { text: "생성된 API 키를 복사합니다 (나중에 다시 확인할 수 있습니다)" }
            ]
        },
        {
            title: "4단계. API 키 제한 설정 (권장)",
            items: [
                { text: "생성된 API 키 옆의 \"키 제한\" 또는 \"Edit\" 버튼을 클릭합니다" },
                { text: "\"애플리케이션 제한사항\" 섹션에서 \"HTTP 리퍼러(웹사이트)\"를 선택합니다", tip: "로컬 개발 시에는 \"없음\"을 선택해도 됩니다" },
                { text: "\"API 제한사항\" 섹션에서 \"키 제한\"을 선택합니다" },
                { text: "드롭다운에서 \"YouTube Data API v3\"만 선택합니다" },
                { text: "\"저장\" 버튼을 클릭합니다" }
            ]
        },
        {
            title: "5단계. API 키 입력",
            items: [
                { text: "복사한 API 키를 이 페이지의 입력창에 붙여넣습니다" },
                { text: "\"저장\" 버튼을 클릭합니다" },
                { text: "API 키가 브라우저의 localStorage에 안전하게 저장됩니다" },
                { text: "이제 채널 URL을 입력하여 썸네일을 추출할 수 있습니다! 🎉" }
            ]
        }
    ];

    return (
        <div className="guide-overlay">
            <div className="guide-container">
                {/* Header */}
                <div className="guide-header">
                    <div>
                        <h2>YouTube Data API 키 발급 가이드</h2>
                        <p>아래 단계를 따라 API 키를 발급받으세요</p>
                    </div>
                    <button onClick={onClose} className="guide-close-btn">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="guide-content">
                    {/* Info Box */}
                    <div className="guide-info-box">
                        <div className="info-item">
                            <span className="info-label">소요 시간</span>
                            <span className="info-value">약 5-10분</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">필요 사항</span>
                            <span className="info-value">Google 계정 (무료)</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">비용</span>
                            <span className="info-value">무료 (일일 10,000 units)</span>
                        </div>
                    </div>

                    {/* Steps */}
                    {steps.map((step, index) => (
                        <div key={index} className="guide-step-new">
                            <h3 className="step-title">{step.title}</h3>
                            <div className="step-content">
                                {step.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className={`step-item ${item.important ? 'step-item-important' : ''}`}>
                                        <div className="step-number">{itemIndex + 1}</div>
                                        <div className="step-text">
                                            <div className="step-main-text">{item.text}</div>
                                            {item.hasButton && (
                                                <a
                                                    href="https://console.cloud.google.com/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="guide-btn"
                                                >
                                                    Google Cloud Console 열기
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                            {item.tip && (
                                                <div className="step-tip">
                                                    <span className="tip-icon">💡</span>
                                                    <span>{item.tip}</span>
                                                </div>
                                            )}
                                            {item.example && (
                                                <div className="step-example">{item.example}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Success Box */}
                    <div className="guide-success-box">
                        <CheckCircle size={20} color="#4ade80" />
                        <div>
                            <strong>완료!</strong>
                            <p>API 키를 입력하고 저장하면, 채널 URL을 붙여넣어 해당 채널의 모든 영상 썸네일을 한 번에 추출할 수 있습니다!</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="guide-footer">
                    <button onClick={onClose} className="btn-primary">
                        이해했습니다
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiGuide;
