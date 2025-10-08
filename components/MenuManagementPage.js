import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/MenuManagement.module.css';

const MenuManagementPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
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

    if (editingItem) {
      // Update existing item
      setMenuItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
      console.log('更新菜品資料:', { ...editingItem, ...formData });
    } else {
      // Add new menu item to the list
      const newMenuItem = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setMenuItems(prev => [newMenuItem, ...prev]);
      console.log('提交菜品資料:', newMenuItem);
    }

    // TODO: Add logic to save the dish to Firebase
    
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
    setEditingItem(null);
    setShowAddModal(false);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
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

  const handleEditMenuItem = (item) => {
    setEditingItem(item);
    setFormData({
      dishName: item.dishName,
      price: item.price,
      categories: item.categories,
      isAvailable: item.isAvailable,
      description: item.description,
      photo: item.photo,
      photoPreview: item.photoPreview
    });
    setShowAddModal(true);
  };

  const handleDeleteMenuItem = (id) => {
    if (confirm('確定要刪除此菜品嗎？')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      // TODO: Delete from Firebase
    }
  };

  const handleToggleAvailability = (id) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isAvailable: !item.isAvailable }
        : item
    ));
    // TODO: Update in Firebase
  };

  // Group menu items by category
  const groupedMenuItems = categories.reduce((acc, category) => {
    acc[category] = menuItems.filter(item => item.categories.includes(category));
    return acc;
  }, {});

  // Items with no category
  const uncategorizedItems = menuItems.filter(item => item.categories.length === 0);

  return (
    <div className={styles.dashboardPage}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.dashboardIconContainer}>
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: '#f5ae39' }}
          >
            <path d="M12 3C10.9 3 10 3.9 10 5V6H8V5C8 2.79 9.79 1 12 1C14.21 1 16 2.79 16 5V6H14V5C14 3.9 13.1 3 12 3Z" fill="currentColor"/>
            <path d="M18 8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM18 20H6V10H18V20Z" fill="currentColor"/>
            <path d="M12 12C10.9 12 10 12.9 10 14C10 15.1 10.9 16 12 16C13.1 16 14 15.1 14 14C14 12.9 13.1 12 12 12Z" fill="currentColor"/>
            <path d="M8 6H16V8H8V6Z" fill="currentColor"/>
          </svg>
        </div>
        <h1 className={styles.dashboardTitle}>菜單管理</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          新增菜品
        </button>
      </div>

      {/* Menu Items List */}
      <div className={styles.dashboardContent}>
        {menuItems.length === 0 ? (
          <div className={styles.seatingStatusSection}>
            <h3 className={styles.sectionTitle}>菜品列表</h3>
            <p className={styles.placeholder}>尚無菜品，點擊「新增菜品」開始建立</p>
          </div>
        ) : (
          <>
            {/* Display items by category */}
            {categories.map(category => {
              const categoryItems = groupedMenuItems[category];
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={category} className={styles.categorySection}>
                  <h3 className={styles.categoryTitle}>{category}</h3>
                  <div className={styles.menuGrid}>
                    {categoryItems.map(item => (
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
                          {item.description && (
                            <p className={styles.cardDescription}>{item.description}</p>
                          )}
                          <div className={styles.cardFooter}>
                            <button 
                              className={`${styles.availabilityToggle} ${item.isAvailable ? styles.available : styles.soldOut}`}
                              onClick={() => handleToggleAvailability(item.id)}
                            >
                              {item.isAvailable ? '可售賣' : '售罄'}
                            </button>
                            <div className={styles.cardActions}>
                              <button 
                                className={styles.iconButton}
                                onClick={() => handleEditMenuItem(item)}
                                title="編輯"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                                </svg>
                              </button>
                              <button 
                                className={styles.iconButton}
                                onClick={() => handleDeleteMenuItem(item.id)}
                                title="刪除"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Display uncategorized items if any */}
            {uncategorizedItems.length > 0 && (
              <div className={styles.categorySection}>
                <h3 className={styles.categoryTitle}>未分類</h3>
                <div className={styles.menuGrid}>
                  {uncategorizedItems.map(item => (
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
                        {item.description && (
                          <p className={styles.cardDescription}>{item.description}</p>
                        )}
                        <div className={styles.cardFooter}>
                          <button 
                            className={`${styles.availabilityToggle} ${item.isAvailable ? styles.available : styles.soldOut}`}
                            onClick={() => handleToggleAvailability(item.id)}
                          >
                            {item.isAvailable ? '可售賣' : '售罄'}
                          </button>
                          <div className={styles.cardActions}>
                            <button 
                              className={styles.iconButton}
                              onClick={() => handleEditMenuItem(item)}
                              title="編輯"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                              </svg>
                            </button>
                            <button 
                              className={styles.iconButton}
                              onClick={() => handleDeleteMenuItem(item.id)}
                              title="刪除"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Dish Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingItem ? '編輯菜品' : '新增菜品'}</h2>
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
                  {editingItem ? '確認更新' : '確認新增'}
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
