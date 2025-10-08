import Head from 'next/head'
import { useState, useEffect } from 'react'
import styles from '../styles/Dashboard.module.css'

// Import Firebase services
import { database, firestore } from '../lib/firebase'
import { ref, onValue } from 'firebase/database'
import { collection, onSnapshot } from 'firebase/firestore'

// Import page components
import DashboardPage from '../components/DashboardPage'
import WaitingManagementPage from '../components/WaitingManagementPage'
import BusinessHoursPage from '../components/BusinessHoursPage'
import MenuManagementPage from '@/components/MenuManagementPage'
import AnnouncementsPage from '@/components/AnnouncementsPage'
import NotificationSendingPage from '@/components/NotificationSendingPage'
import QRCodePage from '@/components/QRCodePage'

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
const renderPageContent = (activeItem, isSeatingAvailable, setIsSeatingAvailable, waitingList, setWaitingList, waitingCount, averageWaitTime, lastNotificationTime, setActiveItem) => {
  switch (activeItem) {
    case '控制台':
      return <DashboardPage 
        isSeatingAvailable={isSeatingAvailable} 
        setIsSeatingAvailable={setIsSeatingAvailable} 
        waitingCount={waitingCount} 
        averageWaitTime={averageWaitTime} 
        lastNotificationTime={lastNotificationTime} 
      />
    case '候位管理':
      return <WaitingManagementPage 
        waitingList={waitingList} 
        setWaitingList={setWaitingList} 
      />
    case '營業時間':
      return <BusinessHoursPage />
    case '菜單管理':
      return <MenuManagementPage />
    case '公告活動':
      return <AnnouncementsPage />
    case '公告發送':
      return <NotificationSendingPage 
        waitingCount={waitingCount}
        onBackToDashboard={() => setActiveItem('控制台')}
      />
    case 'QR code':
      return <QRCodePage />
    case '設定':
      return <SettingsPage />
    default:
      return <DashboardPage 
        isSeatingAvailable={isSeatingAvailable} 
        setIsSeatingAvailable={setIsSeatingAvailable} 
        waitingCount={waitingCount} 
        averageWaitTime={averageWaitTime} 
        lastNotificationTime={lastNotificationTime} 
      />
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
          {renderPageContent(activeItem, isSeatingAvailable, setIsSeatingAvailable, waitingList, setWaitingList, waitingCount, averageWaitTime, lastNotificationTime, setActiveItem)}
        </div>
      </div>
    </>
  )
}