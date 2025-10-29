# Flutter Integration Guide - Dynamic Layout System

## Overview
This guide explains how to fetch and render the dynamic layout from your Next.js admin panel in your Flutter mobile app.

## Architecture

```
┌─────────────────────┐         ┌──────────────┐         ┌─────────────────┐
│  Next.js Admin      │         │   Firestore  │         │   Flutter App   │
│  (Store End)        │────────>│   Database   │<────────│   (Customer)    │
│                     │  Save   │              │  Fetch  │                 │
│  - Design Layout    │         │  appLayout/  │         │  - Render UI    │
│  - Edit Modules     │         │  currentLayout│         │  - Show Content │
└─────────────────────┘         └──────────────┘         └─────────────────┘
         │                             │
         │ Export (Optional)           │
         v                             │
┌─────────────────────┐                │
│  Firebase Storage   │                │
│  app_layouts/       │<───────────────┘
│  current_layout.json│  (Backup/Fallback)
└─────────────────────┘
```

## Recommended Approach: Direct Firestore Access

### Pros:
✅ **Real-time updates** - Changes reflect immediately in the app
✅ **No manual export** - Save button updates both web and mobile
✅ **Efficient** - No duplicate data storage
✅ **Native Firebase SDK** - Built-in caching, offline support
✅ **Type-safe** - Firestore handles complex nested structures

### Storage Structure:
```
Firestore Database
└── appLayout (collection)
    └── currentLayout (document)
        ├── containers: [
        │   {
        │     id: "container-1730123456789",
        │     type: "container",
        │     alignment: "vertical",
        │     children: [
        │       {
        │         id: "text-1730123456790",
        │         type: "text",
        │         content: "歡迎光臨"
        │       },
        │       {
        │         id: "image-1730123456791",
        │         type: "image",
        │         content: "https://example.com/banner.jpg"
        │       }
        │     ]
        │   }
        │ ]
        ├── theme: {
        │   primaryColor: "#FF6B6B",
        │   secondaryColor: "#4ECDC4",
        │   backgroundColor: "#FFFFFF"
        │ }
        └── lastUpdated: "2025-10-28T12:34:56.789Z"
```

---

## Flutter Implementation

### 1. Add Dependencies

```yaml
# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  cloud_firestore: ^4.13.0
  firebase_core: ^2.24.0
  cached_network_image: ^3.3.0  # For image modules
```

### 2. Initialize Firebase

```dart
// lib/main.dart
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: FirebaseOptions(
      apiKey: "AIzaSyBNF-GdO7fKvHl-EWnA1z3PmMixQ62vqis",
      authDomain: "eatq-2025-tw.firebaseapp.com",
      projectId: "eatq-2025-tw",
      storageBucket: "eatq-2025-tw.firebasestorage.app",
      messagingSenderId: "520220680979",
      appId: "1:520220680979:web:59bc85f3b99665e2b4f0e6",
    ),
  );
  runApp(MyApp());
}
```

### 3. Create Layout Models

```dart
// lib/models/app_layout.dart
class AppLayout {
  final List<LayoutContainer> containers;
  final LayoutTheme theme;
  final String? lastUpdated;

  AppLayout({
    required this.containers,
    required this.theme,
    this.lastUpdated,
  });

  factory AppLayout.fromJson(Map<String, dynamic> json) {
    return AppLayout(
      containers: (json['containers'] as List?)
          ?.map((c) => LayoutContainer.fromJson(c))
          .toList() ?? [],
      theme: LayoutTheme.fromJson(json['theme'] ?? {}),
      lastUpdated: json['lastUpdated'],
    );
  }
}

class LayoutContainer {
  final String id;
  final String type;
  final String alignment;
  final List<LayoutModule> children;
  final Map<String, dynamic>? style;

  LayoutContainer({
    required this.id,
    required this.type,
    required this.alignment,
    required this.children,
    this.style,
  });

  factory LayoutContainer.fromJson(Map<String, dynamic> json) {
    return LayoutContainer(
      id: json['id'],
      type: json['type'],
      alignment: json['alignment'] ?? 'vertical',
      children: (json['children'] as List?)
          ?.map((c) => LayoutModule.fromJson(c))
          .toList() ?? [],
      style: json['style'],
    );
  }
}

class LayoutModule {
  final String id;
  final String type;
  final String? content;
  final String? icon;
  final String? name;

  LayoutModule({
    required this.id,
    required this.type,
    this.content,
    this.icon,
    this.name,
  });

  factory LayoutModule.fromJson(Map<String, dynamic> json) {
    return LayoutModule(
      id: json['id'],
      type: json['type'],
      content: json['content'],
      icon: json['icon'],
      name: json['name'],
    );
  }
}

class LayoutTheme {
  final String primaryColor;
  final String secondaryColor;
  final String backgroundColor;

  LayoutTheme({
    required this.primaryColor,
    required this.secondaryColor,
    required this.backgroundColor,
  });

  factory LayoutTheme.fromJson(Map<String, dynamic> json) {
    return LayoutTheme(
      primaryColor: json['primaryColor'] ?? '#FF6B6B',
      secondaryColor: json['secondaryColor'] ?? '#4ECDC4',
      backgroundColor: json['backgroundColor'] ?? '#FFFFFF',
    );
  }

  Color get primary => Color(int.parse(primaryColor.replaceFirst('#', '0xFF')));
  Color get secondary => Color(int.parse(secondaryColor.replaceFirst('#', '0xFF')));
  Color get background => Color(int.parse(backgroundColor.replaceFirst('#', '0xFF')));
}
```

### 4. Create Layout Service

```dart
// lib/services/layout_service.dart
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/app_layout.dart';

class LayoutService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Stream for real-time updates
  Stream<AppLayout> getLayoutStream() {
    return _firestore
        .collection('appLayout')
        .doc('currentLayout')
        .snapshots()
        .map((snapshot) {
      if (snapshot.exists) {
        return AppLayout.fromJson(snapshot.data()!);
      } else {
        // Return default empty layout
        return AppLayout(
          containers: [],
          theme: LayoutTheme(
            primaryColor: '#FF6B6B',
            secondaryColor: '#4ECDC4',
            backgroundColor: '#FFFFFF',
          ),
        );
      }
    });
  }

  // One-time fetch
  Future<AppLayout> getLayout() async {
    final doc = await _firestore
        .collection('appLayout')
        .doc('currentLayout')
        .get();

    if (doc.exists) {
      return AppLayout.fromJson(doc.data()!);
    } else {
      throw Exception('Layout not found');
    }
  }
}
```

### 5. Create Widget Renderers

```dart
// lib/widgets/dynamic_layout_renderer.dart
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/app_layout.dart';

class DynamicLayoutRenderer extends StatelessWidget {
  final AppLayout layout;

  const DynamicLayoutRenderer({Key? key, required this.layout}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: layout.theme.background,
      child: ListView.builder(
        itemCount: layout.containers.length,
        itemBuilder: (context, index) {
          return _buildContainer(context, layout.containers[index]);
        },
      ),
    );
  }

  Widget _buildContainer(BuildContext context, LayoutContainer container) {
    return Container(
      padding: EdgeInsets.all(16),
      child: container.alignment == 'horizontal'
          ? Row(
              children: container.children
                  .map((module) => Expanded(child: _buildModule(context, module)))
                  .toList(),
            )
          : Column(
              children: container.children
                  .map((module) => _buildModule(context, module))
                  .toList(),
            ),
    );
  }

  Widget _buildModule(BuildContext context, LayoutModule module) {
    switch (module.type) {
      case 'text':
        return _buildTextModule(module);
      case 'image':
        return _buildImageModule(module);
      case 'banner':
        return _buildBannerModule(module);
      case 'announcement':
        return _buildAnnouncementModule(module);
      case 'menu':
        return _buildMenuModule(module);
      case 'qrcode':
        return _buildQRCodeModule(module);
      case 'waitingStatus':
        return _buildWaitingStatusModule(module);
      case 'businessHours':
        return _buildBusinessHoursModule(module);
      case 'contact':
        return _buildContactModule(module);
      case 'socialMedia':
        return _buildSocialMediaModule(module);
      default:
        return Container(
          padding: EdgeInsets.all(16),
          child: Text('Unknown module: ${module.type}'),
        );
    }
  }

  Widget _buildTextModule(LayoutModule module) {
    return Container(
      padding: EdgeInsets.all(12),
      child: Text(
        module.content ?? '',
        style: TextStyle(fontSize: 16),
      ),
    );
  }

  Widget _buildImageModule(LayoutModule module) {
    if (module.content == null || module.content!.isEmpty) {
      return Container(height: 200, color: Colors.grey[300]);
    }
    return CachedNetworkImage(
      imageUrl: module.content!,
      height: 200,
      fit: BoxFit.cover,
      placeholder: (context, url) => Container(
        height: 200,
        color: Colors.grey[300],
        child: Center(child: CircularProgressIndicator()),
      ),
      errorWidget: (context, url, error) => Container(
        height: 200,
        color: Colors.grey[300],
        child: Icon(Icons.error),
      ),
    );
  }

  Widget _buildBannerModule(LayoutModule module) {
    return Container(
      height: 120,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
        ),
      ),
      child: Center(
        child: Text(
          module.content ?? 'Banner',
          style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget _buildAnnouncementModule(LayoutModule module) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Color(0xFFFFF4E6),
        border: Border.all(color: Color(0xFFFFB74D), width: 2),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(Icons.notifications, color: Color(0xFFFFB74D)),
          SizedBox(width: 12),
          Expanded(
            child: Text(
              module.content ?? '最新公告',
              style: TextStyle(fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  // Implement other module builders...
  Widget _buildMenuModule(LayoutModule module) => Container(height: 200, color: Colors.grey[200]);
  Widget _buildQRCodeModule(LayoutModule module) => Container(height: 150, color: Colors.white);
  Widget _buildWaitingStatusModule(LayoutModule module) => Container(height: 100, color: Color(0xFFE3F2FD));
  Widget _buildBusinessHoursModule(LayoutModule module) => Container(height: 120, color: Color(0xFFF1F8E9));
  Widget _buildContactModule(LayoutModule module) => Container(height: 90, color: Color(0xFFFFF8E1));
  Widget _buildSocialMediaModule(LayoutModule module) => Container(height: 70, color: Color(0xFFF3E5F5));
}
```

### 6. Use in Your App

```dart
// lib/screens/home_screen.dart
import 'package:flutter/material.dart';
import '../services/layout_service.dart';
import '../widgets/dynamic_layout_renderer.dart';

class HomeScreen extends StatelessWidget {
  final LayoutService _layoutService = LayoutService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('EatQ')),
      body: StreamBuilder(
        stream: _layoutService.getLayoutStream(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(child: Text('錯誤: ${snapshot.error}'));
          }

          if (!snapshot.hasData) {
            return Center(child: CircularProgressIndicator());
          }

          return DynamicLayoutRenderer(layout: snapshot.data!);
        },
      ),
    );
  }
}
```

---

## Alternative: Firebase Storage (Backup Solution)

If you prefer using the exported JSON file from Storage:

### Updated Storage Structure:
```
Firebase Storage
└── app_layouts/
    └── current_layout.json  (Single file, always overwritten)
```

### Flutter Code (HTTP fetch):

```dart
// lib/services/layout_service_storage.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/app_layout.dart';

class LayoutServiceStorage {
  static const String layoutUrl = 
      'https://firebasestorage.googleapis.com/v0/b/eatq-2025-tw.firebasestorage.app/o/app_layouts%2Fcurrent_layout.json?alt=media';

  Future<AppLayout> getLayout() async {
    final response = await http.get(Uri.parse(layoutUrl));
    
    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      return AppLayout.fromJson(json);
    } else {
      throw Exception('Failed to load layout');
    }
  }
}
```

**Note:** This requires manually clicking "匯出 JSON" after each save.

---

## Comparison: Firestore vs Storage

| Feature | Firestore (Recommended) | Storage |
|---------|-------------------------|---------|
| Real-time updates | ✅ Instant | ❌ Manual export needed |
| Offline support | ✅ Built-in | ❌ Requires manual caching |
| Complexity | Medium | Simple |
| Cost | Pay per read | Pay per download |
| Best for | Dynamic apps | Static content |

---

## Security Rules

### Firestore (Allow public read):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appLayout/{document} {
      allow read: if true;  // Anyone can read
      allow write: if request.auth != null;  // Only authenticated (admin) can write
    }
  }
}
```

### Storage (Allow public read):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /app_layouts/current_layout.json {
      allow read: if true;  // Anyone can download
      allow write: if request.auth != null;  // Only authenticated can upload
    }
  }
}
```

---

## Testing Workflow

1. **Admin (Next.js)**: Design layout → Click "儲存" → Layout saved to Firestore
2. **Optional**: Click "匯出 JSON" → Backup saved to Storage
3. **Flutter App**: Opens → Fetches from Firestore → Renders layout
4. **Real-time**: Admin changes layout → Flutter app updates automatically (if using StreamBuilder)

---

## Recommended Choice

**Use Firestore directly** for these reasons:
1. ✅ No manual export step
2. ✅ Real-time updates
3. ✅ Better error handling
4. ✅ Offline support
5. ✅ Easier to maintain

Keep the Storage export as a **backup/snapshot feature** for version control or debugging.
