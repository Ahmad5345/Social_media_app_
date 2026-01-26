# Social Media App

A full-stack, cross-platform social media application built with **React
Native (Expo)** on the frontend and **Node.js + Express** on the
backend. The app allows users to create posts with images, view a feed,
interact with content, and manage their profile, all within a
mobile-first experience designed to feel modern, responsive, and
intuitive.

------------------------------------------------------------------------

## Project Description

The Social Media App replicates core functionality found in modern
social platforms, including image-based posting, a social feed, and
profile management. The project focuses on understanding full-stack
integration, API design, state management, and mobile UI/UX best
practices.

------------------------------------------------------------------------

## Deployed Application

This project is intended for local development and demonstration. A
public production deployment is not currently live.

------------------------------------------------------------------------

## Demo Media

screenshorts are in the screenshort folder in the frontend folder. 

------------------------------------------------------------------------

## Tech Stack

### Frontend

-   React Native
-   Expo
-   JavaScript
-   Zustand
-   React Navigation

### Backend

-   Node.js
-   Express
-   MongoDB (Mongoose)
-   passport for authentication

------------------------------------------------------------------------

## Setup Instructions

MUST BE TESTED ON EXPO GO!

### Prerequisites

-   Node.js (v18+)
-   npm
-   Expo Go or an emulator

### Backend Setup

``` bash
go to the backend folder
npm install
npm start
```

### Frontend Setup

``` bash
cd ../Social-Media-App-Frontend
npm install
npm start
test on ios simulator on your laptop. VERY IMPORTANT!!!!
```

------------------------------------------------------------------------

## Learning Journey

### Inspiration

This project was inspired by a desire to understand how real-world
social media applications ARE built. 

### Potential Impact

The app serves as both a learning reference and a foundation for
building scalable, mobile-first social platforms.

### New Technologies Learned

-   Expo media handling
-   Zustand state management
-   RESTful API design

------------------------------------------------------------------------

## Technical Rationale

### Architecture

The frontend and backend are separated to enforce clean API boundaries.
REST APIs keep the system modular and scalable.

### Tradeoffs

-   REST over GraphQL for simplicity
-   Deferred full authentication
-   Local image handling instead of cloud storage

### Most Difficult Bug

Image URI handling in React Native caused upload failures. This was
debugged by inspecting platform-specific URI formats and normalizing
data before sending it to the backend.

------------------------------------------------------------------------

## AI Usage

### Tools Used

ChatGPT was used for debugging and UI styling assistance. Thety also suggested lines as auto complete was on. 

### Example

**Prompt:**\
"Improve the styling of a React Native post creation screen with better
spacing and visual hierarchy."

**Adaptation:**\
The suggested styles were refactored to remove web-only assumptions,
adjusted for mobile responsiveness, and aligned with the app's existing
design system.

------------------------------------------------------------------------

## Future Improvements

- I wanted to get to work better. I wanted to add stuff from the DALI like whats your favourite major and your favourite quotes
- MESSAGING WAS A BIG THING FOR ME TO IMPLEMENT IF I HAD THE TIMEEEEE :(((((((((

------------------------------------------------------------------------

## Author

**Ahmad Wahab**\
Dartmouth College, Class of 2027\
Computer Science
