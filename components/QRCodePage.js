import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import styles from '../styles/QRCode.module.css';

const QRCodePage = () => {
  const [url, setUrl] = useState('https://example.com/restaurant');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const canvasRef = useRef(null);

  // Generate QR code whenever URL changes
  useEffect(() => {
    generateQRCode(url);
  }, [url]);

  const generateQRCode = async (text) => {
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: 280,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleDownloadPNG = () => {
    const link = document.createElement('a');
    link.download = 'restaurant-qrcode.png';
    link.href = qrCodeDataUrl;
    link.click();
  };

  const handleDownloadPDF = async () => {
    // For PDF generation, we'll use a simple approach with canvas
    // In a production app, you might want to use jsPDF library
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // A4 size at 72 DPI: 595x842 points
      canvas.width = 595;
      canvas.height = 842;
      
      // Fill white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Center the QR code
      const qrSize = 300;
      const x = (canvas.width - qrSize) / 2;
      const y = (canvas.height - qrSize) / 2;
      
      ctx.drawImage(img, x, y, qrSize, qrSize);
      
      // Add text
      ctx.fillStyle = '#000000';
      ctx.font = '20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('商家專屬 QR Code', canvas.width / 2, y - 40);
      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = '#666666';
      ctx.fillText('掃描 QR Code 查看餐廳頁面', canvas.width / 2, y + qrSize + 40);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'restaurant-qrcode.pdf.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    };
    
    img.src = qrCodeDataUrl;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>列印 QR Code</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: 'Inter', sans-serif;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            img {
              width: 300px;
              height: 300px;
              margin: 20px 0;
            }
            p {
              color: #666666;
              font-size: 14px;
            }
            @media print {
              @page {
                margin: 2cm;
              }
            }
          </style>
        </head>
        <body>
          <h1>商家專屬 QR Code</h1>
          <img src="${qrCodeDataUrl}" alt="QR Code" />
          <p>掃描 QR Code 查看餐廳頁面</p>
          <p>${url}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className={styles.qrCodePage}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.iconWrapper}>
            <svg 
              className={styles.qrIcon} 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
              <rect x="5" y="5" width="3" height="3" fill="currentColor"/>
              <rect x="16" y="5" width="3" height="3" fill="currentColor"/>
              <rect x="5" y="16" width="3" height="3" fill="currentColor"/>
              <rect x="14" y="14" width="3" height="3" fill="currentColor"/>
              <rect x="18" y="14" width="3" height="3" fill="currentColor"/>
              <rect x="14" y="18" width="3" height="3" fill="currentColor"/>
            </svg>
          </div>
          <h1 className={styles.title}>商家專屬 QR code</h1>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.qrSection}>
          <div className={styles.qrContainer}>
            {qrCodeDataUrl && (
              <img 
                src={qrCodeDataUrl} 
                alt="QR Code" 
                className={styles.qrImage}
              />
            )}
          </div>
          <p className={styles.qrDescription}>
            顧客掃描後可直接查看您的餐廳頁面
          </p>
        </div>

        <div className={styles.urlSection}>
          <label className={styles.urlLabel}>餐廳網址</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="請輸入您的餐廳網址"
            className={styles.urlInput}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button 
            className={styles.downloadButton}
            onClick={handleDownloadPNG}
          >
            下載PNG
          </button>
          <button 
            className={styles.downloadButton}
            onClick={handleDownloadPDF}
          >
            下載PDF
          </button>
          <button 
            className={styles.downloadButton}
            onClick={handlePrint}
          >
            列印
          </button>
        </div>

        <div className={styles.previewSection}>
          <button className={styles.previewButton}>
            預覽顧客掃描後的畫面
          </button>
        </div>

        <div className={styles.mockPhoneContainer}>
          <div className={styles.mockPhone}>
            {/* Empty gray rectangle for future preview screen */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
