import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '../lib/firebase'
import styles from '../styles/Gallery.module.css'

export default function Gallery() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      setLoading(true)
      // Fetch all stores from Firestore
      const storesCollection = collection(firestore, 'stores')
      const storesSnapshot = await getDocs(storesCollection)
      const storesData = storesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setStores(storesData)
    } catch (error) {
      console.error('Error fetching stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStores = stores.filter(store => 
    store.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStoreClick = (storeId) => {
    router.push(`/store/${storeId}`)
  }

  const handleLoginAsOwner = () => {
    // TODO: Implement authentication later
    // For now, go directly to dashboard
    router.push('/store-admin/dashboard')
  }

  return (
    <>
      <Head>
        <title>EatQ - 探索餐廳</title>
        <meta name="description" content="探索各式餐廳，查看菜單、營業時間與最新公告" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.logo}>EatQ</h1>
            <button 
              className={styles.ownerLoginBtn}
              onClick={handleLoginAsOwner}
            >
              店家登入
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h2 className={styles.heroTitle}>探索您喜愛的餐廳</h2>
          <p className={styles.heroSubtitle}>瀏覽菜單、查看營業時間、獲取最新優惠資訊</p>
          
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="搜尋餐廳名稱或類型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className={styles.searchIcon}>⌕</span>
          </div>
        </section>

        {/* Store Gallery */}
        <section className={styles.gallery}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>載入中...</p>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyIcon}>◯</p>
              <h3>目前沒有餐廳資料</h3>
              <p>請稍後再來查看，或聯繫我們了解如何加入平台</p>
            </div>
          ) : (
            <div className={styles.storeGrid}>
              {filteredStores.map((store) => (
                <div 
                  key={store.id}
                  className={styles.storeCard}
                  onClick={() => handleStoreClick(store.id)}
                >
                  <div className={styles.storeImage}>
                    {store.imageUrl ? (
                      <img src={store.imageUrl} alt={store.name} />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <span>🍽️</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.storeInfo}>
                    <h3 className={styles.storeName}>{store.name || '未命名餐廳'}</h3>
                    
                    {store.category && (
                      <span className={styles.storeCategory}>{store.category}</span>
                    )}
                    
                    {store.description && (
                      <p className={styles.storeDescription}>{store.description}</p>
                    )}
                    
                    <div className={styles.storeDetails}>
                      {store.address && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailIcon}>📍</span>
                          <span>{store.address}</span>
                        </div>
                      )}
                      
                      {store.phone && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailIcon}>📞</span>
                          <span>{store.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    {store.isOpen !== undefined && (
                      <div className={`${styles.statusBadge} ${store.isOpen ? styles.open : styles.closed}`}>
                        {store.isOpen ? '營業中' : '已打烊'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>&copy; 2025 EatQ. All rights reserved.</p>
            <div className={styles.footerLinks}>
              <a href="#">關於我們</a>
              <a href="#">聯絡我們</a>
              <a href="#">隱私政策</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
