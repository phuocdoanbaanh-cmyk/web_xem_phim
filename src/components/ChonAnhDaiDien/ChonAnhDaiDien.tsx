import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import './ChonAnhDaiDien.css';

interface ChonAnhDaiDienProps {
  currentAvatar: string | null;
  onSelect: (avatarUrl: string) => void;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Jasper&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Eden&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&backgroundColor=ffd5dc',
];

export const ChonAnhDaiDien: React.FC<ChonAnhDaiDienProps> = ({ currentAvatar, onSelect, onClose }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedAvatar(imageUrl);
    }
  };

  const handleSave = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
    }
    onClose();
  };

  return (
    <div className="avatar-selector-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="avatar-selector-modal">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="avatar-header">
          <h2 className="avatar-title">Choose Avatar</h2>
          <p className="avatar-subtitle">Select a preset or upload your own</p>
        </div>

        <div className="avatar-grid">
          {PRESET_AVATARS.map((avatar, index) => (
            <div 
              key={index} 
              className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
              onClick={() => setSelectedAvatar(avatar)}
            >
              <img src={avatar} alt={`Preset ${index + 1}`} />
            </div>
          ))}
          
          <div className="upload-option" onClick={() => fileInputRef.current?.click()}>
            <Upload size={24} />
            <span>Upload</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
            style={{ display: 'none' }}
          />
        </div>

        <div className="avatar-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};
