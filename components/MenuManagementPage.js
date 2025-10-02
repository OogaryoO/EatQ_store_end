import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/MenuManagement.module.css';

const MenuManagementPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    dishName: '',
    price: '',
    categories: [],
    isAvailable: true,
    description: '',
    photo: null,
    photoPreview: null
  });

  const categories = ['主食', '熱炒', '冷盤', '湯品', '飲料', '甜點'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
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
    
    if (!formData.dishName.trim() || !formData.price.trim()) {
      alert('請填寫菜品名稱和價格');
      return;
    }

    // Add new menu item to the list
    const newMenuItem = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    setMenuItems(prev => [newMenuItem, ...prev]);

    // TODO: Add logic to save the dish to Firebase
    console.log('提交菜品資料:', newMenuItem);
    
    // Reset form and close modal
    setFormData({
      dishName: '',
      price: '',
      categories: [],
      isAvailable: true,
      description: '',
      photo: null,
      photoPreview: null
    });
    setShowAddModal(false);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({
      dishName: '',
      price: '',
      categories: [],
      isAvailable: true,
      description: '',
      photo: null,
      photoPreview: null
    });
  };

  const handleDeleteMenuItem = (id) => {
    if (confirm('確定要刪除此菜品嗎？')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      // TODO: Delete from Firebase
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.icon}>👨‍🍳</div>
          <h1 className={styles.title}>菜單管理</h1>
        </div>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          新增菜品
        </button>
      </div>

      {/* Menu Items List */}
      <div className={styles.menuList}>
        {menuItems.length === 0 ? (
          <p className={styles.placeholder}>尚無菜品，點擊「新增菜品」開始建立</p>
        ) : (
          <div className={styles.menuGrid}>
            {menuItems.map(item => (
              <div key={item.id} className={styles.menuCard}>
                {item.photoPreview && (
                  <div className={styles.cardImageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.photoPreview} 
                      alt={item.dishName} 
                      className={styles.cardImage} 
                    />
                  </div>
                )}
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{item.dishName}</h3>
                    <span className={styles.cardPrice}>NT$ {item.price}</span>
                  </div>
                  {item.categories.length > 0 && (
                    <div className={styles.cardCategories}>
                      {item.categories.map(cat => (
                        <span key={cat} className={styles.categoryTag}>{cat}</span>
                      ))}
                    </div>
                  )}
                  {item.description && (
                    <p className={styles.cardDescription}>{item.description}</p>
                  )}
                  <div className={styles.cardFooter}>
                    <span className={`${styles.statusBadge} ${item.isAvailable ? styles.statusAvailable : styles.statusUnavailable}`}>
                      {item.isAvailable ? '✓ 可售賣' : '✗ 不可售賣'}
                    </span>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteMenuItem(item.id)}
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

      {/* Add Dish Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>新增菜品</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Dish Name and Price */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    菜品名稱 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="dishName"
                    value={formData.dishName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="請輸入菜品名稱"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    價格 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="請輸入價格"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Categories and Status */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>菜品分類</label>
                  <div className={styles.categoryGrid}>
                    {categories.map(category => (
                      <button
                        key={category}
                        type="button"
                        className={`${styles.categoryButton} ${
                          formData.categories.includes(category) ? styles.categoryButtonActive : ''
                        }`}
                        onClick={() => handleCategoryToggle(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>銷售狀態</label>
                  <div className={styles.statusToggle}>
                    <button
                      type="button"
                      className={`${styles.statusButton} ${
                        formData.isAvailable ? styles.statusButtonActive : ''
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, isAvailable: true }))}
                    >
                      可售賣
                    </button>
                    <button
                      type="button"
                      className={`${styles.statusButton} ${
                        !formData.isAvailable ? styles.statusButtonActive : ''
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, isAvailable: false }))}
                    >
                      不可售賣
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className={styles.formGroup}>
                <label className={styles.label}>菜品描述</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="請輸入菜品描述"
                  rows="4"
                />
              </div>

              {/* Photo Upload */}
              <div className={styles.formGroup}>
                <label className={styles.label}>菜品照片</label>
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

export default MenuManagementPage;
