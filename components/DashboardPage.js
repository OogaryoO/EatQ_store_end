import Image from 'next/image'
import styles from '../styles/Dashboard.module.css'
import { updateSeatingStatus } from '../lib/firebaseService'

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

export default DashboardPage
