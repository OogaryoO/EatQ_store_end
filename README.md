# EatQ Store End - Restaurant Management System

A modern Progressive Web Application (PWA) for restaurant queue and seating management built with Next.js.

## 🏪 About

EatQ Store End is the restaurant-side management system that allows restaurant staff to:
- Monitor seating availability in real-time
- Manage customer waiting queues
- Send notifications to customers
- Handle business hours and menu management
- Generate and manage QR codes for customer access
- Control announcement and notification systems

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (version 16.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/OogaryoO/EatQ_store_end.git
cd EatQ_store_end
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Add required assets** (Optional)
   - Place your dashboard icon as `dashboard-icon.png` in the `public/` folder
   - The system will work without this, showing a placeholder

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The application should be running successfully

### Build for Production

```bash
# Create an optimized production build
npm run build

# Start the production server
npm start
```

## 🛠️ Frontend Development Workflow

### Project Structure

```
EatQ_store_end/
├── pages/
│   ├── index.js          # Main application with all page components
│   ├── _app.js           # Next.js app configuration
│   ├── _document.js      # Custom document structure
│   └── api/              # API routes (if needed)
├── styles/
│   ├── Dashboard.module.css  # Main dashboard styles (CSS Modules)
│   ├── globals.css       # Global styles
│   └── Home.module.css   # Additional component styles
├── components/           # Reusable React components
├── public/              # Static assets (images, icons, etc.)
└── README.md           # This file
```

### Development Guidelines

#### 1. **Component Architecture**

The application uses a component-based architecture:

```javascript
// Each page is a separate component
const DashboardPage = ({ props }) => (
  <div className={styles.dashboardPage}>
    {/* Page content */}
  </div>
)

// Central content renderer
const renderPageContent = (activeItem, ...props) => {
  switch (activeItem) {
    case '控制台': return <DashboardPage {...props} />
    case '候位管理': return <WaitingManagementPage />
    // ... other cases
  }
}
```

#### 2. **Adding New Pages**

To add a new sidebar page:

1. **Create the component** in `pages/index.js`:
```javascript
const NewFeaturePage = () => (
  <div className={styles.dashboardPage}>
    <div className={styles.dashboardHeader}>
      <h1 className={styles.dashboardTitle}>新功能</h1>
    </div>
    <div className={styles.dashboardContent}>
      {/* Your feature content here */}
    </div>
  </div>
)
```

2. **Add to the renderer function**:
```javascript
case '新功能':
  return <NewFeaturePage />
```

3. **Update menuItems array** if adding a new sidebar option:
```javascript
const menuItems = [
  '控制台', '候位管理', '營業時間', 
  '菜單管理', '公告活動', '公告發送', 
  'QR code', '設定', '新功能' // Add here
]
```

#### 3. **Styling with CSS Modules**

The project uses CSS Modules for component-scoped styling:

```javascript
// Import styles
import styles from '../styles/Dashboard.module.css'

// Use in JSX
<div className={styles.yourClassName}>
```

**Adding new styles:**
1. Add CSS classes to `styles/Dashboard.module.css`
2. Use camelCase for class names (e.g., `.newFeature` not `.new-feature`)
3. Apply using `className={styles.newFeature}`

#### 4. **State Management**

Currently using React's `useState` for local state:

```javascript
// Add new state variables
const [newFeatureState, setNewFeatureState] = useState(defaultValue)

// Pass to components that need it
const renderPageContent = (activeItem, newFeatureState, setNewFeatureState) => {
  // ... switch cases
}
```

#### 5. **Icon and Asset Management**

- **Static assets**: Place in `/public` folder
- **Icons**: Use SVG icons inline for better performance
- **Images**: Use Next.js `Image` component for optimization

```javascript
import Image from 'next/image'

<Image 
  src="/your-image.png" 
  alt="Description" 
  width={48}
  height={48}
/>
```

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting (if configured)
npm run lint

# Run tests (if configured)
npm test
```

### Code Quality & Best Practices

1. **Component Organization**: Keep components small and focused
2. **CSS Modules**: Use scoped CSS to avoid style conflicts  
3. **State Management**: Keep state as local as possible
4. **Responsive Design**: Use CSS Grid/Flexbox with media queries
5. **Accessibility**: Use semantic HTML and proper alt texts
6. **Performance**: Leverage Next.js features like Image optimization

### Current Features Status

- ✅ **Sidebar Navigation** - Fully functional
- ✅ **Dashboard/控制台** - Complete with statistics and controls
- ✅ **Seating Status Toggle** - Working toggle with dynamic actions
- 🚧 **Queue Management/候位管理** - Framework ready
- 🚧 **Business Hours/營業時間** - Framework ready  
- 🚧 **Menu Management/菜單管理** - Framework ready
- 🚧 **Announcements/公告活動** - Framework ready
- 🚧 **Notification System/公告發送** - Framework ready
- 🚧 **QR Code Management** - Framework ready
- 🚧 **Settings/設定** - Framework ready

### Browser Support

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

### Troubleshooting

**Image not loading?**
- Ensure the image file is in the `/public` folder
- Check the file path and name match exactly
- Image should be accessible at `http://localhost:3000/your-image.png`

**Styles not applying?**
- Verify CSS class names use camelCase in CSS Modules
- Check that the import path is correct
- Ensure CSS file is saved

**Hot reload not working?**
- Restart the development server: `Ctrl+C` then `npm run dev`
- Clear browser cache
- Check console for errors

## 📦 Dependencies

Key dependencies used in this project:
- **Next.js** - React framework with SSR/SSG
- **React** - UI library  
- **CSS Modules** - Scoped styling solution

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes following the development workflow
3. Test thoroughly on different screen sizes
4. Commit with clear, descriptive messages
5. Push and create a pull request

## 📄 License

This project is part of the EatQ restaurant management system.

---

**Need help?** Check the troubleshooting section above or create an issue in the repository.
