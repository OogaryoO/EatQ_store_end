import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from '../styles/Dashboard.module.css'

// Import Firebase services
import { database, firestore } from '../lib/firebase'
import { ref, onValue, set } from 'firebase/database'
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { updateSeatingStatus, addToWaitingList, updateWaitingListStatus, removeFromWaitingList, generateTicketNumber } from '../lib/firebaseService'

// Dashboard Page Component
const DashboardPage = ({ isSeatingAvailable, setIsSeatingAvailable, waitingCount, averageWaitTime, lastNotificationTime }) => (
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
        <div className={styles.statusButtons}>
          <button 
            className={`${styles.statusButton} ${isSeatingAvailable ? styles.available : styles.full}`}
            onClick={async () => {
              try {
                await updateSeatingStatus(!isSeatingAvailable);
              } catch (error) {
                console.error('Failed to update seating status:', error);
              }
            }}
          >
            {isSeatingAvailable ? '有空位' : '客滿'}
          </button>
          <div className={styles.actionButton}>
            {isSeatingAvailable ? '立即抽號碼牌' : '通知下一位'}
          </div>
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
      
      <div className={styles.actionCardsSection}>
        <div className={styles.actionGrid}>
          <div className={styles.actionCard}>
            <div className={styles.actionText}>查看候位清單</div>
          </div>
          
          <div className={styles.actionCard}>
            <div className={styles.actionText}>公告發送</div>
          </div>
          
          <div className={styles.actionCard}>
            <div className={styles.actionText}>QR code 管理</div>
          </div>
        </div>
      </div>

      <div className={styles.waitingStatsSection}>
        <div className={styles.waitingGrid}>
          <div className={styles.waitingCard}>
            <div className={styles.waitingContent}>
              <div className={styles.waitingText}>  
                <div className={styles.waitingTitle}>目前候位狀態</div>
                <div className={styles.waitingNumber}>
                  <p>目前共有</p>
                  {waitingCount}
                  <p>組客人等待中</p>
                </div>
              </div>
              <div className={styles.waitingStatsBlock}>
                等待中
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Waiting Management Page Component
const WaitingManagementPage = ({ waitingList, setWaitingList }) => {
  
  const handleNotifyCustomer = async (customerId) => {
    try {
      await updateWaitingListStatus(customerId, 'notified');
      console.log('Customer notified successfully');
    } catch (error) {
      console.error('Failed to notify customer:', error);
    }
  };

  const handleCompleteCustomer = async (customerId) => {
    try {
      await removeFromWaitingList(customerId);
      console.log('Customer completed successfully');
    } catch (error) {
      console.error('Failed to complete customer:', error);
    }
  };

  const handleCancelCustomer = async (customerId) => {
    try {
      await removeFromWaitingList(customerId);
      console.log('Customer cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel customer:', error);
    }
  };

  const formatWaitTime = (createdAt) => {
    if (!createdAt) return '00:00';
    
    const now = new Date();
    const created = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
  <div className={styles.dashboardPage}>
    <div className={styles.dashboardHeader}>
      <div className={styles.dashboardIconContainer}>
        <Image 
          src="/dashboard-icon.png" 
          alt="候位清單圖示" 
          width={48}
          height={48}
          className={styles.dashboardIcon}
          onError={() => console.log('Image failed to load')}
        />
      </div>
      <h1 className={styles.dashboardTitle}>候位清單</h1>
    </div>
    <div className={styles.dashboardContent}>
      <div className={styles.waitingListSection}>
        <div className={styles.waitingListTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell}>號碼牌</div>
            <div className={styles.tableHeaderCell}>姓名</div>
            <div className={styles.tableHeaderCell}>聯絡方式</div>
            <div className={styles.tableHeaderCell}>狀態</div>
            <div className={styles.tableHeaderCell}>倒數計時</div>
            <div className={styles.tableHeaderCell}>操作</div>
          </div>
          
          <div className={styles.tableBody}>
            {waitingList.map((customer) => (
              <div key={customer.id} className={styles.tableRow}>
                <div className={styles.tableCell}>{customer.ticketNumber}</div>
                <div className={styles.tableCell}>{customer.name}</div>
                <div className={styles.tableCell}>{customer.phone}</div>
                <div className={styles.tableCell}>
                  <span className={customer.status === 'waiting' ? styles.statusWaiting : styles.statusNotified}>
                    {customer.status === 'waiting' ? '等待中' : '已通知'}
                  </span>
                </div>
                <div className={styles.tableCell}>{formatWaitTime(customer.createdAt)}</div>
                <div className={styles.tableCell}>
                  {customer.status === 'waiting' ? (
                    <>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => handleNotifyCustomer(customer.id)}
                      >
                        通知
                      </button>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => handleCancelCustomer(customer.id)}
                      >
                        取消
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => handleCompleteCustomer(customer.id)}
                      >
                        完成
                      </button>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => handleCancelCustomer(customer.id)}
                      >
                        取消
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {waitingList.length === 0 && (
              <div className={styles.tableRow}>
                <div className={styles.tableCell} style={{textAlign: 'center', padding: '20px'}} colSpan="6">
                  目前沒有候位客人
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}

// Business Hours Page Component  
const BusinessHoursPage = () => (
  <div className={styles.dashboardPage}>
    <div className={styles.dashboardHeader}>
      <h1 className={styles.dashboardTitle}>營業時間</h1>
    </div>
    <div className={styles.dashboardContent}>
      <p>營業時間設定功能開發中...</p>
    </div>
  </div>
)

// Menu Management Page Component
const MenuManagementPage = () => (
  <div className={styles.dashboardPage}>
    <div className={styles.dashboardHeader}>
      <h1 className={styles.dashboardTitle}>菜單管理</h1>
    </div>
    <div className={styles.dashboardContent}>
      <p>菜單管理功能開發中...</p>
    </div>
  </div>
)

// Announcements Page Component
const AnnouncementsPage = () => (
  <div className={styles.dashboardPage}>
    <div className={styles.dashboardHeader}>
      <h1 className={styles.dashboardTitle}>公告活動</h1>
    </div>
    <div className={styles.dashboardContent}>
      <p>公告活動管理功能開發中...</p>
    </div>
  </div>
)

// Notification Sending Page Component
const NotificationSendingPage = () => (
  <div className={styles.dashboardPage}>
    <div className={styles.dashboardHeader}>
      <h1 className={styles.dashboardTitle}>公告發送</h1>
    </div>
    <div className={styles.dashboardContent}>
      <p>公告發送功能開發中...</p>
    </div>
  </div>
)

// QR Code Page Component
const QRCodePage = () => (
  <div className={styles.dashboardPage}>
    <div className={styles.dashboardHeader}>
      <h1 className={styles.dashboardTitle}>QR code</h1>
    </div>
    <div className={styles.dashboardContent}>
      <p>QR code 管理功能開發中...</p>
    </div>
  </div>
)

// Settings Page Component
const SettingsPage = () => (
  <div className={styles.dashboardPage}>
    <div className={styles.dashboardHeader}>
      <h1 className={styles.dashboardTitle}>設定</h1>
    </div>
    <div className={styles.dashboardContent}>
      <p>系統設定功能開發中...</p>
    </div>
  </div>
)




// Page Content Renderer
const renderPageContent = (activeItem, isSeatingAvailable, setIsSeatingAvailable, waitingList, setWaitingList, waitingCount, averageWaitTime, lastNotificationTime) => {
  switch (activeItem) {
    case '控制台':
      return <DashboardPage isSeatingAvailable={isSeatingAvailable} setIsSeatingAvailable={setIsSeatingAvailable} waitingCount={waitingCount} averageWaitTime={averageWaitTime} lastNotificationTime={lastNotificationTime} />
    case '候位管理':
      return <WaitingManagementPage waitingList={waitingList} setWaitingList={setWaitingList} />
    case '營業時間':
      return <BusinessHoursPage />
    case '菜單管理':
      return <MenuManagementPage />
    case '公告活動':
      return <AnnouncementsPage />
    case '公告發送':
      return <NotificationSendingPage />
    case 'QR code':
      return <QRCodePage />
    case '設定':
      return <SettingsPage />
    default:
      return <DashboardPage isSeatingAvailable={isSeatingAvailable} setIsSeatingAvailable={setIsSeatingAvailable} waitingCount={waitingCount} averageWaitTime={averageWaitTime} lastNotificationTime={lastNotificationTime} />
  }
}

export default function Home() {
  const [activeItem, setActiveItem] = useState('控制台')
  const [isSeatingAvailable, setIsSeatingAvailable] = useState(true)
  const [waitingList, setWaitingList] = useState([])
  const [waitingCount, setWaitingCount] = useState(0)
  const [averageWaitTime, setAverageWaitTime] = useState(18)
  const [lastNotificationTime, setLastNotificationTime] = useState('13:42')
  
  const menuItems = [
    '控制台',
    '候位管理',
    '營業時間',
    '菜單管理',
    '公告活動',
    '公告發送',
    'QR code',
    '設定'
  ]

  // Firebase real-time listeners
  useEffect(() => {
    // Listen for seating availability changes
    const seatingRef = ref(database, 'restaurant/seatingAvailable');
    const unsubscribeSeating = onValue(seatingRef, (snapshot) => {
      const status = snapshot.val();
      if (status !== null) {
        setIsSeatingAvailable(status);
      }
    });

    // Listen for waiting list changes using Firestore
    const waitingListRef = collection(firestore, 'waitingList');
    const unsubscribeWaiting = onSnapshot(waitingListRef, (snapshot) => {
      const waitingData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWaitingList(waitingData);
      setWaitingCount(waitingData.length);
      
      // Update last notification time if there's a recent notification
      const recentNotified = waitingData.find(item => item.status === 'notified' && item.notifiedAt);
      if (recentNotified && recentNotified.notifiedAt) {
        const notifiedTime = new Date(recentNotified.notifiedAt.toDate());
        setLastNotificationTime(notifiedTime.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }));
      }
    });

    // Listen for statistics changes
    const statsRef = ref(database, 'statistics/averageWaitTime');
    const unsubscribeStats = onValue(statsRef, (snapshot) => {
      const avgTime = snapshot.val();
      if (avgTime !== null) {
        setAverageWaitTime(avgTime);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeSeating();
      unsubscribeWaiting();
      unsubscribeStats();
    };
  }, []);

  return (
    <>
      <Head>
        {/* Meta tags from your Figma export */}
        <title>PWA Management System</title>
        <meta charSet="utf-8" />
        <meta name="entrypoint_variant" content="figma_app" />
        <meta name="is_preload_streaming" content="true" />
        <meta name="twitter:card" content="player" />
        <meta name="twitter:site" content="@figma" />
        <meta name="twitter:title" content="PWA Management System" />
        <meta property="og:description" content="Created with Figma" />
        <meta name="description" content="Created with Figma" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div className={styles.appContainer}>
        <div className={styles.sidebar}>
          {menuItems.map((item) => (
            <div
              key={item}
              className={`${styles.sidebarItem} ${activeItem === item ? styles.active : ''}`}
              onClick={() => setActiveItem(item)}
            >
              {item}
            </div>
          ))}
        </div>
        
        <div className={styles.mainContent}>    
          {renderPageContent(activeItem, isSeatingAvailable, setIsSeatingAvailable, waitingList, setWaitingList, waitingCount, averageWaitTime, lastNotificationTime)}
        </div>
      </div>
    </>
  )
}