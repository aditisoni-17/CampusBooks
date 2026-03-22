# Campus Books

Campus Books is a frontend-only React Native application built with Expo for discovering, listing, and saving campus book listings. It is designed as a local-first mobile app and uses AsyncStorage for persistent data storage, allowing the complete experience to work without a backend.

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
git clone <your-repository-url>
cd CampusBooks
cd frontend
npm install
```

## Running the App

From the `frontend` directory:

```bash
npm start
```

Then use one of the Expo options:

- Press `w` to run on web
- Press `i` to run on iOS simulator
- Press `a` to run on Android emulator
- Scan the QR code in Expo Go on a physical device

You can also launch web directly:

```bash
npm run web
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

## Manual Testing

### Core flows
1. Open the app and confirm listings load on the `Browse` screen.
2. Search by title or author and verify results update immediately.
3. Apply category, type, and condition filters and verify the list changes correctly.
4. Open a listing and confirm contact, location, and image details are visible.
5. Create a new listing, select an image from the gallery, and verify it appears in `My Listings`.
6. Mark a listing as sold, then mark it available again.
7. Delete a listing and verify it is removed from the UI.
8. Add a book to wishlist and confirm it appears in `Wishlist`.
9. Open the saved wishlist item and verify navigation to `Book Details` works correctly.
10. Remove the book from wishlist and verify it disappears.
11. Restart the app and verify listings, wishlist data, and selected images still persist.

## Feature Verification Checklist

Use this checklist when manually reviewing the app:

- [ ] Browse screen loads book listings
- [ ] Search filters results by title or author
- [ ] Category filter updates the result set
- [ ] Listing type filter updates the result set
- [ ] Condition filter updates the result set
- [ ] Book detail screen shows contact information
- [ ] Book detail screen shows meetup location
- [ ] Book detail screen shows the selected image when available
- [ ] Similar books load correctly
- [ ] Create Listing form blocks invalid submissions
- [ ] Create Listing can open the device gallery
- [ ] Create Listing handles image-picker cancel without errors
- [ ] Create Listing saves a valid listing locally
- [ ] New listing appears in My Listings immediately
- [ ] New listing image appears on cards and details
- [ ] My Listings can mark a book as sold
- [ ] My Listings can mark a book as available again
- [ ] My Listings can delete a listing
- [ ] Wishlist can add a book
- [ ] Wishlist does not allow duplicate entries
- [ ] Wishlist can remove a saved book
- [ ] Wishlist items open correctly in Book Details
- [ ] Data remains available after app restart

## Verification Notes

For a quick build-level verification, run:

```bash
cd frontend
npx expo export --platform web
```

This confirms the app compiles successfully for Expo web output.

## Future Improvements

- Add multiple images and better image management
- Add edit listing functionality to the UI
- Add authentication and user identity
- Add backend APIs and cloud sync
- Add richer sorting, pagination, and advanced filters
- Add automated unit and integration tests
- Improve accessibility and production-ready visual polish

## Author

Built for the Campus Books project.

This project is suitable as a React Native portfolio piece because it demonstrates:
- Local-first state management
- Persistent storage with AsyncStorage
- Media selection with Expo Image Picker
- Modular service architecture
- Navigation and screen coordination
- Practical CRUD-style mobile workflows
