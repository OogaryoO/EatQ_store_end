import { useState } from 'react'
import styles from '../styles/Dashboard.module.css'

const NotificationSendingPage = ({ waitingCount, onBackToDashboard }) => {
  const [customMessage, setCustomMessage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [expiryTime, setExpiryTime] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const templates = [
    {
      category: '等候時間更新',
      examples: [
        '目前等候時間約 20-30 分鐘，請耐心等候',
        '等候時間縮短至 15 分鐘，感謝您的耐心'
      ]
    },
    {
      category: '安撫訊息',
      examples: [
        '您可以暫時離開，十分鐘內回來即可',
        '附近有咖啡廳可以休息，我們會提前通知您'
      ]
    },
    {
      category: '候位優惠',
      examples: [
        '候位滿30分鐘贈送小菜一份',
        '等候期間享有飲料折扣優惠'
      ]
    }
  ]

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleSendNotification = () => {
    // TODO: Implement actual notification sending logic
    console.log('Sending notification:', {
      message: customMessage,
      image: imageFile,
      expiryTime: expiryTime
    })
    alert('公告已發送！')
    // Reset form
    setCustomMessage('')
    setImageFile(null)
    setExpiryTime('')
  }

  const applyTemplate = (template) => {
    setCustomMessage(template)
    setSelectedTemplate(template)
  }

  return (
    <div className={styles.dashboardPage}>
      {/* Header Section */}
      <div className={styles.notificationHeader}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.backButton}
            onClick={onBackToDashboard}
          >
            返回控制台
          </button>
          <div className={styles.headerTitleGroup}>
            <h1 className={styles.pageTitle}>候位公告發送</h1>
            <p className={styles.headerSubtitle}>公告僅發送給目前候位中的顧客</p>
          </div>
        </div>
        <div className={styles.waitingCountCard}>
          <div className={styles.countLabel}>目前候位人數</div>
          <div className={styles.countNumber}>{waitingCount} <span className={styles.countUnit}>組</span></div>
        </div>
      </div>

      <div className={styles.dashboardContent}>
        {/* Quick Templates Section */}
        <div className={styles.templatesSection}>
          <h2 className={styles.sectionTitle}>快速模板</h2>
          <div className={styles.templatesGrid}>
            {templates.map((template, index) => (
              <div key={index} className={styles.templateCategory}>
                <h3 className={styles.templateCategoryTitle}>{template.category}</h3>
                <div className={styles.templateExamples}>
                  {template.examples.map((example, exampleIndex) => (
                    <div 
                      key={exampleIndex} 
                      className={`${styles.templateCard} ${selectedTemplate === example ? styles.templateCardSelected : ''}`}
                      onClick={() => applyTemplate(example)}
                    >
                      <div className={styles.templateText}>{example}</div>
                      <button className={styles.useTemplateButton}>使用</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Announcement Section */}
        <div className={styles.customAnnouncementSection}>
          <h2 className={styles.sectionTitle}>自訂公告</h2>
          <div className={styles.customAnnouncementCard}>
            {/* Message Input */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>公告內容</label>
              <textarea
                className={styles.messageTextarea}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="請輸入公告內容..."
                rows={6}
              />
            </div>

            {/* Image Upload */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>上傳圖片（選填）</label>
              <div className={styles.imageUploadArea}>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                />
                <label htmlFor="imageUpload" className={styles.uploadLabel}>
                  {imageFile ? (
                    <div className={styles.uploadedFileInfo}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                      <span>{imageFile.name}</span>
                    </div>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                      <span>點擊上傳圖片</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Expiry Time */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>設定過期時間（選填）</label>
              <input
                type="datetime-local"
                className={styles.dateTimeInput}
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
              />
              <p className={styles.formHint}>公告將在設定時間後自動失效</p>
            </div>

            {/* Send Button */}
            <div className={styles.sendButtonContainer}>
              <button
                className={styles.sendButton}
                onClick={handleSendNotification}
                disabled={!customMessage.trim()}
              >
                發送公告
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationSendingPage
