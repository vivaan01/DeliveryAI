# 📦 DeliveryAI – Smart Delivery Coordination Agent

**DeliveryAI** is an AI-powered voice assistant designed to automate the process of contacting customers before a delivery. It acts as a virtual delivery associate who calls customers, confirms availability, records their response, and informs the delivery partner with optimized instructions and reminders — reducing failed delivery attempts and increasing operational efficiency.

---

## 🚀 Features

- 🤖 **AI Voice Agent** to call customers and simulate a real human conversation.
- 📞 **Automated Call Workflow** that confirms delivery timing, reschedules if needed, and checks for location issues.
- 📝 **Intent Recording** via speech-to-text and NLP.
- ✉️ **Real-Time Alerts** for delivery partners via SMS and push notifications.
- ⏰ **Smart Reminders** based on delivery time and customer location.
- 📍 **Geo-Aware Scheduling** to enhance routing for delivery personnel.

---

## 🧠 How It Works

1. Order is marked for dispatch.
2. AI agent fetches customer contact info from the master database.
3. A personalized voice call is initiated using Twilio (or other calling APIs).
4. Customer's response is recorded and transcribed using Whisper STT or Google STT.
5. AI classifies the intent:
   - ✅ Available
   - 🕒 Needs more time
   - 📍 Not at delivery location
6. A summary SMS/notification is generated for the delivery partner.
7. Optional: A reminder is set based on customer response and GPS.

---

## 🛠️ Tech Stack

| Component             | Tool / Technology              |
|----------------------|-------------------------------|
| Backend API          | Node.js / Express.js           |
| AI Voice Calling     | Twilio Voice / Vonage / Exotel |
| Speech Recognition   | OpenAI Whisper / Google STT    |
| Text-to-Speech       | ElevenLabs / Google TTS        |
| Messaging/Alerts     | Twilio SMS / Firebase Notify   |
| Location Engine      | Google Maps API / GeoFire      |
| Database             | MongoDB / PostgreSQL           |
| Hosting              | Vercel / AWS / Render          |

---

## 📦 API Endpoints (Sample)

```http
GET  /api/orders/pending            # List of all pending deliveries
POST /api/call/initiate             # Start AI call for a delivery
POST /api/call/response             # Store transcribed customer response
POST /api/notification/send         # Send summary to delivery partner
GET  /api/reminder/schedule         # Schedule time/location-based reminder
