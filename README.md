# Tri-Hard

Tri-Hard is a web-based application that generates personalised triathlon training plans based on user inputs such as event type, race date, training availability, and ability across swimming, cycling, and running.

## Overview

Triathlon training requires balancing three disciplines while managing fatigue and progression. Tri-Hard simplifies this process by automatically generating structured, progressive training plans tailored to each user.

The application focuses on accessibility and ease of use, offering an alternative to expensive coaching platforms.

## Features

- Generate personalised triathlon training plans
- Supports Sprint, Olympic, Half-Ironman (70.3), and Ironman (140.6)
- Custom inputs:
  - Race date
  - Training days per week
  - Skill level (Swim / Bike / Run)
- Balanced weekly schedules with progressive overload
- Emphasis on recovery, structure, and discipline balance
- Calendar-style plan display (planned)

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **API:** RESTful architecture

## How It Works

1. User inputs their event details and availability  
2. The system calculates the available training weeks  
3. A structured plan is generated using:
   - Training phases (Base, Build, Peak, Taper)
   - Discipline balancing based on weakest area
   - Progressive weekly load adjustments  
4. The plan is returned and displayed to the user  

## Project Structure

- client/ # React frontend
- server/ # Node.js + Express API
- models/ # MongoDB schemas


## Getting Started

### Prerequisites

- Node.js
- MongoDB (local or Atlas)

## API Endpoints
GET /api/plans – Get all plans
GET /api/plans/:id – Get a single plan
POST /api/plans – Create a plan
DELETE /api/plans/:id – Delete a plan

## Future Improvements

- Editable training plans
- Performance tracking & analytics
- Wearable integration (Strava, Garmin, etc.)
- Adaptive training based on progress

## Author 
Robert O’Donnell
SETU Waterford