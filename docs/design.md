Travel Tracker for the United States  
Design Document

1. Project Description

Travel Tracker for the United States is a full-stack web application that allows users to log, organize, and visualize the trips they have taken within the United States. The main goal is to provide an easy, interactive way for travelers to keep track of the states they have visited, the details of each trip, and their overall travel progress.

The application includes a complete authentication system where users can create accounts, log in, and manage their personal data securely. Once logged in, users can create trips with start and end destinations, visited states, transportation type, cost breakdowns, dates, and notes. The dashboard features a color-coded map of the United States, which highlights the states the user has visited. Additional travel statistics such as number of visited states, percentage completed, and total spending are also displayed.

The frontend is built with React and uses AJAX to communicate with two backend services running Node.js, Express, and MongoDB. The application is fully client-side rendered.

2. User Personas

Hans – Infrequent Traveler  
Hans occasionally travels and prefers simple tools that do not overwhelm him.

**Goals**
- Quickly create an account  
- Log in without complications  
- Add a few trips with minimal required details  
- See a simple map of states he has visited  
- Edit or delete his account when needed  

Mona – Avid Traveler  
Mona travels often and likes to keep her travel history organized and detailed.

**Goals**
- Add, edit, and delete trips  
- Record cost details, transportation types, and notes  
- Visualize her visited states through an interactive map  
- Browse and filter trips by different criteria  
- Monitor her travel progress and spending  

3. User Stories

**As Hans (infrequent traveler)**
- I want to register so my travel data can be saved.  
- I want to log in and see my visited states on a map.  
- I want to add simple trips without filling too many fields.  
- I want to update or delete my account.  
- I want to toggle states on the map to mark where I have been.

**As Mona (avid traveler)**
- I want to create trips with detailed information such as dates, states, costs, and transportation.  
- I want to edit trips when information changes.  
- I want to delete trips I no longer need.  
- I want to view a color-coded map that updates with my travel activity.  
- I want to filter trips by year, cost range, or state.  
- I want to see travel statistics like total states visited and total spending.

4. Wireframes and Mockups

Below is the main mockup used to guide the layout and UI structure of the application. It outlines the navigation bar, map display, trip summary cards, trip list, and trip creation form.

![Travel Tracker Mockup](./mockups/travel-tracker-ui.png)

**Wireframe Details**
- A navigation bar containing Account, Sign Off, States, and Trips  
- A central map of the United States showing visited states  
- Statistic cards displaying:  
  - Number of states visited  
  - Percent visited  
  - Total cost  
- A Trips section with a scrollable list of entries  
- Each trip contains:  
  - States included  
  - Cost breakdown  
  - Transportation  
  - Notes  
  - Edit and Delete buttons  
- A form at the bottom for adding new trips  

These wireframes informed the structure of the UI and component layout throughout the project.

5. Feature Breakdown

**Account Management**
- Sign up, login, logout  
- Edit account information  
- Delete account  
- ProtectedRoute components for authenticated areas  

**State Map Visualization**
- Built with react-simple-maps  
- Clickable states  
- Hover tooltips  
- Visited states visually highlighted  
- Stats update based on visited states  

**Trip Management (CRUD)**
- Add new trips  
- Edit existing trips  
- Delete trips  
- Trip details include: states, transportation, cost breakdown, notes, and dates  
- All trip data is tied to the authenticated user  

**Trip Filtering**
- Filter by year  
- Filter by visited states  
- Filter by minimum or maximum cost  

6. System Architecture

**Frontend**
- React with Hooks  
- React Router  
- Component-scoped CSS  
- Fetch API for AJAX  
- Map built with react-simple-maps  

**Backend**

Two microservices:
- **Auth Server (Port 4000)**  
  Handles registration, login, logout  
  Stores user profile and visited states  
  MongoDB collection: `users`

- **Trips API (Port 3000)**  
  CRUD operations for trips  
  MongoDB collection: `trips`

Both services use the official MongoDB driver.

7. Data Model

**Users Collection**
```json
{
  "_id": "ObjectId",
  "email": "string",
  "pass": "hashed string",
  "visitedStates": ["CA", "WA", "NY"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
Trips Collection

json
Copy code
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "string",
  "states": ["MA", "CT", "RI"],
  "transportation": "string",
  "cost": {
    "food": number,
    "lodging": number,
    "fuel": number,
    "misc": number
  },
  "notes": "string",
  "dateStart": "Date",
  "dateEnd": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
Technologies and Libraries

Frontend

HTML, CSS

JavaScript (ES6)

React with hooks

React Router

react-simple-maps

Backend

Node.js

Express

MongoDB (official driver)

Tools

Vite

ESLint

Prettier

GitHub

Netlify, Vercel, Render, or Railway for deployment

Division of Work

Stewart

UI for profile page

CRUD operations for trips

Interactive map and trip visualization

Filters and trip selectors

Theresa

Account management UI

CRUD for user accounts

Full authentication flow

Visited states implementation

Backend logic for user and state data

Purpose and Usefulness

Travel Tracker for the United States helps people maintain a record of their travel experiences. Users can easily track where they have been, how much they have spent, and details about each trip. The map visualization and trip logging features make the app valuable for occasional travelers who want a simple tracker as well as frequent travelers who want a structured, detailed record of their journeys.