import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from '../styles/Dashboard.module.css'
import { updateWaitingListStatus, removeFromWaitingList } from '../lib/firebaseService'
import { database } from '../lib/firebase'
import { ref, onValue, set } from 'firebase/database'

const WaitingManagementPage = ({ waitingList, setWaitingList }) => {
  const [isWaitingListEnabled, setIsWaitingListEnabled] = useState(true);
  
  // Listen for waiting list enabled/disabled status
  useEffect(() => {
    const waitingEnabledRef = ref(database, 'restaurant/waitingListEnabled');
    const unsubscribe = onValue(waitingEnabledRef, (snapshot) => {
      const status = snapshot.val();
      if (status !== null) {
        setIsWaitingListEnabled(status);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleWaitingList = async () => {
    try {
      const newStatus = !isWaitingListEnabled;
      await set(ref(database, 'restaurant/waitingListEnabled'), newStatus);
      setIsWaitingListEnabled(newStatus);
      console.log(`Waiting list ${newStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Failed to toggle waiting list:', error);
    }
  };
  
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
        <button 
          className={`${styles.toggleButton} ${isWaitingListEnabled ? styles.toggleEnabled : styles.toggleDisabled}`}
          onClick={toggleWaitingList}
        >
          {isWaitingListEnabled ? '✓ 候位功能已啟用' : '✕ 候位功能已停用'}
        </button>
      </div>
      {!isWaitingListEnabled && (
        <div className={styles.statusAlert}>
          <span className={styles.alertIcon}>⚠️</span>
          <span>候位功能目前已停用，顧客無法加入候位清單。點擊上方按鈕以啟用。</span>
        </div>
      )}
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
  )
}

export default WaitingManagementPage
