# 🛡️ HazGuard - Disaster Relief Management System

<div align="center">

![HazGuard](https://img.shields.io/badge/HazGuard-Disaster%20Relief-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**A comprehensive disaster relief coordination platform for West Bengal**

[Live Demo](#demo) • [Features](#features) • [Installation](#installation) • [Usage](#usage)

</div>

---

## 📖 Overview

HazGuard is a modern web application designed to streamline disaster relief operations in West Bengal, India. It connects administrators, local coordinators, relief workers, and citizens through an intuitive interface, enabling efficient resource allocation and real-time tracking during emergencies.

## ✨ Features

### 🔐 Multi-Role Authentication
- **Main Admin**: Full system access, disaster monitoring, allotment approvals
- **Local Admin**: Worker coordination, allotment management
- **Relief Workers**: Task notifications, assignment tracking
- **Citizens**: Real-time worker tracking, emergency contact

### 📊 Real-Time Disaster Monitoring
- Live disaster feed for West Bengal region
- Auto-refresh every 5 minutes
- Severity-based categorization (Severe, Moderate, Low)
- Quick response allocation system

### 👥 Worker Allotment System
- Multi-worker assignment capability
- Product/supply itemization with pricing
- Pickup and destination location management
- Cost calculation and approval workflow

### 📍 Citizen Tracking Portal
- View relief workers within 10km radius
- Real-time distance calculation
- Direct call/message functionality
- Location-based filtering

### 🎨 Modern UI/UX
- Liquid glass (glassmorphism) design
- Dark theme with beautiful gradients
- Responsive mobile-first layout
- Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hazguard.git

# Navigate to project directory
cd hazguard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🔑 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Main Admin | `admin` | `admin` |
| Local Admin | `localadmin` | `localadmin` |
| Worker | `Amit Das` | `9876543210` |
| Citizen | Any name | Any phone |

## 📱 User Workflows

### Admin Workflow
1. Login with admin credentials
2. View live disasters on dashboard
3. Click "Allot Help" on disaster card
4. Select workers, locations, and products
5. Submit for allotment
6. Review and approve/reject pending allotments

### Local Admin Workflow
1. Login with local admin credentials
2. View allotments assigned by main admin
3. Confirm and submit to main admin for final approval
4. Track approved allotments

### Worker Workflow
1. Login with name and phone number
2. Receive notification cards for new assignments
3. View task details (pickup, destination, products)
4. Contact team members if needed

### Citizen Workflow
1. Login via citizen portal with name/phone
2. Select your location
3. View nearby relief workers (10km radius)
4. Call or message workers directly

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **State Management**: Zustand (with persistence)
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query
- **Icons**: Lucide React
- **Notifications**: Sonner Toast

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── AllotmentModal.tsx
│   ├── DisasterCard.tsx
│   └── Navbar.tsx
├── data/
│   └── workers.ts      # Worker database (50 Bengali workers)
├── hooks/
│   └── useDisasters.ts # Disaster data fetching hook
├── pages/
│   ├── AdminDashboard.tsx
│   ├── LocalAdminDashboard.tsx
│   ├── WorkerDashboard.tsx
│   ├── CitizenDashboard.tsx
│   ├── Login.tsx
│   └── Index.tsx
├── store/
│   └── authStore.ts    # Global state with Zustand
└── index.css           # Design system tokens
```

## 🎨 Design System

The application uses a custom design system with:

- **Primary Color**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Destructive**: Red (#ef4444)
- **Glass Effects**: Backdrop blur with transparency
- **Animations**: Fade-in, float, pulse-glow

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

---

<div align="center">

**Made with ❤️ for West Bengal Disaster Relief**

[Report Bug](https://github.com/yourusername/hazguard/issues) • [Request Feature](https://github.com/yourusername/hazguard/issues)

</div>
