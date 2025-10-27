import { useState, useReducer, useEffect } from 'react';
import { firestore } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import styles from '../styles/AppLayout.module.css';

// SVG Icons as components
const Icons = {
  Container: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  Text: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
    </svg>
  ),
  Image: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    </svg>
  ),
  Banner: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <path d="M2 10h20M2 14h20"/>
    </svg>
  ),
  Announcement: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18"/>
    </svg>
  ),
  QRCode: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  WaitingStatus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  BusinessHours: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Contact: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  SocialMedia: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
    </svg>
  ),
  Menu3Lines: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18"/>
    </svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Delete: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  ),
  Move: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
    </svg>
  ),
  GripDots: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="6" cy="6" r="1.5"/>
      <circle cx="12" cy="6" r="1.5"/>
      <circle cx="18" cy="6" r="1.5"/>
      <circle cx="6" cy="12" r="1.5"/>
      <circle cx="12" cy="12" r="1.5"/>
      <circle cx="18" cy="12" r="1.5"/>
      <circle cx="6" cy="18" r="1.5"/>
      <circle cx="12" cy="18" r="1.5"/>
      <circle cx="18" cy="18" r="1.5"/>
    </svg>
  ),
  Cross: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
};

// Available modules that can be dragged into containers
const AVAILABLE_MODULES = [
  { id: 'container', name: '容器', icon: 'Container', type: 'container', isContainer: true },
  { id: 'text', name: '文字模組', icon: 'Text', type: 'text', defaultContent: '點擊編輯文字內容' },
  { id: 'image', name: '圖片模組', icon: 'Image', type: 'image', defaultContent: null },
  { id: 'banner', name: '橫幅廣告', icon: 'Banner', type: 'banner', defaultContent: null },
  { id: 'announcement', name: '公告欄', icon: 'Announcement', type: 'announcement', defaultContent: '最新公告' },
  { id: 'menu', name: '菜單區塊', icon: 'Menu', type: 'menu', defaultContent: null },
  { id: 'qrcode', name: 'QR Code', icon: 'QRCode', type: 'qrcode', defaultContent: null },
  { id: 'waitingStatus', name: '候位狀態', icon: 'WaitingStatus', type: 'waitingStatus', defaultContent: null },
  { id: 'businessHours', name: '營業時間', icon: 'BusinessHours', type: 'businessHours', defaultContent: null },
  { id: 'contact', name: '聯絡資訊', icon: 'Contact', type: 'contact', defaultContent: '聯絡我們' },
  { id: 'socialMedia', name: '社群媒體', icon: 'SocialMedia', type: 'socialMedia', defaultContent: null }
];

// Reducer for managing layout configuration
const layoutReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_CONTAINER_TO_ROOT':
      return {
        ...state,
        containers: [...state.containers, { 
          id: `container-${Date.now()}`,
          type: 'container',
          children: [],
          alignment: 'vertical',
          style: { padding: '16px', backgroundColor: '#FFFFFF' }
        }]
      };
    case 'REMOVE_CONTAINER':
      // Helper function to recursively remove container
      const removeContainerRecursive = (containers, targetId) => {
        return containers.filter(item => {
          if (item.id === targetId) return false;
          if (item.type === 'container' && item.children) {
            item.children = removeContainerRecursive(item.children, targetId);
          }
          return true;
        });
      };
      return {
        ...state,
        containers: removeContainerRecursive(state.containers, action.payload)
      };
    case 'ADD_ITEM_TO_CONTAINER':
      // Helper function to add item to specific container (works recursively)
      const addItemToContainer = (containers, targetId, newItem, targetIndex) => {
        return containers.map(item => {
          if (item.id === targetId && item.type === 'container') {
            const newChildren = [...item.children];
            // If targetIndex is specified, insert at that position
            if (targetIndex !== undefined && targetIndex !== null) {
              newChildren.splice(targetIndex, 0, newItem);
            } else {
              // Otherwise append to end
              newChildren.push(newItem);
            }
            return {
              ...item,
              children: newChildren
            };
          }
          if (item.type === 'container' && item.children) {
            return {
              ...item,
              children: addItemToContainer(item.children, targetId, newItem, targetIndex)
            };
          }
          return item;
        });
      };
      
      const newItem = action.payload.module.isContainer 
        ? {
            id: `container-${Date.now()}`,
            type: 'container',
            children: [],
            alignment: 'vertical',
            style: { padding: '16px', backgroundColor: '#FFFFFF' }
          }
        : {
            ...action.payload.module,
            id: `${action.payload.module.type}-${Date.now()}`,
            content: action.payload.module.defaultContent
          };
      
      return {
        ...state,
        containers: addItemToContainer(
          state.containers, 
          action.payload.containerId, 
          newItem,
          action.payload.targetIndex
        )
      };
    case 'REMOVE_MODULE':
      // Helper function to recursively remove module
      const removeModuleRecursive = (containers, targetId) => {
        return containers.filter(item => {
          if (item.id === targetId) return false;
          if (item.type === 'container' && item.children) {
            item.children = removeModuleRecursive(item.children, targetId);
          }
          return true;
        });
      };
      return {
        ...state,
        containers: removeModuleRecursive(state.containers, action.payload)
      };
    case 'UPDATE_MODULE':
      // Helper function to recursively update module
      const updateModuleRecursive = (containers, targetId, updates) => {
        return containers.map(item => {
          if (item.id === targetId) {
            return { ...item, ...updates };
          }
          if (item.type === 'container' && item.children) {
            return {
              ...item,
              children: updateModuleRecursive(item.children, targetId, updates)
            };
          }
          return item;
        });
      };
      return {
        ...state,
        containers: updateModuleRecursive(state.containers, action.payload.id, action.payload.updates)
      };
    case 'UPDATE_CONTAINER_ALIGNMENT':
      const updateAlignmentRecursive = (containers, targetId, alignment) => {
        return containers.map(item => {
          if (item.id === targetId && item.type === 'container') {
            return { ...item, alignment };
          }
          if (item.type === 'container' && item.children) {
            return {
              ...item,
              children: updateAlignmentRecursive(item.children, targetId, alignment)
            };
          }
          return item;
        });
      };
      return {
        ...state,
        containers: updateAlignmentRecursive(state.containers, action.payload.containerId, action.payload.alignment)
      };
    case 'SET_LAYOUT':
      return {
        ...initialLayout,
        ...action.payload,
        containers: action.payload.containers || []
      };
    case 'MOVE_ITEM':
      // Move item from one location to another
      const { sourceId, targetContainerId, targetIndex } = action.payload;
      
      // Helper to find which container an item is in and its index
      let sourceContainerId = null;
      let sourceIndex = -1;
      
      const findSource = (containers, parentId = null) => {
        for (let i = 0; i < containers.length; i++) {
          const item = containers[i];
          if (item.id === sourceId) {
            sourceContainerId = parentId;
            sourceIndex = i;
            return true;
          }
          if (item.type === 'container' && item.children) {
            if (findSource(item.children, item.id)) {
              return true;
            }
          }
        }
        return false;
      };
      
      findSource(state.containers);
      
      // If moving within the same container, adjust the target index
      let adjustedTargetIndex = targetIndex;
      if (sourceContainerId === targetContainerId && sourceIndex !== -1 && sourceIndex < targetIndex) {
        // When moving down within same container, decrement target index
        // because we'll remove the item first
        adjustedTargetIndex = targetIndex - 1;
      }
      
      // First, find and remove the item from its current location
      let movedItem = null;
      const removeAndFind = (containers) => {
        return containers.map(item => {
          if (item.id === sourceId) {
            movedItem = JSON.parse(JSON.stringify(item)); // Deep clone
            return null; // Mark for removal
          }
          if (item.type === 'container' && item.children) {
            return {
              ...item,
              children: removeAndFind(item.children)
            };
          }
          return item;
        }).filter(item => item !== null); // Remove marked items
      };
      
      let newContainers = removeAndFind(state.containers);
      
      if (!movedItem) return state;
      
      // Then, insert it at the target location
      const insertItem = (containers, targetId, index) => {
        return containers.map(item => {
          if (item.id === targetId && item.type === 'container') {
            const newChildren = [...item.children];
            newChildren.splice(index, 0, movedItem);
            return { ...item, children: newChildren };
          }
          if (item.type === 'container' && item.children) {
            return {
              ...item,
              children: insertItem(item.children, targetId, index)
            };
          }
          return item;
        });
      };
      
      return {
        ...state,
        containers: insertItem(newContainers, targetContainerId, adjustedTargetIndex)
      };
    default:
      return state;
  }
};

// Initial layout state
const initialLayout = {
  containers: [],
  theme: {
    primaryColor: '#FF6B6B',
    secondaryColor: '#4ECDC4',
    backgroundColor: '#FFFFFF'
  }
};

export default function AppLayoutPage() {
  const [activeTab, setActiveTab] = useState('design'); // 'design' or 'preview'
  const [layout, dispatch] = useReducer(layoutReducer, initialLayout);
  const [draggedModule, setDraggedModule] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null); // For moving existing items
  const [dropTargetContainer, setDropTargetContainer] = useState(null);
  const [dropPosition, setDropPosition] = useState(null); // { containerId, index }
  const [editingModule, setEditingModule] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [leftPanelTab, setLeftPanelTab] = useState('modules'); // 'modules' or 'layout'
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // Load existing layout from Firestore
  useEffect(() => {
    loadLayout();
  }, []);

  const loadLayout = async () => {
    try {
      const docRef = doc(firestore, 'appLayout', 'currentLayout');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Ensure containers array exists
        if (!data.containers) {
          data.containers = [];
        }
        dispatch({ type: 'SET_LAYOUT', payload: data });
      }
    } catch (error) {
      console.error('Error loading layout:', error);
    }
  };

  // Save layout to Firestore
  const saveLayout = async () => {
    setIsSaving(true);
    setSaveStatus('');
    
    try {
      const docRef = doc(firestore, 'appLayout', 'currentLayout');
      await setDoc(docRef, {
        ...layout,
        lastUpdated: new Date().toISOString()
      });
      
      setSaveStatus('儲存成功！');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving layout:', error);
      setSaveStatus('儲存失敗，請重試');
    } finally {
      setIsSaving(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, module) => {
    setDraggedModule(module);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleRootDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleRootDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedModule && draggedModule.isContainer) {
      dispatch({ type: 'ADD_CONTAINER_TO_ROOT' });
      setDraggedModule(null);
      setDropTargetContainer(null);
    }
  };

  const handleContainerDragOver = (e, containerId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only handle draggedModule (new items from palette), not draggedItem (moving existing items)
    if (draggedModule && !draggedItem) {
      e.dataTransfer.dropEffect = 'copy';
      setDropTargetContainer(containerId);
    }
  };

  const handleContainerDrop = (e, containerId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only handle draggedModule (new items from palette), not draggedItem
    if (draggedModule && !draggedItem) {
      dispatch({ 
        type: 'ADD_ITEM_TO_CONTAINER', 
        payload: { containerId, module: draggedModule } 
      });
      setDraggedModule(null);
      setDropTargetContainer(null);
    }
  };

  const handleRemoveContainer = (containerId) => {
    dispatch({ type: 'REMOVE_CONTAINER', payload: containerId });
  };

  const handleRemoveModule = (moduleId) => {
    dispatch({ type: 'REMOVE_MODULE', payload: moduleId });
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
  };

  const handleSaveModuleEdit = (moduleId, updates) => {
    dispatch({ type: 'UPDATE_MODULE', payload: { id: moduleId, updates } });
    setEditingModule(null);
  };

  const handleCancelEdit = () => {
    setEditingModule(null);
  };

  const handleAlignmentChange = (containerId, alignment) => {
    dispatch({ type: 'UPDATE_CONTAINER_ALIGNMENT', payload: { containerId, alignment } });
  };

  // Helper function to find container by ID (recursive)
  const findContainerById = (containers, targetId) => {
    for (const container of containers) {
      if (container.id === targetId) {
        return container;
      }
      if (container.type === 'container' && container.children) {
        const found = findContainerById(container.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  // Container drag handlers for moving/reordering
  const handleItemDragStart = (e, item) => {
    e.stopPropagation();
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleItemDragEnd = (e) => {
    // Clean up drag state when drag ends (whether successful or not)
    setDraggedItem(null);
    setDropPosition(null);
  };

  const handleItemDragOver = (e, containerId, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedItem || draggedModule) {
      e.dataTransfer.dropEffect = draggedItem ? 'move' : 'copy';
      setDropPosition({ containerId, index });
    }
  };

  const handleItemDrop = (e, containerId, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Handle moving existing items
    if (draggedItem) {
      // Check if we're moving to the same position (within the same container)
      // In that case, we can skip the move operation
      dispatch({
        type: 'MOVE_ITEM',
        payload: {
          sourceId: draggedItem.id,
          targetContainerId: containerId,
          targetIndex: index
        }
      });
      setDraggedItem(null);
      setDropPosition(null);
    }
    // Handle adding new modules from the palette
    else if (draggedModule) {
      dispatch({ 
        type: 'ADD_ITEM_TO_CONTAINER', 
        payload: { 
          containerId, 
          module: draggedModule,
          targetIndex: index
        } 
      });
      
      setDraggedModule(null);
      setDropTargetContainer(null);
      setDropPosition(null);
    }
  };

  // New: Handle container-level drag over for smart positioning
  const handleContainerDragOverSmart = (e, containerId, children) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem && !draggedModule) return;
    
    e.dataTransfer.dropEffect = draggedItem ? 'move' : 'copy';
    
    // If container is empty, drop at index 0
    if (!children || children.length === 0) {
      setDropPosition({ containerId, index: 0 });
      return;
    }
    
    // Calculate which position to insert based on mouse Y position
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Get all child elements
    const childElements = Array.from(container.children);
    let insertIndex = children.length; // Default to end
    
    for (let i = 0; i < childElements.length; i++) {
      const childRect = childElements[i].getBoundingClientRect();
      const childMiddle = childRect.top + childRect.height / 2 - rect.top;
      
      if (mouseY < childMiddle) {
        insertIndex = i;
        break;
      }
    }
    
    setDropPosition({ containerId, index: insertIndex });
  };

  // New: Handle container-level drop for smart positioning
  const handleContainerDropSmart = (e, containerId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!dropPosition || dropPosition.containerId !== containerId) {
      // Fallback to append at end
      const index = 0;
      
      if (draggedItem) {
        dispatch({
          type: 'MOVE_ITEM',
          payload: {
            sourceId: draggedItem.id,
            targetContainerId: containerId,
            targetIndex: index
          }
        });
        setDraggedItem(null);
      } else if (draggedModule) {
        dispatch({ 
          type: 'ADD_ITEM_TO_CONTAINER', 
          payload: { 
            containerId, 
            module: draggedModule,
            targetIndex: index
          } 
        });
        setDraggedModule(null);
        setDropTargetContainer(null);
      }
    } else {
      // Use the calculated position
      if (draggedItem) {
        dispatch({
          type: 'MOVE_ITEM',
          payload: {
            sourceId: draggedItem.id,
            targetContainerId: containerId,
            targetIndex: dropPosition.index
          }
        });
        setDraggedItem(null);
      } else if (draggedModule) {
        dispatch({ 
          type: 'ADD_ITEM_TO_CONTAINER', 
          payload: { 
            containerId, 
            module: draggedModule,
            targetIndex: dropPosition.index
          } 
        });
        setDraggedModule(null);
        setDropTargetContainer(null);
      }
    }
    
    setDropPosition(null);
  };

  // Render module preview
  const renderModulePreview = (module, isInContainer = false, parentContainerId = null) => {
    const previewStyles = {
      text: { minHeight: '60px', background: '#FFFFFF', border: '1px solid #E0E0E0', padding: '12px' },
      image: { height: '200px', background: '#F5F5F5', border: '2px dashed #BDBDBD' },
      banner: { height: '120px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      announcement: { height: '80px', background: '#FFF4E6', border: '2px solid #FFB74D' },
      menu: { height: '200px', background: '#F5F5F5', border: '1px solid #E0E0E0' },
      qrcode: { height: '150px', background: '#FFFFFF', border: '2px dashed #9E9E9E' },
      waitingStatus: { height: '100px', background: '#E3F2FD', border: '2px solid #2196F3' },
      businessHours: { height: '120px', background: '#F1F8E9', border: '1px solid #8BC34A' },
      contact: { height: '90px', background: '#FFF8E1', border: '1px solid #FFC107' },
      socialMedia: { height: '70px', background: '#F3E5F5', border: '1px solid #9C27B0' }
    };

    const moduleInfo = AVAILABLE_MODULES.find(m => m.type === module.type);
    const IconComponent = moduleInfo && Icons[moduleInfo.icon];

    // Handler to prevent hover propagation to parent containers
    const handleModuleMouseEnter = (e) => {
      if (isInContainer) {
        e.stopPropagation();
        e.currentTarget.classList.add(styles.directHover);
      }
    };

    const handleModuleMouseLeave = (e) => {
      if (isInContainer) {
        e.stopPropagation();
        e.currentTarget.classList.remove(styles.directHover);
      }
    };

    return (
      <div 
        className={styles.modulePreviewItem} 
        style={previewStyles[module.type] || {}}
        onClick={() => isInContainer && handleEditModule(module)}
        onMouseEnter={handleModuleMouseEnter}
        onMouseLeave={handleModuleMouseLeave}
      >
        {isInContainer && (
          <div className={styles.moduleHoverBar}>
            <button
              className={styles.moduleMoveButton}
              draggable="true"
              onDragStart={(e) => {
                // Drag the module itself for reordering within container
                handleItemDragStart(e, module);
              }}
              onDragEnd={handleItemDragEnd}
              onClick={(e) => e.stopPropagation()}
              title="移動模組"
            >
              <Icons.GripDots />
            </button>
            <button
              className={styles.moduleEditButton}
              onClick={(e) => {
                e.stopPropagation();
                handleEditModule(module);
              }}
              title="編輯模組"
            >
              <Icons.Edit />
            </button>
            <button
              className={styles.moduleDeleteButton}
              onClick={(e) => {
                e.stopPropagation();
                // Delete only the module, not the container
                handleRemoveModule(module.id);
              }}
              title="刪除模組"
            >
              <Icons.Cross />
            </button>
          </div>
        )}
        
        {/* Show only content for text and image modules when they have content */}
        {module.type === 'text' && module.content ? (
          <div className={styles.textContent}>{module.content}</div>
        ) : module.type === 'image' && module.content ? (
          <img src={module.content} alt="Module" className={styles.moduleImage} />
        ) : (
          // Show icon and name for modules without content or non-text/image modules
          <>
            <span className={styles.moduleIcon}>
              {IconComponent && <IconComponent />}
            </span>
            <span className={styles.moduleName}>{moduleInfo?.name}</span>
          </>
        )}
      </div>
    );
  };

  // Render container with its children (recursive)
  const renderContainer = (container, isInContainer = false, isPreview = false) => {
    const hasContainerChildren = container.children?.some(child => child.type === 'container');
    const containerChildren = container.children?.filter(child => child.type === 'container') || [];
    const isEmpty = !container.children || container.children.length === 0;
    
    // Handler to prevent hover propagation to parent containers
    const handleContainerMouseEnter = (e) => {
      if (!isPreview && isInContainer && isEmpty) {
        e.stopPropagation();
        // Add a class to show the hover bar only for this specific container
        e.currentTarget.classList.add(styles.directHover);
      }
    };

    const handleContainerMouseLeave = (e) => {
      if (!isPreview && isInContainer && isEmpty) {
        e.stopPropagation();
        // Remove the class when mouse leaves
        e.currentTarget.classList.remove(styles.directHover);
      }
    };
    
    return (
      <div 
        key={container.id} 
        className={`${styles.containerWrapper} ${hasContainerChildren ? styles.hasNestedContainer : ''} ${dropTargetContainer === container.id ? styles.dragOver : ''} ${isPreview ? styles.previewMode : ''} ${selectedContainer === container.id ? styles.selectedContainer : ''}`}
        onDragOver={(e) => !isPreview && handleContainerDragOver(e, container.id)}
        onDrop={(e) => !isPreview && handleContainerDrop(e, container.id)}
        onMouseEnter={handleContainerMouseEnter}
        onMouseLeave={handleContainerMouseLeave}
        onClick={(e) => {
          if (!isPreview) {
            e.stopPropagation();
            setSelectedContainer(container.id);
          }
        }}
      >
        {!isPreview && isInContainer && isEmpty && (
          <div className={styles.containerHoverBar}>
            <button
              className={styles.hoverMoveButton}
              draggable="true"
              onDragStart={(e) => handleItemDragStart(e, container)}
              onDragEnd={handleItemDragEnd}
              onClick={(e) => e.stopPropagation()}
              title="移動容器"
            >
              <Icons.GripDots />
            </button>
            <button
              className={styles.hoverDeleteButton}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveContainer(container.id);
              }}
              title="刪除容器"
            >
              <Icons.Cross />
            </button>
          </div>
        )}
        <div 
          className={styles.containerContent}
          style={{
            flexDirection: container.alignment === 'horizontal' ? 'row' : 'column'
          }}
          onDragOver={(e) => !isPreview && handleContainerDragOverSmart(e, container.id, container.children)}
          onDrop={(e) => !isPreview && handleContainerDropSmart(e, container.id)}
        >
          {!container.children || container.children.length === 0 ? (
            <div className={styles.containerEmpty}>
              拖曳模組到此容器
            </div>
          ) : (
            <>
              {container.children.map((child, index) => (
                <div key={child.id} className={styles.childItemWrapper}>
                  {/* Visual indicator for drop position */}
                  {!isPreview && dropPosition?.containerId === container.id && dropPosition?.index === index && (
                    <div className={styles.dropIndicator} />
                  )}
                  {/* Render the item */}
                  {child.type === 'container' ? (
                    renderContainer(child, true, isPreview)
                  ) : (
                    renderModulePreview(child, !isPreview)
                  )}
                  {/* Visual indicator after last item */}
                  {!isPreview && index === container.children.length - 1 && 
                   dropPosition?.containerId === container.id && dropPosition?.index === index + 1 && (
                    <div className={styles.dropIndicator} />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Compact Header with Tabs - No Toggle Button */}
      <div className={styles.compactHeader}>
        <div className={styles.topBarTabs}>
          <button
            className={`${styles.topBarTab} ${activeTab === 'design' ? styles.activeTopTab : ''}`}
            onClick={() => setActiveTab('design')}
          >
            設計
          </button>
          <button
            className={`${styles.topBarTab} ${activeTab === 'preview' ? styles.activeTopTab : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            預覽
          </button>
        </div>

        <div className={styles.headerActions}>
          <button
            className={`${styles.saveButton} ${isSaving ? styles.saving : ''}`}
            onClick={saveLayout}
            disabled={isSaving}
          >
            {isSaving ? '儲存中...' : '儲存'}
          </button>
          {saveStatus && <span className={styles.saveStatus}>{saveStatus}</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {activeTab === 'design' ? (
          <div className={styles.designView}>
            {/* Left Panel - Available Modules */}
            <div className={styles.leftPanel}>
                <div className={styles.leftPanelTabs}>
                  <button
                    className={`${styles.leftPanelTab} ${leftPanelTab === 'modules' ? styles.activeLeftTab : ''}`}
                    onClick={() => setLeftPanelTab('modules')}
                  >
                    可用模組
                  </button>
                  <button
                    className={`${styles.leftPanelTab} ${leftPanelTab === 'layout' ? styles.activeLeftTab : ''}`}
                    onClick={() => setLeftPanelTab('layout')}
                  >
                    版面調整
                  </button>
                </div>

                {leftPanelTab === 'modules' ? (
                  <>
                    <p className={styles.panelSubtitle}>拖曳模組到容器中</p>
                    <div className={styles.moduleList}>
                      {AVAILABLE_MODULES.map((module) => {
                        const IconComponent = Icons[module.icon];
                        return (
                          <div
                            key={module.id}
                            className={styles.moduleItem}
                            draggable
                            onDragStart={(e) => handleDragStart(e, module)}
                          >
                            <span className={styles.moduleIcon}>
                              {IconComponent && <IconComponent />}
                            </span>
                            <span className={styles.moduleName}>{module.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <p className={styles.panelSubtitle}>點選容器後調整排列方式</p>
                    <div className={styles.layoutControlsPanel}>
                      {selectedContainer ? (
                        <>
                          <div className={styles.layoutControlGroup}>
                            <label className={styles.layoutControlLabel}>容器排列方式</label>
                            <div className={styles.alignmentButtonGroup}>
                              <button
                                className={`${styles.alignmentControlButton} ${
                                  layout.containers.find(c => c.id === selectedContainer)?.alignment === 'vertical' ||
                                  findContainerById(layout.containers, selectedContainer)?.alignment === 'vertical'
                                    ? styles.active : ''
                                }`}
                                onClick={() => handleAlignmentChange(selectedContainer, 'vertical')}
                                title="垂直排列"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 5v14M5 12l7 7 7-7"/>
                                </svg>
                                <span>垂直排列</span>
                              </button>
                              <button
                                className={`${styles.alignmentControlButton} ${
                                  layout.containers.find(c => c.id === selectedContainer)?.alignment === 'horizontal' ||
                                  findContainerById(layout.containers, selectedContainer)?.alignment === 'horizontal'
                                    ? styles.active : ''
                                }`}
                                onClick={() => handleAlignmentChange(selectedContainer, 'horizontal')}
                                title="水平排列"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                                <span>水平排列</span>
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className={styles.noSelectionMessage}>
                          <p>請先在右側選擇一個容器</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

            {/* Right Panel - Mobile Mockup */}
            <div className={styles.rightPanel}>
              <div className={styles.mockupContainer}>
                <div className={styles.phoneMockup}>
                  <div className={styles.phoneNotch}></div>
                  <div 
                    className={styles.phoneScreen}
                    onDragOver={handleRootDragOver}
                    onDrop={handleRootDrop}
                  >
                    {layout.containers.length === 0 ? (
                      <div className={styles.emptyState}>
                        <p>📱</p>
                        <p>拖曳「容器」模組到此處開始設計</p>
                      </div>
                    ) : (
                      <div className={styles.containerList}>
                        {layout.containers.map((container) => renderContainer(container, false, false))}
                      </div>
                    )}
                  </div>
                  <div className={styles.phoneHomeIndicator}></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.previewView}>
            <div className={styles.previewContainer}>
              <p className={styles.previewSubtitle}>這是顧客在 App 中看到的版面</p>
              <div className={styles.mockupContainer}>
                <div className={styles.phoneMockup}>
                  <div className={styles.phoneNotch}></div>
                  <div className={styles.phoneScreen}>
                    {layout.containers.length === 0 ? (
                      <div className={styles.emptyState}>
                        <p>📱</p>
                        <p>尚未設計任何版面</p>
                        <button
                          className={styles.switchTabButton}
                          onClick={() => setActiveTab('design')}
                        >
                          前往設計
                        </button>
                      </div>
                    ) : (
                      <div className={styles.containerList}>
                        {layout.containers.map((container) => renderContainer(container, false, true))}
                      </div>
                    )}
                  </div>
                  <div className={styles.phoneHomeIndicator}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Module Edit Modal */}
      {editingModule && (
        <div className={styles.modal} onClick={handleCancelEdit}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>編輯模組</h3>
              <button className={styles.modalClose} onClick={handleCancelEdit}>×</button>
            </div>
            <div className={styles.modalBody}>
              {editingModule.type === 'text' && (
                <div>
                  <label className={styles.formLabel}>文字內容</label>
                  <textarea
                    className={styles.textArea}
                    value={editingModule.content || ''}
                    onChange={(e) => setEditingModule({ ...editingModule, content: e.target.value })}
                    placeholder="輸入文字內容..."
                    rows="6"
                  />
                </div>
              )}
              {editingModule.type === 'image' && (
                <div>
                  <label className={styles.formLabel}>圖片網址</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={editingModule.content || ''}
                    onChange={(e) => setEditingModule({ ...editingModule, content: e.target.value })}
                    placeholder="輸入圖片網址 (https://...)"
                  />
                  {editingModule.content && (
                    <div className={styles.imagePreview}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={editingModule.content} alt="Preview" />
                    </div>
                  )}
                </div>
              )}
              {(editingModule.type === 'announcement' || editingModule.type === 'contact') && (
                <div>
                  <label className={styles.formLabel}>內容</label>
                  <textarea
                    className={styles.textArea}
                    value={editingModule.content || ''}
                    onChange={(e) => setEditingModule({ ...editingModule, content: e.target.value })}
                    placeholder="輸入內容..."
                    rows="4"
                  />
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={handleCancelEdit}>
                取消
              </button>
              <button 
                className={styles.confirmButton} 
                onClick={() => handleSaveModuleEdit(editingModule.id, { content: editingModule.content })}
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Layout Info Panel */}
      {/* <div className={styles.infoPanel}>
        <h3>目前配置</h3>
        <p>已使用容器數量: {layout.containers.length}</p>
        <details className={styles.jsonDetails}>
          <summary>查看 JSON 配置</summary>
          <pre className={styles.jsonPreview}>
            {JSON.stringify(layout, null, 2)}
          </pre>
        </details>
      </div> */}
    </div>
  );
}
