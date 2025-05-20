# VinylVault Frontend

Frontend application for the VinylVault record collection management system.

## Features

- Create, read, update, and delete vinyl records in your collection
- Filter albums by title, artist, genre, and rating
- Responsive design for desktop and mobile devices
- Simple and intuitive user interface

## Technology Stack

- **Frontend Framework**: Vue.js 3
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **UI**: Custom CSS with variables
- **Testing**: Jest with Vue Test Utils
- **Build Tool**: Vue CLI

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running (see VinylVault backend repository)

### Running Locally

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run serve
```

The application will be available at http://localhost:8080

### Running with Docker

1. Build and start with Docker Compose:

```bash
docker-compose up -d
```

This will start the frontend, backend API, and PostgreSQL database.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
vinylvault-frontend/
├── public/               # Static files
├── src/                  # Source code
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Vue components
│   ├── services/         # API services
│   ├── views/            # Page components
│   ├── App.vue           # Root component
│   ├── main.js           # Application entry point
│   └── router.js         # Vue Router configuration
└── tests/                # Unit tests
```

## Key Components

- **AlbumList**: Displays and filters albums
- **AlbumForm**: Form for adding and editing albums
- **AlbumView**: Detailed view of a single album

## API Integration

The frontend communicates with the backend through these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /albums  | Get all albums |
| GET    | /albums/:id | Get album by ID |
| POST   | /albums  | Create a new album |
| PUT    | /albums/:id | Update an album |
| DELETE | /albums/:id | Delete an album |
| GET    | /artists | Get all artists |
| GET    | /genres  | Get all genres |

## Testing

Run the unit tests:

```bash
npm run test:unit
```

## Linting

```bash
npm run lint
```