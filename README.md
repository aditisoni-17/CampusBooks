
## Overview

Campus Books simulates a student-focused textbook marketplace where users can browse available books, inspect detailed listing information, create their own listings, manage availability, and save books to a wishlist. The project demonstrates practical React Native patterns including navigation, local persistence, screen-level state synchronization, reusable UI components, and modular service design.

## Key Highlights

- Built with React Native and Expo
- Fully functional without a backend
- Uses AsyncStorage for local persistence
- Supports local image selection for listings
- Supports listing creation, management, and wishlist workflows
- Includes search, filtering, validation, and persistent local state

## Features

### Browse and discovery
- Browse available book listings
- Search books by title or author
- Filter listings by category
- Filter listings by listing type
- Filter listings by condition

### Book details
- View detailed book information
- See seller contact information
- See pickup or meetup location
- View selected listing images
- View similar books based on stored listings

### Listing management
- Create a new listing with required-field validation
- Pick an image from the device gallery while creating a listing
- Save listings locally using AsyncStorage
- View created listings in My Listings
- Mark listings as sold or available
- Delete listings

### Wishlist
- Add books to wishlist
- Remove books from wishlist
- Prevent duplicate wishlist entries by book ID
- Persist wishlist locally between app sessions

### Local-first behavior
- No backend or authentication required
- Persistent data survives app restart
- UI reloads from storage and reflects the latest saved state

## Tech Stack

- React Native
- Expo
- Expo Image Picker
- React Navigation
- AsyncStorage
- JavaScript

## AsyncStorage Usage

This project uses AsyncStorage as its local persistence layer.

### What is stored
- Book listings
- Wishlist items
- Selected local image URIs for saved listings

### How it is organized
- `storageService.js` centralizes AsyncStorage read/write utilities
- `bookService.js` manages book-related persistence logic
- `wishlistService.js` manages wishlist-related persistence logic
- `AppContext.js` reloads stored data and synchronizes it with the UI

### Why it matters
- Enables an offline-friendly demo experience
- Keeps the app simple and self-contained
- Demonstrates local-first architecture without backend dependencies

## Installation

### Prerequisites

- Node.js
- npm
- Expo CLI or `npx expo`
- Expo Go on a physical device, or an iOS simulator / Android emulator

### Setup

```bash
cd CampusBooks
cd frontend
npm install
```

## Running the App


```bash
npx expo start
```

## Project Structure

```text
CampusBooks/
├── README.md
├── frontend/
│   ├── App.js
│   ├── index.js
│   ├── assets/
│   └── src/
│       ├── components/
│       │   ├── BookCard.js
│       │   ├── Button.js
│       │   ├── EmptyState.js
│       │   ├── FilterBar.js
│       │   ├── InputField.js
│       │   ├── SearchBadge.js
│       │   └── SearchBar.js
│       ├── context/
│       │   └── AppContext.js
│       ├── data/
│       │   └── mockBooks.js
│       ├── navigation/
│       │   └── AppNavigator.js
│       ├── screens/
│       │   ├── BookDetailScreen.js
│       │   ├── BrowseScreen.js
│       │   ├── CreateListingScreen.js
│       │   ├── MyListingsScreen.js
│       │   └── WishlistScreen.js
│       ├── services/
│       │   ├── bookService.js
│       │   ├── index.js
│       │   ├── storageService.js
│       │   └── wishlistService.js
│       └── utils/
│           └── constants.js
└── backend/
```

## Future Improvements

- Add multiple images and better image management
- Add edit listing functionality to the UI
- Add authentication and user identity
- Add backend APIs and cloud sync
- Add richer sorting, pagination, and advanced filters
- Add automated unit and integration tests
- Improve accessibility and production-ready visual polish



