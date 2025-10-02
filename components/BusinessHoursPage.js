import { useState, useEffect } from 'react'
import styles from '../styles/Dashboard.module.css'

const BusinessHoursPage = () => {
  const [weekdayOpen, setWeekdayOpen] = useState(true)
  const [weekendOpen, setWeekendOpen] = useState(true)
  const [weekdayStart, setWeekdayStart] = useState('11:00')
  const [weekdayEnd, setWeekdayEnd] = useState('23:00')
  const [weekendStart, setWeekendStart] = useState('11:00')
  const [weekendEnd, setWeekendEnd] = useState('23:00')
  const [todayHours, setTodayHours] = useState('11:00 - 23:00')
  
  // Special date settings
  const [specialDate, setSpecialDate] = useState('')
  const [specialDescription, setSpecialDescription] = useState('')
  const [specialStatus, setSpecialStatus] = useState('open')
  const [specialStartTime, setSpecialStartTime] = useState('11:00')
  const [specialEndTime, setSpecialEndTime] = useState('23:00')
  const [specialDates, setSpecialDates] = useState([])

  // Update today's hours based on current day
  useEffect(() => {
    const today = new Date().getDay()
    const isWeekend = today === 0 || today === 6 // Sunday or Saturday
    
    if (isWeekend) {
      if (weekendOpen) {
        setTodayHours(`${weekendStart} - ${weekendEnd}`)
      } else {
        setTodayHours('休息')
      }
    } else {
      if (weekdayOpen) {
        setTodayHours(`${weekdayStart} - ${weekdayEnd}`)
      } else {
        setTodayHours('休息')
      }
    }
  }, [weekdayOpen, weekendOpen, weekdayStart, weekdayEnd, weekendStart, weekendEnd])

  const handleAddSpecialDate = () => {
    if (!specialDate) {
      alert('請輸入日期')
      return
    }

    const newSpecialDate = {
      id: Date.now(),
      date: specialDate,
      description: specialDescription,
      status: specialStatus,
      startTime: specialStatus === 'open' ? specialStartTime : '',
      endTime: specialStatus === 'open' ? specialEndTime : ''
    }

    setSpecialDates([...specialDates, newSpecialDate])
    
    // Reset form
    setSpecialDate('')
    setSpecialDescription('')
    setSpecialStatus('open')
    setSpecialStartTime('11:00')
    setSpecialEndTime('23:00')
  }

  const handleDeleteSpecialDate = (id) => {
    setSpecialDates(specialDates.filter(date => date.id !== id))
  }

  return (
    <div className={styles.dashboardPage}>
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
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className={styles.dashboardTitle}>營業時間設定</h1>
      </div>

      <div className={styles.dashboardContent}>
        {/* Today's business hours */}
        <div className={styles.seatingStatusSection}>
          <h3 className={styles.sectionTitle}>今日營業時間</h3>
          <div className={styles.todayHoursDisplay}>
            {todayHours}
          </div>
        </div>

        {/* Weekday and Weekend hours */}
        <div className={styles.statisticsSection} style={{ marginTop: '24px' }}>
          <div className={styles.statsGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
            {/* Weekday hours */}
            <div className={styles.statCard}>
              <h3 className={styles.scheduleTitle}>平日營業時間</h3>
              <p className={styles.scheduleSubtitle}>周一至周五</p>
              
              <div className={styles.toggleContainer}>
                <span className={styles.toggleLabel}>營業中</span>
                <button 
                  className={`${styles.toggle} ${weekdayOpen ? styles.toggleOn : styles.toggleOff}`}
                  onClick={() => setWeekdayOpen(!weekdayOpen)}
                  aria-label="Toggle weekday hours"
                >
                  <span className={styles.toggleSlider}></span>
                </button>
              </div>

              {weekdayOpen && (
                <div className={styles.timeInputsContainer}>
                  <div className={styles.timeInputGroup}>
                    <label className={styles.timeInputLabel}>開始時間</label>
                    <input 
                      type="time" 
                      value={weekdayStart}
                      onChange={(e) => setWeekdayStart(e.target.value)}
                      className={styles.timeInputField}
                    />
                  </div>
                  <div className={styles.timeInputGroup}>
                    <label className={styles.timeInputLabel}>結束時間</label>
                    <input 
                      type="time" 
                      value={weekdayEnd}
                      onChange={(e) => setWeekdayEnd(e.target.value)}
                      className={styles.timeInputField}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Weekend hours */}
            <div className={styles.statCard}>
              <h3 className={styles.scheduleTitle}>假日營業時間</h3>
              <p className={styles.scheduleSubtitle}>周六至周日</p>
              
              <div className={styles.toggleContainer}>
                <span className={styles.toggleLabel}>營業中</span>
                <button 
                  className={`${styles.toggle} ${weekendOpen ? styles.toggleOn : styles.toggleOff}`}
                  onClick={() => setWeekendOpen(!weekendOpen)}
                  aria-label="Toggle weekend hours"
                >
                  <span className={styles.toggleSlider}></span>
                </button>
              </div>

              {weekendOpen && (
                <div className={styles.timeInputsContainer}>
                  <div className={styles.timeInputGroup}>
                    <label className={styles.timeInputLabel}>開始時間</label>
                    <input 
                      type="time" 
                      value={weekendStart}
                      onChange={(e) => setWeekendStart(e.target.value)}
                      className={styles.timeInputField}
                    />
                  </div>
                  <div className={styles.timeInputGroup}>
                    <label className={styles.timeInputLabel}>結束時間</label>
                    <input 
                      type="time" 
                      value={weekendEnd}
                      onChange={(e) => setWeekendEnd(e.target.value)}
                      className={styles.timeInputField}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Special Date Settings */}
        <div className={styles.seatingStatusSection} style={{ marginTop: '32px' }}>
          <h3 className={styles.sectionTitle}>特殊日期設定</h3>
          
          <div className={styles.specialDateForm}>
            <div className={styles.specialDateInputs}>
              <div className={styles.specialDateInputGroup}>
                <label className={styles.timeInputLabel}>日期</label>
                <input 
                  type="date" 
                  value={specialDate}
                  onChange={(e) => setSpecialDate(e.target.value)}
                  className={styles.timeInputField}
                  placeholder="yyyy/mm/dd"
                />
              </div>
              
              <div className={styles.specialDateInputGroup}>
                <label className={styles.timeInputLabel}>說明</label>
                <input 
                  type="text" 
                  value={specialDescription}
                  onChange={(e) => setSpecialDescription(e.target.value)}
                  className={styles.timeInputField}
                  placeholder="例如：春節、國慶日"
                />
              </div>
              
              <div className={styles.specialDateInputGroup}>
                <label className={styles.timeInputLabel}>營業狀態</label>
                <select 
                  value={specialStatus}
                  onChange={(e) => setSpecialStatus(e.target.value)}
                  className={styles.timeInputField}
                >
                  <option value="open">營業</option>
                  <option value="close">休息</option>
                </select>
              </div>
              
              {specialStatus === 'open' && (
                <>
                  <div className={styles.specialDateInputGroup}>
                    <label className={styles.timeInputLabel}>開始時間</label>
                    <input 
                      type="time" 
                      value={specialStartTime}
                      onChange={(e) => setSpecialStartTime(e.target.value)}
                      className={styles.timeInputField}
                    />
                  </div>
                  
                  <div className={styles.specialDateInputGroup}>
                    <label className={styles.timeInputLabel}>結束時間</label>
                    <input 
                      type="time" 
                      value={specialEndTime}
                      onChange={(e) => setSpecialEndTime(e.target.value)}
                      className={styles.timeInputField}
                    />
                  </div>
                </>
              )}
            </div>
            
            <button 
              className={styles.addSpecialDateButton}
              onClick={handleAddSpecialDate}
            >
              新增
            </button>
          </div>

          {/* Special Dates List */}
          {specialDates.length > 0 && (
            <div className={styles.specialDatesList}>
              {specialDates.map((item) => (
                <div key={item.id} className={styles.specialDateItem}>
                  <div className={styles.specialDateInfo}>
                    <span className={styles.specialDateDate}>{item.date}</span>
                    <span className={styles.specialDateDescription}>{item.description}</span>
                    <span className={item.status === 'open' ? styles.specialDateOpen : styles.specialDateClosed}>
                      {item.status === 'open' ? '營業' : '休息'}
                    </span>
                    {item.status === 'open' && (
                      <span className={styles.specialDateTime}>
                        {item.startTime} - {item.endTime}
                      </span>
                    )}
                  </div>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteSpecialDate(item.id)}
                  >
                    刪除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save button */}
        <div className={styles.saveButtonSection}>
          <button className={styles.saveButton}>
            儲存設定
          </button>
        </div>
      </div>
    </div>
  )
}

export default BusinessHoursPage
