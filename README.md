#  Bolttech Barcelona Car Rental API

Welcome to the **Bolttech Car Rental** MVP - a car rental platform for Barcelona built with Node.js and Express.

## 📋 Overview

This project provides a RESTful API for car rental bookings with dynamic pricing based on seasonal demand. The MVP focuses on two core user stories:

- **US 1**: Customers can view car availability and pricing for specific time slots
- **US 2**: Customers can create bookings with validation for overlapping dates and license expiry

## 🏗️ Architecture

The project follows **clean architecture principles** with separation of concerns:

```
src/
├── app.js                    # Express app configuration
├── routes/                   # HTTP routes (thin layer)
│   ├── cars.js              # Car availability routes
│   └── bookings.js          # Booking CRUD routes
├── services/                 # Business logic layer
│   ├── carService.js        # Car availability logic
│   └── bookingService.js    # Booking validation & creation
└── utils/                    # Utility functions
    └── season.js            # Season calculation logic

data/                         # JSON data store
├── cars.json                # Car inventory
└── bookings.json            # Booking records

tests/                        # Test suite
└── season.test.js           # Unit tests for season logic
```

### Design Patterns & Principles

- **Separation of Concerns**: Routes handle HTTP, services contain business logic
- **Single Responsibility**: Each service/module has one clear purpose
- **Dependency Injection**: Services are imported and used in routes
- **Error Handling**: Try-catch blocks with proper HTTP status codes
- **ES Modules**: Modern JavaScript with ES6 imports/exports

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd BolttechTest

# Install dependencies
npm install

# Start the server
npm start
```

The server will start on `http://localhost:4000`

### Running Tests

```bash
npm test
```

## 📚 API Documentation

### Base URL

```
http://localhost:4000
```

### Endpoints

#### 1. Get API Status

```http
GET /
```

**Response:**
```json
{
  "message": "Bolttech Car Rental API running!",
  "data": {
    "status": "active"
  }
}
```

#### 2. Get Available Cars (US 1)

```http
GET /api/cars?from=YYYY-MM-DD&to=YYYY-MM-DD
```

**Query Parameters:**
- `from` (required): Start date in YYYY-MM-DD format
- `to` (required): End date in YYYY-MM-DD format

**Response:**
```json
{
  "message": "Cars retrieved successfully",
  "data": [
    {
      "id": 1,
      "brand": "Toyota",
      "model": "Yaris",
      "stock": 3,
      "prices": {
        "peak": 98.43,
        "mid": 76.89,
        "off": 53.65
      },
      "totalPrice": 492.15,
      "avgPerDay": 98.43
    }
  ]
}
```

**Example:**
```bash
curl "http://localhost:4000/api/cars?from=2024-06-10&to=2024-06-15"
```

#### 3. Get All Bookings

```http
GET /api/bookings
```

**Response:**
```json
{
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": 1761901597336,
      "userId": 123,
      "carId": 1,
      "from": "2024-01-15",
      "to": "2024-01-20",
      "licenseExpiry": "2025-06-30"
    }
  ]
}
```

#### 4. Create Booking (US 2)

```http
POST /api/bookings
Content-Type: application/json

{
  "userId": 123,
  "carId": 1,
  "from": "2024-01-15",
  "to": "2024-01-20",
  "licenseExpiry": "2025-06-30"
}
```

**Request Body:**
- `userId` (required): Customer ID
- `carId` (required): Car ID
- `from` (required): Start date in YYYY-MM-DD format
- `to` (required): End date in YYYY-MM-DD format
- `licenseExpiry` (required): License expiry date in YYYY-MM-DD format

**Response:**
```json
{
  "message": "Booking created successfully",
  "data": {
    "id": 1761901597336,
    "userId": 123,
    "carId": 1,
    "from": "2024-01-15",
    "to": "2024-01-20",
    "licenseExpiry": "2025-06-30"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "carId": 1,
    "from": "2024-01-15",
    "to": "2024-01-20",
    "licenseExpiry": "2025-06-30"
  }'
```

### Error Responses

All error responses follow this format:
```json
{
  "error": "Error message here"
}
```

**Common Error Codes:**
- `400 Bad Request`: Invalid input, missing required fields, validation errors
- `500 Internal Server Error`: Server-side errors

