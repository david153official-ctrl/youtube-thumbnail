import React from 'react';
import { X, ExternalLink, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

const ApiGuide = ({ onClose }) => {
    const steps = [
        {
            title: "1. Google Cloud Console 접속",
            description: "Google Cloud Console에 접속하여 프로젝트를 생성합니다.",
            substeps: [
                {
                    text: "아래 버튼을 클릭하여 Google Cloud Console로 이동하세요",
                    action: (
                        <a
                            href="https://console.cloud.google.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="guide-link-btn"
                        >
                            Google Cloud Console 열기
                            <ExternalLink size={16} />
                        </a>
                    )
                },
                {
                    text: "Google 계정으로 로그인합니다"
                },
                {
                    text: "화면 상단의 프로젝트 선택 드롭다운을 클릭합니다"
                },
                {
                    text: "\"새 프로젝트\" 버튼을 클릭하여 프로젝트를 생성합니다",
                    note: "기존 프로젝트가 있다면 그것을 사용해도 됩니다"
                },
                {
                    text: "프로젝트 이름을 입력하고 \"만들기\" 버튼을 클릭합니다",
                    example: "예: YouTube Thumbnail Extractor"
                }
            ]
        },
        {
            title: "2. YouTube Data API v3 활성화",
            description: "프로젝트에서 YouTube Data API를 사용하도록 설정합니다.",
            substeps: [
                {
                    text: "좌측 메뉴에서 \"API 및 서비스\" > \"라이브러리\"를 클릭합니다"
                },
                {
                    text: "검색창에 \"YouTube Data API v3\"를 입력합니다"
                },
                {
                    text: "검색 결과에서 \"YouTube Data API v3\"를 클릭합니다"
                },
                {
                    text: "\"사용\" 또는 \"Enable\" 버튼을 클릭하여 API를 활성화합니다"
                },
                {
                    text: "API가 활성화되면 \"사용자 인증 정보\" 페이지로 이동합니다"
                }
            ]
        },
        {
            title: "3. API 키 생성",
            description: "YouTube Data API에 접근하기 위한 API 키를 생성합니다.",
            substeps: [
                {
                    text: "\"사용자 인증 정보\" 페이지에서 상단의 \"+ 사용자 인증 정보 만들기\" 버튼을 클릭합니다"
                },
                {
                    text: "드롭다운 메뉴에서 \"API 키\"를 선택합니다"
                },
                {
                    text: "API 키가 자동으로 생성됩니다",
                    important: true
                },
                {
                    text: "생성된 API 키를 복사합니다 (나중에 다시 확인할 수 있습니다)"
                }
            ]
        },
        {
            title: "4. API 키 제한 설정 (권장)",
            description: "보안을 위해 API 키에 제한을 설정하는 것이 좋습니다.",
            substeps: [
                {
                    text: "생성된 API 키 옆의 \"키 제한\" 또는 \"Edit\" 버튼을 클릭합니다"
                },
                {
                    text: "\"애플리케이션 제한사항\" 섹션에서 \"HTTP 리퍼러(웹사이트)\"를 선택합니다",
                    note: "로컬 개발 시에는 \"없음\"을 선택해도 됩니다"
                },
                {
                    text: "\"API 제한사항\" 섹션에서 \"키 제한\"을 선택합니다"
                },
                {
                    text: "드롭다운에서 \"YouTube Data API v3\"만 선택합니다"
                },
                {
                    text: "\"저장\" 버튼을 클릭합니다"
                }
            ]
        },
        {
            title: "5. API 키 입력",
            description: "생성한 API 키를 이 애플리케이션에 입력합니다.",
            substeps: [
                {
                    text: "복사한 API 키를 이 페이지의 입력창에 붙여넣습니다"
                },
                {
                    text: "\"저장\" 버튼을 클릭합니다"
                },
                {
                    text: "API 키가 브라우저의 localStorage에 안전하게 저장됩니다"
                },
                {
                    text: "이제 채널 URL을 입력하여 썸네일을 추출할 수 있습니다! 🎉"
                }
            ]
        }
    ];

    return (
        <div className="guide-overlay">
            <div className="guide-container">
                <div className="guide-header">
                    <div>
                        <h2>YouTube Data API 키 발급 가이드</h2>
                        <p>아래 단계를 따라 API 키를 발급받으세요</p>
                    </div>
                    <button onClick={onClose} className="guide-close-btn">
                        <X size={24} />
                    </button>
                </div>

                <div className="guide-content">
                    <div className="guide-notice">
                        <AlertCircle size={20} />
                        <div>
                            <strong>소요 시간: 약 5-10분</strong>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#aaa' }}>
                                처음 발급받는 경우 Google 계정이 필요하며, 무료로 이용할 수 있습니다.
                            </p>
                        </div>
                    </div>

                    {steps.map((step, index) => (
                        <div key={index} className="guide-step">
                            <div className="guide-step-header">
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                            <div className="guide-substeps">
                                {step.substeps.map((substep, subIndex) => (
                                    <div
                                        key={subIndex}
                                        className={`guide-substep ${substep.important ? 'important' : ''}`}
                                    >
                                        <div className="guide-substep-marker">
                                            {substep.important ? (
                                                <AlertCircle size={16} color="#f59e0b" />
                                            ) : (
                                                <ChevronRight size={16} />
                                            )}
                                        </div>
                                        <div className="guide-substep-content">
                                            <p>{substep.text}</p>
                                            {substep.note && (
                                                <div className="guide-note">
                                                    💡 {substep.note}
                                                </div>
                                            )}
                                            {substep.example && (
                                                <div className="guide-example">
                                                    {substep.example}
                                                </div>
                                            )}
                                            {substep.action && (
                                                <div className="guide-action">
                                                    {substep.action}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="guide-success">
                        <CheckCircle size={24} color="#4ade80" />
                        <div>
                            <strong>완료 후에는</strong>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#aaa' }}>
                                API 키를 입력하고 저장하면, 채널 URL을 붙여넣어 해당 채널의 모든 영상 썸네일을 한 번에 추출할 수 있습니다!
                            </p>
                        </div>
                    </div>

                    <div className="guide-quota-info">
                        <h4>📊 API 할당량 정보</h4>
                        <ul>
                            <li>무료 할당량: <strong>일일 10,000 units</strong></li>
                            <li>채널 조회 비용: <strong>약 3-5 units</strong></li>
                            <li>하루에 약 <strong>2,000회 이상</strong> 채널 조회 가능</li>
                        </ul>
                    </div>
                </div>

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
