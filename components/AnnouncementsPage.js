import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/Announcements.module.css';

const AnnouncementsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    content: '',
    startDate: '',
    endDate: '',
    photo: null,
    photoPreview: null
  });

  const announcementTypes = ['優惠活動', '一般公告', '營業時間'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      type: type
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            photo: file,
            photoPreview: reader.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        alert('只支援 PNG 或 JPG 格式的圖片');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.type || !formData.content.trim() || !formData.startDate || !formData.endDate) {
      alert('請填寫所有必填欄位');
      return;
    }

    // Add new announcement to the list
    const newAnnouncement = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
    
    // TODO: Add logic to save the announcement to Firebase
    console.log('提交公告資料:', newAnnouncement);
    
    // Reset form and close modal
    setFormData({
      title: '',
      type: '',
      content: '',
      startDate: '',
      endDate: '',
      photo: null,
      photoPreview: null
    });
    setShowAddModal(false);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({
      title: '',
      type: '',
      content: '',
      startDate: '',
      endDate: '',
      photo: null,
      photoPreview: null
    });
  };

  const handleDeleteAnnouncement = (id) => {
    if (confirm('確定要刪除此公告嗎？')) {
      setAnnouncements(prev => prev.filter(item => item.id !== id));
      // TODO: Delete from Firebase
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case '優惠活動':
        return '#ff6b6b';
      case '一般公告':
        return '#4ecdc4';
      case '營業時間':
        return '#ffd93d';
      default:
        return '#999';
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.icon}>📢</div>
          <h1 className={styles.title}>餐廳介面公告/活動管理</h1>
        </div>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          新增公告
        </button>
      </div>

      {/* Announcements List */}
      <div className={styles.announcementsList}>
        {announcements.length === 0 ? (
          <p className={styles.placeholder}>尚無公告，點擊「新增公告」開始建立</p>
        ) : (
          <div className={styles.announcementsGrid}>
            {announcements.map(announcement => (
              <div key={announcement.id} className={styles.announcementCard}>
                {announcement.photoPreview && (
                  <div className={styles.cardImageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={announcement.photoPreview} 
                      alt={announcement.title} 
                      className={styles.cardImage} 
                    />
                  </div>
                )}
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{announcement.title}</h3>
                    <span 
                      className={styles.typeTag}
                      style={{ backgroundColor: getTypeColor(announcement.type) }}
                    >
                      {announcement.type}
                    </span>
                  </div>
                  <p className={styles.cardDescription}>{announcement.content}</p>
                  <div className={styles.cardDates}>
                    <span className={styles.dateLabel}>📅 活動期間：</span>
                    <span className={styles.dateValue}>
                      {announcement.startDate} ~ {announcement.endDate}
                    </span>
                  </div>
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>新增公告</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Title */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  公告標題 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="請輸入公告標題"
                  required
                />
              </div>

              {/* Announcement Type */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  公告類型 <span className={styles.required}>*</span>
                </label>
                <div className={styles.typeGrid}>
                  {announcementTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      className={`${styles.typeButton} ${
                        formData.type === type ? styles.typeButtonActive : ''
                      }`}
                      onClick={() => handleTypeSelect(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  公告內容 <span className={styles.required}>*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="請輸入公告內容"
                  rows="6"
                  required
                />
              </div>

              {/* Date Range */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    開始日期 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    結束日期 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className={styles.formGroup}>
                <label className={styles.label}>公告圖片</label>
                <div className={styles.photoUploadSection}>
                  <input
                    type="file"
                    id="photoUpload"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    onChange={handlePhotoUpload}
                    className={styles.fileInput}
                  />
                  <label htmlFor="photoUpload" className={styles.uploadButton}>
                    📷 選擇照片 (PNG, JPG)
                  </label>
                  {formData.photoPreview && (
                    <div className={styles.photoPreview}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.photoPreview} alt="預覽" className={styles.previewImage} />
                      <button
                        type="button"
                        className={styles.removePhotoButton}
                        onClick={() => setFormData(prev => ({ ...prev, photo: null, photoPreview: null }))}
                      >
                        移除照片
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCloseModal}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  確認新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
