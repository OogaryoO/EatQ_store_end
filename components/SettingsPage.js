import { useState, useEffect } from 'react';
import styles from '../styles/Settings.module.css';
import { database } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';

const SettingsPage = () => {
  const [connectionStatus, setConnectionStatus] = useState('檢查中...');
  const [deviceType, setDeviceType] = useState('未知');

  // Detect device type
  useEffect(() => {
    const detectDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      
      // Check if it's a tablet
      if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent)) {
        return '平板電腦';
      }
      // Check if it's a mobile phone
      else if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
        return '手機';
      }
      // Check screen width as additional check
      else if (width >= 768 && width <= 1024) {
        return '平板電腦';
      }
      else if (width < 768) {
        return '手機';
      }
      // Desktop
      else {
        return '桌上型電腦';
      }
    };

    setDeviceType(detectDeviceType());

    // Update on window resize
    const handleResize = () => {
      setDeviceType(detectDeviceType());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check Firebase connection
  useEffect(() => {
    const connectedRef = ref(database, '.info/connected');
    
    const unsubscribe = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        setConnectionStatus('正常');
      } else {
        setConnectionStatus('斷線');
      }
    }, (error) => {
      console.error('Firebase connection error:', error);
      setConnectionStatus('錯誤');
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsHeader}>
        <h1 className={styles.settingsTitle}>系統設定</h1>
      </div>
      
      <div className={styles.settingsContent}>
        <div className={styles.settingsGrid}>
          {/* Basic Restaurant Info */}
          <div className={styles.infoCard}>
            <h2 className={styles.cardTitle}>基本資料</h2>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>餐廳名稱</span>
                <span className={styles.infoValue}>美味小館</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>餐廳類型</span>
                <span className={styles.infoValue}>中式料理</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>連絡電話</span>
                <span className={styles.infoValue}>02-1234-5678</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>地址</span>
                <span className={styles.infoValue}>台北市中正區...</span>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className={styles.infoCard}>
            <h2 className={styles.cardTitle}>系統資訊</h2>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>版本</span>
                <span className={styles.infoValue}>beta</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>最後更新</span>
                <span className={styles.infoValue}>2025/10/9</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>設備類型</span>
                <span className={styles.infoValue}>{deviceType}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>連線狀態</span>
                <span className={`${styles.infoValue} ${
                  connectionStatus === '正常' ? styles.statusNormal : 
                  connectionStatus === '檢查中...' ? styles.statusChecking : 
                  styles.statusError
                }`}>
                  {connectionStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
