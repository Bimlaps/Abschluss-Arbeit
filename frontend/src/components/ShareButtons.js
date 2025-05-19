import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const ShareButtons = ({ title, description, className }) => {
    const location = useLocation();
    const currentUrl = window.location.origin + location.pathname;
    const [activeTooltip, setActiveTooltip] = useState(null);

    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${currentUrl}`)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`
    };

    const buttons = [
        {
            platform: 'facebook',
            icon: 'fa-facebook-f',
            label: 'Auf Facebook teilen',
            color: '#1877f2'
        },
        {
            platform: 'twitter',
            icon: 'fa-twitter',
            label: 'Auf Twitter teilen',
            color: '#1da1f2'
        },
        {
            platform: 'linkedin',
            icon: 'fa-linkedin-in',
            label: 'Auf LinkedIn teilen',
            color: '#0077b5'
        },
        {
            platform: 'whatsapp',
            icon: 'fa-whatsapp',
            label: 'Per WhatsApp teilen',
            color: '#25d366'
        },
        {
            platform: 'telegram',
            icon: 'fa-telegram',
            label: 'Auf Telegram teilen',
            color: '#0088cc'
        }
    ];

    const handleShare = (platform) => {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        // Optional: Analytics-Event tracken
        if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'share', {
                method: platform,
                content_type: 'page',
                content_id: location.pathname
            });
        }
    };

    return (
        <div className={`share-buttons ${className || ''}`}>
            {buttons.map(({ platform, icon, label, color }) => (
                <div
                    key={platform}
                    className="share-button-container"
                    onMouseEnter={() => setActiveTooltip(platform)}
                    onMouseLeave={() => setActiveTooltip(null)}
                >
                    <button
                        onClick={() => handleShare(platform)}
                        className="share-button"
                        aria-label={label}
                        style={{
                            backgroundColor: color,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            margin: '0 8px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease-in-out',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                    >
                        <i className={`fab ${icon}`} />
                    </button>
                    {activeTooltip === platform && (
                        <div
                            className="tooltip"
                            style={{
                                position: 'absolute',
                                bottom: '-30px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                color: '#fff',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                whiteSpace: 'nowrap',
                                zIndex: 1000,
                                pointerEvents: 'none'
                            }}
                        >
                            {label}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

ShareButtons.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    className: PropTypes.string
};

ShareButtons.defaultProps = {
    description: '',
    className: ''
};

export default ShareButtons; 