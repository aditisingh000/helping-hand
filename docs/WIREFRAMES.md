# HelpingHand UI/UX Wireframes & Design Guidelines

## Overview

This document outlines the UI/UX wireframes, design patterns, and user interface specifications for HelpingHand. The design prioritizes accessibility, mobile-first responsiveness, and intuitive user experience.

## Design Principles

### Core Principles
1. **Accessibility First**: WCAG 2.1 AA compliance
2. **Mobile-First**: Design for mobile, enhance for desktop
3. **Clarity**: Clear visual hierarchy and intuitive navigation
4. **Consistency**: Unified design language across all platforms
5. **Performance**: Fast loading and smooth interactions

### Color Palette

```
Primary Colors:
- Primary: #4ECDC4 (Teal) - Main brand color
- Secondary: #FF6B6B (Coral) - Volunteer/action items
- Accent: #45B7D1 (Blue) - Links and highlights

Neutral Colors:
- Background: #FFFFFF (White)
- Surface: #F8F9FA (Light Gray)
- Text Primary: #212529 (Dark Gray)
- Text Secondary: #6C757D (Medium Gray)
- Border: #DEE2E6 (Light Border)

Event Category Colors:
- Volunteer: #FF6B6B (Red)
- Social: #4ECDC4 (Teal)
- Educational: #45B7D1 (Blue)
- Sports: #FFA07A (Salmon)
- Arts: #9B59B6 (Purple)
- Food: #F39C12 (Orange)
- Outdoor: #27AE60 (Green)
- Other: #95A5A6 (Gray)
```

### Typography

```
Headings:
- H1: 32px/2rem, Bold, Montserrat/System Font
- H2: 24px/1.5rem, Semi-Bold
- H3: 20px/1.25rem, Semi-Bold
- H4: 18px/1.125rem, Medium

Body:
- Large: 18px/1.125rem, Regular
- Base: 16px/1rem, Regular
- Small: 14px/0.875rem, Regular
- Caption: 12px/0.75rem, Regular
```

### Spacing System

```
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- xxl: 48px (3rem)
```

## Landing Page Wireframe

### Hero Section
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] HelpingHand                    [Sign In] [Sign Up]│
├─────────────────────────────────────────────────────────┤
│                                                           │
│              🌍 HelpingHand                               │
│         Strengthen Your Local Community                  │
│                                                           │
│    Discover events, volunteer opportunities, and         │
│    connect with neighbors in your area.                  │
│                                                           │
│    [Get Started]  [Learn More]                           │
│                                                           │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│    │  📱 App  │  │  📱 App  │  │  📱 App  │            │
│    │ Screenshot│ │ Screenshot│ │ Screenshot│            │
│    └──────────┘  └──────────┘  └──────────┘            │
│                                                           │
│    [Download on App Store]  [Get it on Google Play]      │
│    [Open Web App]                                        │
└─────────────────────────────────────────────────────────┘
```

**Key Elements:**
- Large, clear headline with tagline
- Primary CTA buttons (Sign Up, Get Started)
- App screenshot mockups (3-column grid on desktop, stacked on mobile)
- Download buttons for mobile apps
- Clean, spacious layout

### About Section
```
┌─────────────────────────────────────────────────────────┐
│  About HelpingHand                                       │
│                                                           │
│  HelpingHand connects people in the same geographic      │
│  area to organize and attend community events.           │
│                                                           │
│  Why Community Matters:                                  │
│  • Build stronger neighborhoods                          │
│  • Discover volunteer opportunities                      │
│  • Make meaningful connections                           │
│  • Support local initiatives                             │
│                                                           │
│  [Icon] Create Profile    [Icon] Explore Events          │
│  [Icon] Join Events      [Icon] Build Community          │
└─────────────────────────────────────────────────────────┘
```

### How It Works Section
```
┌─────────────────────────────────────────────────────────┐
│  How It Works                                            │
│                                                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │    1    │  │    2    │  │    3    │  │    4    │   │
│  │ [Icon]  │  │ [Icon]  │  │ [Icon]  │  │ [Icon]  │   │
│  │ Create  │  │ Explore │  │ Join or │  │ Build   │   │
│  │ Profile │  │ Events  │  │ Host    │  │ Network │   │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
│                                                           │
│  Step descriptions with illustrations                    │
└─────────────────────────────────────────────────────────┘
```

### Example Use Cases Section
```
┌─────────────────────────────────────────────────────────┐
│  Example Use Cases                                       │
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ Neighborhood     │  │ Study Groups     │             │
│  │ Cleanups         │  │                  │             │
│  │ [Image]          │  │ [Image]          │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ Community BBQ    │  │ Volunteer        │             │
│  │                  │  │ Opportunities    │             │
│  │ [Image]          │  │ [Image]          │             │
│  └──────────────────┘  └──────────────────┘             │
└─────────────────────────────────────────────────────────┘
```

### Footer
```
┌─────────────────────────────────────────────────────────┐
│  HelpingHand                                             │
│                                                           │
│  Product          Company          Legal                │
│  • Features       • About          • Privacy Policy     │
│  • Pricing        • Blog           • Terms of Service   │
│  • Roadmap        • Careers        • Cookie Policy      │
│                                                           │
│  Connect                                                  │
│  [GitHub] [Twitter] [Facebook] [LinkedIn]                │
│                                                           │
│  © 2024 HelpingHand. All rights reserved.               │
└─────────────────────────────────────────────────────────┘
```

## Web App Interface

### Top Navigation Bar
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] HelpingHand  [Map] [My Events] [Friends] [🔔(3)] [Profile▼]│
└─────────────────────────────────────────────────────────┘
```

**Components:**
- Logo (links to home/map)
- Navigation items: Map, My Events, Friends
- Notification bell with badge count
- Profile dropdown menu
- Responsive: Hamburger menu on mobile

### Main Map Page

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] HelpingHand  [Map] [My Events] [Friends] [🔔] [Profile]│
├──────────┬───────────────────────────────────────────────┤
│          │                                               │
│ Filters  │            Google Maps                       │
│ Sidebar  │            (Interactive)                      │
│          │            • Event Pins                       │
│ ┌──────┐ │            • Color-coded by category         │
│ │Radius│ │            • Click to view popup              │
│ │[Slider]│            • Zoom controls                   │
│ └──────┘ │                                               │
│          │                                               │
│ ┌──────┐ │                                               │
│ │Category│                                               │
│ │☐ Volunteer│                                           │
│ │☐ Social  │                                           │
│ │☐ Education│                                           │
│ │☐ Sports  │                                           │
│ └──────┘ │                                               │
│          │                                               │
│ ┌──────┐ │                                               │
│ │Date  │ │                                               │
│ │[Picker]│                                               │
│ └──────┘ │                                               │
│          │                                               │
│ ┌──────┐ │                                               │
│ │Age   │ │                                               │
│ │[Range]│                                               │
│ └──────┘ │                                               │
│          │                                               │
│ ┌──────┐ │                                               │
│ │Size  │ │                                               │
│ │[Select]│                                               │
│ └──────┘ │                                               │
└──────────┴───────────────────────────────────────────────┘
```

#### Event Pin Popup (InfoWindow)
```
┌─────────────────────────────────────┐
│ [Event Banner Image]                 │
├─────────────────────────────────────┤
│ Neighborhood Cleanup                 │
│ 🗑️ Volunteer                        │
│                                      │
│ 📅 Saturday, March 15, 2024         │
│ ⏰ 10:00 AM - 2:00 PM                │
│ 📍 123 Main St, Your City            │
│                                      │
│ 👤 Hosted by: Sarah Johnson          │
│ 👥 12/50 attending                   │
│ 👶 Ages: All ages                    │
│                                      │
│ Join us for a community cleanup...   │
│ [Read more...]                       │
│                                      │
│ [RSVP] [View Details]                │
└─────────────────────────────────────┘
```

**Pin Colors:**
- Volunteer: Red (#FF6B6B)
- Social: Teal (#4ECDC4)
- Educational: Blue (#45B7D1)
- Sports: Salmon (#FFA07A)
- Arts: Purple (#9B59B6)
- Food: Orange (#F39C12)
- Outdoor: Green (#27AE60)
- Other: Gray (#95A5A6)

### Event Detail Page
```
┌─────────────────────────────────────────────────────────┐
│ [← Back]                    [Share] [Report]            │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ [Event Banner Image - Full Width]                        │
│                                                           │
│ Neighborhood Cleanup                                     │
│ 🗑️ Volunteer • All Ages                                 │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📅 Saturday, March 15, 2024                         │ │
│ │ ⏰ 10:00 AM - 2:00 PM                                │ │
│ │ 📍 123 Main St, Your City, State 12345              │ │
│ │ 👥 12/50 attending                                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ 👤 Hosted by Sarah Johnson                               │
│ [View Profile]                                           │
│                                                           │
│ About This Event                                         │
│ ─────────────────────────────────────────────────────── │
│ Join us for a community cleanup event in the            │
│ neighborhood park. We'll be picking up litter,          │
│ planting trees, and making our community a better        │
│ place. All supplies will be provided.                   │
│                                                           │
│ [RSVP Button - Primary]                                 │
│                                                           │
│ Attendees (12)                                           │
│ ─────────────────────────────────────────────────────── │
│ [Avatar] [Avatar] [Avatar] [Avatar] [+8]                │
│                                                           │
│ Comments (5)                                             │
│ ─────────────────────────────────────────────────────── │
│ [Avatar] John Doe                                        │
│ Looking forward to it!                                  │
│ 2 hours ago                                             │
│                                                           │
│ [Avatar] Jane Smith                                     │
│ Can I bring my kids?                                    │
│ 1 hour ago                                              │
│                                                           │
│ [Write a comment...] [Post]                             │
└─────────────────────────────────────────────────────────┘
```

### Create Event Page
```
┌─────────────────────────────────────────────────────────┐
│ [← Back]  Create New Event                              │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ Event Name *                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Neighborhood Cleanup                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ Description *                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Join us for a community cleanup event...            │ │
│ │                                                     │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ Date & Time *                                            │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│ │ Date     │  │ Start    │  │ End      │              │
│ │ [Picker] │  │ [Time]   │  │ [Time]   │              │
│ └──────────┘  └──────────┘  └──────────┘              │
│                                                           │
│ Location *                                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Search location...]                                │ │
│ └─────────────────────────────────────────────────────┘ │
│ [Map Preview]                                            │
│                                                           │
│ Category *                                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Volunteer ▼                                         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ Age Range                                                │
│ ┌──────────┐  to  ┌──────────┐                         │
│ │ Min Age  │      │ Max Age  │                         │
│ │ [Input]  │      │ [Input]  │                         │
│ └──────────┘      └──────────┘                         │
│                                                           │
│ Maximum Capacity                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 50                                                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ Event Banner Image                                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Upload Image] or drag and drop                     │ │
│ │ Recommended: 1200x600px                             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ [Cancel]  [Save Draft]  [Publish Event]                  │
└─────────────────────────────────────────────────────────┘
```

### Profile Page
```
┌─────────────────────────────────────────────────────────┐
│ [← Back]  My Profile                                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Profile Photo - Large]                              │ │
│ │                                                      │ │
│ │ Sarah Johnson                                        │ │
│ │ @sarahj                                              │ │
│ │ 📍 San Francisco, CA                                 │ │
│ │                                                      │ │
│ │ Community enthusiast and volunteer organizer.        │ │
│ │                                                      │ │
│ │ [Edit Profile]                                       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ Stats                                                    │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│ │ Events   │  │ Attended │  │ Friends  │              │
│ │ Hosted   │  │          │  │          │              │
│ │    12    │  │    45    │  │    28    │              │
│ └──────────┘  └──────────┘  └──────────┘              │
│                                                           │
│ Upcoming Events                                          │
│ ─────────────────────────────────────────────────────── │
│ [Event Card] [Event Card] [Event Card]                  │
│                                                           │
│ Past Events                                              │
│ ─────────────────────────────────────────────────────── │
│ [Event Card] [Event Card]                               │
│                                                           │
│ Hosted Events                                            │
│ ─────────────────────────────────────────────────────── │
│ [Event Card] [Event Card] [Event Card]                  │
│                                                           │
│ Friends                                                  │
│ ─────────────────────────────────────────────────────── │
│ [Avatar] [Avatar] [Avatar] [Avatar] [+24]              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Friends Page
```
┌─────────────────────────────────────────────────────────┐
│ [← Back]  Friends                                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ [All] [Pending] [Requests]                               │
│                                                           │
│ Search friends...                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ Friends (28)                                             │
│ ─────────────────────────────────────────────────────── │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Avatar] John Doe                                   │ │
│ │ @johndoe • 2.3 km away                              │ │
│ │ [Message] [Remove]                                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Avatar] Jane Smith                                 │ │
│ │ @janesmith • 5.1 km away                            │ │
│ │ [Message] [Remove]                                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Mobile App Layout

### Home Screen (Map View)
```
┌─────────────────────────┐
│ [☰] HelpingHand  [🔔] [👤]│
├─────────────────────────┤
│                         │
│                         │
│    Google Maps          │
│    (Full Screen)        │
│    • Event Pins         │
│    • User Location      │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                    [➕] │ ← Floating Action Button
├─────────────────────────┤
│ [🗺️] [📅] [💬] [🔔] [👤]│ ← Bottom Nav
└─────────────────────────┘
```

**Bottom Navigation:**
- Map (Home) - Active
- Events - List view
- Messages - Direct messages
- Notifications - Alerts
- Profile - User profile

### Event Detail Screen (Mobile)
```
┌─────────────────────────┐
│ [←]              [Share] │
├─────────────────────────┤
│                         │
│ [Event Banner - Full]   │
│                         │
│ Neighborhood Cleanup    │
│ 🗑️ Volunteer            │
│                         │
│ ┌─────────────────────┐ │
│ │ 📅 Mar 15, 2024     │ │
│ │ ⏰ 10:00 AM         │ │
│ │ 📍 123 Main St      │ │
│ │ 👥 12/50            │ │
│ └─────────────────────┘ │
│                         │
│ 👤 Sarah Johnson         │
│ [View Profile →]        │
│                         │
│ About                   │
│ ─────────────────────── │
│ Join us for a community │
│ cleanup event...        │
│                         │
│ [RSVP Button - Full]    │
│                         │
│ Attendees (12)          │
│ ─────────────────────── │
│ [Scrollable Avatars]    │
│                         │
│ Comments                │
│ ─────────────────────── │
│ [Comment Thread]        │
│                         │
│ [Write comment...]      │
└─────────────────────────┘
```

### Create Event Screen (Mobile)
```
┌─────────────────────────┐
│ [←]  Create Event       │
├─────────────────────────┤
│                         │
│ Event Name *            │
│ ┌─────────────────────┐ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ Description *           │
│ ┌─────────────────────┐ │
│ │                     │ │
│ │                     │ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ Date & Time             │
│ ┌─────────────────────┐ │
│ │ [Date Picker]       │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ [Time Picker]       │ │
│ └─────────────────────┘ │
│                         │
│ Location                │
│ ┌─────────────────────┐ │
│ │ [Search]            │ │
│ └─────────────────────┘ │
│ [Small Map Preview]     │
│                         │
│ Category                │
│ ┌─────────────────────┐ │
│ │ [Dropdown]         │ │
│ └─────────────────────┘ │
│                         │
│ [Scroll for more...]    │
│                         │
│ [Cancel]  [Publish]     │
└─────────────────────────┘
```

### Profile Screen (Mobile)
```
┌─────────────────────────┐
│ [←]  [Settings]         │
├─────────────────────────┤
│                         │
│    [Profile Photo]      │
│                         │
│    Sarah Johnson        │
│    @sarahj              │
│    📍 San Francisco     │
│                         │
│    Bio text here...     │
│                         │
│    [Edit Profile]       │
│                         │
│ ┌─────┐ ┌─────┐ ┌─────┐│
│ │ 12  │ │ 45  │ │ 28  ││
│ │Host │ │Attend│ │Friends│
│ └─────┘ └─────┘ └─────┘│
│                         │
│ Upcoming Events         │
│ ─────────────────────── │
│ [Event Card]            │
│ [Event Card]            │
│                         │
│ Past Events             │
│ ─────────────────────── │
│ [Event Card]            │
│                         │
│ [Scroll for more...]    │
└─────────────────────────┘
```

## Component Specifications

### Event Card Component
```
┌─────────────────────────────────────┐
│ [Event Banner Image]                │
├─────────────────────────────────────┤
│ Neighborhood Cleanup                │
│ 🗑️ Volunteer • All Ages            │
│                                     │
│ 📅 Mar 15, 2024 • ⏰ 10:00 AM      │
│ 📍 123 Main St                      │
│ 👥 12/50 attending                  │
│                                     │
│ [View Details →]                    │
└─────────────────────────────────────┘
```

### Filter Sidebar Component
```
┌─────────────────────┐
│ Filters             │
├─────────────────────┤
│ Distance            │
│ ┌─────────────────┐ │
│ │ [Slider: 10km] │ │
│ └─────────────────┘ │
│                     │
│ Category            │
│ ☑ Volunteer         │
│ ☑ Social            │
│ ☐ Educational       │
│ ☐ Sports            │
│                     │
│ Date                │
│ ┌─────────────────┐ │
│ │ [Date Picker]   │ │
│ └─────────────────┘ │
│                     │
│ Age Range           │
│ ┌─────────────────┐ │
│ │ [Range Slider] │ │
│ └─────────────────┘ │
│                     │
│ [Clear Filters]     │
└─────────────────────┘
```

## Accessibility Features

### Keyboard Navigation
- Tab order follows visual flow
- Focus indicators on all interactive elements
- Skip links for main content
- Keyboard shortcuts for common actions

### Screen Reader Support
- Semantic HTML elements
- ARIA labels and roles
- Alt text for all images
- Descriptive link text
- Form labels and error messages

### Visual Accessibility
- High contrast mode support
- Adjustable text sizes
- Color-blind friendly color palette
- Clear focus indicators
- Sufficient color contrast ratios (4.5:1 minimum)

### Responsive Breakpoints
```
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

## Interaction Patterns

### Map Interactions
- **Click Pin**: Opens event popup
- **Drag Map**: Pans to new area, refreshes events
- **Zoom**: Updates visible radius
- **Long Press** (Mobile): Quick event preview

### Event Actions
- **RSVP**: Single tap/click
- **Cancel RSVP**: Confirmation dialog
- **Share**: Native share sheet/dialog
- **Report**: Modal with reason selection

### Form Interactions
- **Real-time Validation**: Shows errors as user types
- **Auto-save**: Drafts saved automatically
- **Location Picker**: Interactive map selection
- **Image Upload**: Drag & drop or file picker

## Animation Guidelines

### Transitions
- **Page Transitions**: 300ms ease-in-out
- **Modal Open/Close**: 250ms ease-out
- **Button Hover**: 150ms ease
- **Loading States**: Skeleton screens

### Micro-interactions
- **Button Press**: Subtle scale (0.98)
- **Card Hover**: Slight elevation increase
- **Notification**: Slide in from top
- **Success**: Checkmark animation

## Figma Design System Recommendations

### Components to Create
1. **Buttons**: Primary, Secondary, Text, Icon
2. **Input Fields**: Text, Date, Time, Select, Textarea
3. **Cards**: Event Card, User Card, Comment Card
4. **Navigation**: Top Nav, Bottom Nav, Sidebar
5. **Modals**: Confirmation, Form, Info
6. **Maps**: Map Container, Pin, InfoWindow
7. **Lists**: Event List, User List, Notification List

### Design Tokens
- Colors (with light/dark variants)
- Typography scale
- Spacing scale
- Border radius values
- Shadow elevations
- Icon library

### Prototyping
- User flows for key actions
- Interactive prototypes
- Mobile and desktop variants
- Animation specifications

## Implementation Notes

### Google Maps Integration
- Custom marker icons per category
- Clustered markers for performance
- Custom InfoWindow styling
- Geocoding for address search
- Directions integration (future)

### Image Handling
- Lazy loading for event images
- Responsive image sizes
- Placeholder images
- Progressive image loading
- CDN delivery

### Performance Considerations
- Virtual scrolling for long lists
- Debounced search inputs
- Throttled map updates
- Code splitting by route
- Image optimization

---

For architecture details, see [ARCHITECTURE.md](./ARCHITECTURE.md)
For technology stack, see [TECH_STACK.md](./TECH_STACK.md)
For database schema, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
