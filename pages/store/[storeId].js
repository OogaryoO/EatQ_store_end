import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { ref, onValue } from 'firebase/database'
import { firestore, database } from '../../lib/firebase'
import styles from '../../styles/StorePage.module.css'

export default function StorePage() {
  const router = useRouter()
  const { storeId } = router.query
  
  const [store, setStore] = useState(null)
  const [menu, setMenu] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [businessHours, setBusinessHours] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('menu') // menu, announcements, hours
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (storeId) {
      fetchStoreData()
    }
  }, [storeId])

  const fetchStoreData = async () => {
    try {
      setLoading(true)
      
      // Fetch store info
      const storeDoc = await getDoc(doc(firestore, 'stores', storeId))
      if (storeDoc.exists()) {
        setStore({ id: storeDoc.id, ...storeDoc.data() })
      }

      // Fetch menu
      const menuSnapshot = await getDocs(collection(firestore, `stores/${storeId}/menu`))
      const menuData = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setMenu(menuData)

      // Fetch announcements
      const announcementsSnapshot = await getDocs(collection(firestore, `stores/${storeId}/announcements`))
      const announcementsData = announcementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setAnnouncements(announcementsData)

      // Fetch business hours
      const hoursSnapshot = await getDocs(collection(firestore, `stores/${storeId}/businessHours`))
      const hoursData = hoursSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setBusinessHours(hoursData)

      // Check if store is currently open (using realtime database)
      const statusRef = ref(database, `stores/${storeId}/isOpen`)
      onValue(statusRef, (snapshot) => {
        setIsOpen(snapshot.val() || false)
      })

    } catch (error) {
      console.error('Error fetching store data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToGallery = () => {
    router.push('/gallery')
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>載入中...</p>
      </div>
    )
  }

  if (!store) {
    return (
      <div className={styles.notFound}>
        <h2>找不到店家</h2>
        <button onClick={handleBackToGallery} className={styles.backBtn}>
          返回首頁
        </button>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{store.name} | EatQ</title>
        <meta name="description" content={store.description || `查看 ${store.name} 的菜單、營業時間與最新公告`} />
        <meta property="og:title" content={store.name} />
        <meta property="og:description" content={store.description} />
        {store.imageUrl && <meta property="og:image" content={store.imageUrl} />}
      </Head>

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <button onClick={handleBackToGallery} className={styles.backButton}>
            ← 返回
          </button>
          <h1 className={styles.logo}>EatQ</h1>
        </header>

        {/* Store Header */}
        <section className={styles.storeHeader}>
          <div className={styles.headerImage}>
            {store.imageUrl ? (
              <img src={store.imageUrl} alt={store.name} />
            ) : (
              <div className={styles.placeholderImage}>🍽️</div>
            )}
          </div>
          
          <div className={styles.storeHeaderInfo}>
            <div className={styles.storeTitle}>
              <h1>{store.name}</h1>
              <span className={`${styles.statusBadge} ${isOpen ? styles.open : styles.closed}`}>
                {isOpen ? '營業中' : '已打烊'}
              </span>
            </div>
            
            {store.category && (
              <span className={styles.category}>{store.category}</span>
            )}
            
            {store.description && (
              <p className={styles.description}>{store.description}</p>
            )}
            
            <div className={styles.contactInfo}>
              {store.address && (
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📍</span>
                  <span>{store.address}</span>
                </div>
              )}
              {store.phone && (
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📞</span>
                  <a href={`tel:${store.phone}`}>{store.phone}</a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'menu' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            菜單
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'announcements' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            公告活動
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'hours' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('hours')}
          >
            營業時間
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.content}>
          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div className={styles.menuSection}>
              {menu.length === 0 ? (
                <p className={styles.emptyMessage}>目前沒有菜單資料</p>
              ) : (
                <div className={styles.menuGrid}>
                  {menu.map((item) => (
                    <div key={item.id} className={styles.menuItem}>
                      {item.imageUrl && (
                        <div className={styles.menuImage}>
                          <img src={item.imageUrl} alt={item.name} />
                        </div>
                      )}
                      <div className={styles.menuInfo}>
                        <h3>{item.name}</h3>
                        {item.description && <p>{item.description}</p>}
                        <p className={styles.price}>NT$ {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className={styles.announcementsSection}>
              {announcements.length === 0 ? (
                <p className={styles.emptyMessage}>目前沒有公告</p>
              ) : (
                <div className={styles.announcementsList}>
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className={styles.announcementCard}>
                      <h3>{announcement.title}</h3>
                      <p>{announcement.content}</p>
                      {announcement.createdAt && (
                        <span className={styles.date}>
                          {new Date(announcement.createdAt.toDate()).toLocaleDateString('zh-TW')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Business Hours Tab */}
          {activeTab === 'hours' && (
            <div className={styles.hoursSection}>
              {businessHours.length === 0 ? (
                <p className={styles.emptyMessage}>目前沒有營業時間資料</p>
              ) : (
                <div className={styles.hoursTable}>
                  {businessHours.map((day) => (
                    <div key={day.id} className={styles.hoursRow}>
                      <span className={styles.dayName}>{day.day}</span>
                      <span className={styles.hoursTime}>
                        {day.closed ? '公休' : `${day.openTime} - ${day.closeTime}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
