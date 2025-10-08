import { useState } from 'react'
import Image from 'next/image'
import styles from '../styles/Dashboard.module.css'
import { updateAvailableSeats } from '../lib/firebaseService'

const DashboardPage = ({ isSeatingAvailable, setIsSeatingAvailable, waitingCount, averageWaitTime, lastNotificationTime }) => {
  const [availableSeats, setAvailableSeats] = useState(10);
  const [currentView, setCurrentView] = useState('available'); // 'available' or 'full'
  
  // Mock waiting list data - replace with actual data from Firebase
  const [waitingList, setWaitingList] = useState([
    { id: 'A001', peopleCount: 4, status: '等待中', waitTime: 25 },
    { id: 'A002', peopleCount: 2, status: '等待中', waitTime: 18 },
    { id: 'A003', peopleCount: 6, status: '已過期', waitTime: 45 },
    { id: 'A004', peopleCount: 3, status: '等待中', waitTime: 12 },
  ]);

  const handleNotifyNext = () => {
    // Find the first customer with '等待中' status
    const nextCustomer = waitingList.find(customer => customer.status === '等待中');
    if (nextCustomer) {
      handleNotify(nextCustomer.id);
    }
  };

  const handleNotify = (groupId) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setWaitingList(prevList =>
      prevList.map(group =>
        group.id === groupId
          ? { ...group, status: '已通知', notifiedTime: timeStr }
          : group
      )
    );
  };

  const handleRemove = (groupId) => {
    setWaitingList(prevList => prevList.filter(group => group.id !== groupId));
  };

  const handleSkip = (groupId) => {
    setWaitingList(prevList =>
      prevList.map(group =>
        group.id === groupId
          ? { ...group, status: '已過期' }
          : group
      )
    );
  };

  return (
  <div className={styles.dashboardPage}>
    <div className={styles.dashboardHeader}>
      <div className={styles.dashboardIconContainer}>
        <Image 
          src="/dashboard-icon.png" 
          alt="控制台圖示" 
          width={48}
          height={48}
          className={styles.dashboardIcon}
          onError={() => console.log('Image failed to load')}
        />
      </div>
      <h1 className={styles.dashboardTitle}>控制台</h1>
    </div>
    <div className={styles.dashboardContent}>
      <div className={styles.seatingStatusSection}>
        <h3 className={styles.sectionTitle}>座位狀態</h3>
        <div className={styles.statusControls}>
          <div className={styles.statusButtons}>
            <button 
              className={`${styles.statusButton} ${currentView === 'available' ? styles.active : ''} ${styles.available}`}
              onClick={() => setCurrentView('available')}
            >
              有空位
            </button>
            <button 
              className={`${styles.statusButton} ${currentView === 'full' ? styles.active : ''} ${styles.full}`}
              onClick={() => setCurrentView('full')}
            >
              客滿
            </button>
          </div>
          
          {currentView === 'available' && (
            <div className={styles.sliderContainer}>
              <label className={styles.sliderLabel}>
                可用座位數: <span className={styles.sliderValue}>{availableSeats}</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={availableSeats}
                onChange={async (e) => {
                  const newValue = parseInt(e.target.value);
                  setAvailableSeats(newValue);
                  try {
                    await updateAvailableSeats(newValue);
                  } catch (error) {
                    console.error('Failed to update available seats:', error);
                  }
                }}
                className={styles.slider}
              />
            </div>
          )}
          
          {currentView === 'full' && (
            <button 
              className={styles.notifyNextButton}
              onClick={handleNotifyNext}
            >
              通知下一位
            </button>
          )}
        </div>
      </div>
      
      {currentView === 'available' && (
        <div className={styles.statisticsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statText}>
                  <div className={styles.statTitle}>今日候位人數</div>
                  <div className={styles.statNumber}>{waitingCount}</div>
                </div>
                <div className={`${styles.statIcon} ${styles.peopleIcon}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statText}>
                  <div className={styles.statTitle}>平均等待時間</div>
                  <div className={styles.statNumber}>{averageWaitTime} <span className={styles.statUnit}>分鐘</span></div>
                </div>
                <div className={`${styles.statIcon} ${styles.clockIcon}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    <path d="m12.5 7-1 0 0 6 4.25 2.52.77-1.28-3.52-2.09z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statText}>
                  <div className={styles.statTitle}>最近一次通知時間</div>
                  <div className={styles.statNumber}>{lastNotificationTime}</div>
                </div>
                <div className={`${styles.statIcon} ${styles.bellIcon}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {currentView === 'full' && (
        <>
          <div className={styles.waitingManagementSection}>
            <h3 className={styles.sectionTitle}>候位管理</h3>
            <div className={styles.waitingListContainer}>
              {waitingList.length === 0 ? (
                <div className={styles.emptyState}>目前沒有候位客人</div>
              ) : (
                waitingList.map((group) => (
                  <div key={group.id} className={styles.waitingListItem}>
                    <div className={styles.groupInfo}>
                      <div className={styles.groupId}>號碼: {group.id}</div>
                      <div className={styles.groupDetails}>
                        <span className={styles.peopleCount}>👥 {group.peopleCount} 人</span>
                        <span className={`${styles.statusBadge} ${styles[group.status]}`}>
                          {group.status}
                        </span>
                        <span className={styles.waitTime}>等待 {group.waitTime} 分鐘</span>
                      </div>
                      {group.notifiedTime && (
                        <div className={styles.notifiedTime}>通知時間: {group.notifiedTime}</div>
                      )}
                    </div>
                    <div className={styles.actionButtons}>
                      {group.status === '已通知' ? (
                        <button
                          className={styles.completeButton}
                          onClick={() => handleRemove(group.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                          已完成
                        </button>
                      ) : (
                        <>
                          <button
                            className={styles.notifyButton}
                            onClick={() => handleNotify(group.id)}
                            disabled={group.status === '已過期'}
                          >
                            通知
                          </button>
                          <button
                            className={styles.skipButton}
                            onClick={() => handleSkip(group.id)}
                            disabled={group.status === '已過期'}
                          >
                            跳過
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.statisticsSection}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <div className={styles.statText}>
                    <div className={styles.statTitle}>今日候位人數</div>
                    <div className={styles.statNumber}>{waitingCount}</div>
                  </div>
                  <div className={`${styles.statIcon} ${styles.peopleIcon}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <div className={styles.statText}>
                    <div className={styles.statTitle}>平均等待時間</div>
                    <div className={styles.statNumber}>{averageWaitTime} <span className={styles.statUnit}>分鐘</span></div>
                  </div>
                  <div className={`${styles.statIcon} ${styles.clockIcon}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                      <path d="m12.5 7-1 0 0 6 4.25 2.52.77-1.28-3.52-2.09z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <div className={styles.statText}>
                    <div className={styles.statTitle}>最近一次通知時間</div>
                    <div className={styles.statNumber}>{lastNotificationTime}</div>
                  </div>
                  <div className={`${styles.statIcon} ${styles.bellIcon}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)
}

export default DashboardPage
