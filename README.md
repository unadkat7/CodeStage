# 🚀 CodeStage – Online Coding Evaluation Platform

CodeStage is a scalable coding platform designed to evaluate programming submissions efficiently using an asynchronous job processing architecture. It supports secure code execution, multiple test cases, and real-time submission tracking.

---

## 📌 Features

- 🧠 **Online Code Execution**
  - Supports multiple programming languages via Judge0
  - Handles custom input/output test cases

- ⚡ **Asynchronous Processing (Optimized Backend)**
  - Built using **BullMQ + Redis queue**
  - Non-blocking submission handling
  - Worker-based execution system

- 🔐 **Secure Evaluation Engine**
  - Base64 encoding for safe transmission
  - Hidden test cases support
  - Error normalization

- 📊 **Submission Tracking**
  - Stores execution time & memory
  - Tracks failed test cases
  - Maintains submission history (user-linked)

- 👤 **Authentication System**
  - JWT-based login/register
  - User-specific submissions & history

- 📡 **Real-time Updates (Planned / Partial)**
  - WebSocket integration (Socket.IO ready)

---

## 🏗️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Redis + BullMQ (Queue System)
- Judge0 API (Code Execution Engine)
- Socket.IO (for real-time updates)

### Frontend (Planned / In Progress)
- React.js / Next.js
- Tailwind CSS

---

## ⚙️ System Architecture
User Submission
↓
Backend API (Express)
↓
MongoDB (Store as Pending)
↓
Redis Queue (BullMQ)
↓
Worker Process
↓
Judge0 Execution
↓
Update DB + Emit Result


---

## 🔄 Workflow Explained

1. User submits code  
2. Submission stored in MongoDB with status **Pending**  
3. Job pushed into **Redis Queue**  
4. Worker picks up job asynchronously  
5. Code sent to **Judge0 API**  
6. Results processed (time, memory, output)  
7. MongoDB updated with final result  
8. (Optional) WebSocket emits result to frontend  

---

## 📁 Project Structure
backend/
│── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── queue/ # BullMQ queue setup
│ ├── workers/ # Worker processes
│ ├── utils/
│ └── seed/
│
│── .env
│── server.js


---

## 🧪 Sample Problem Structure

```json
{
  "title": "Two Sum",
  "description": "Find indices of two numbers...",
  "difficulty": "Easy",
  "testCases": [
    {
      "input": "4\n2 7 11 15\n9",
      "output": "0 1"
    }
  ]
}

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/assesslyx.git
cd assesslyx
2️⃣ Install Dependencies
npm install
3️⃣ Setup Environment Variables

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JUDGE0_API_URL=your_judge0_url
JWT_SECRET=your_secret
4️⃣ Start Redis Server
redis-server
5️⃣ Run Backend Server
npm run dev
6️⃣ Run Worker (Important ⚠️)
node src/workers/worker.js

📈 Why This Project is Strong (Engineering Highlights)
Implements queue-based architecture (used in real-world systems)
Prevents blocking of main server thread
Scalable design (can add multiple workers)
Handles high concurrency efficiently
Clean separation of concerns (API vs Worker)
🔮 Future Improvements
✅ Full frontend integration
🔄 Live submission updates via WebSockets
📊 Leaderboard & ranking system
🧠 AI-based code feedback
🧪 Contest mode (timed challenges)
