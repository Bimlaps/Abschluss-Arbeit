import React from 'react';
import ShareButtons from './ShareButtons';

const WebsitePreview = ({ content, design }) => {
    return (
        <div className="website-preview">
            <div className="preview-header">
                <h1>{content.title}</h1>
                <ShareButtons 
                    title={content.title}
                    description={content.description}
                    className="preview-share-buttons"
                />
            </div>
            {/* Rest der Komponente */}
        </div>
    );
};

export default WebsitePreview; 