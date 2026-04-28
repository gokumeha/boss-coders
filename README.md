<<<<<<< HEAD
# NyayaSaathi

NyayaSaathi has been refactored from a single HTML file into a scalable full-stack application with a React frontend, an Express backend, and a shared contract layer for reusable content and validation.

## Folder Structure

```text
project-root/
  frontend/
    index.html
    package.json
    vite.config.js
    src/
      components/
        AiShowcase.jsx
        AppForm.jsx
        Categories.jsx
        Features.jsx
        Footer.jsx
        Hero.jsx
        HeroParticles.jsx
        HeroScene.jsx
        HowItWorks.jsx
        Impact.jsx
        Navbar.jsx
        ResultDisplay.jsx
        ScalesCanvas.jsx
        Testimonials.jsx
      hooks/
        useApi.js
        useForm.js
      pages/
        Home.jsx
      services/
        api.js
      styles/
        global.css
      App.jsx
      main.jsx
  backend/
    package.json
    server.js
    controllers/
      legal.controller.js
    routes/
      legal.routes.js
    services/
      ai.service.js
    utils/
      formatter.js
  shared/
    legalContract.js
    siteContent.js
  README.md
```

## Frontend

- React + Vite application
- Reusable components for every major landing-page section
- Form state managed with hooks instead of DOM manipulation
- Centralized API layer using `VITE_API_URL`
- Modular canvas animation components using `three`

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

- Express API with route, controller, service, and formatter separation
- `POST /api/legal-query` returns mock legal guidance
- Shared validation contract for category, language, and query rules
- `ai.service.js` is intentionally structured so an AI provider can be plugged in later

### Run Backend

```bash
cd backend
npm install
node server.js
```

## API Contract

### Request

```json
{
  "category": "property",
  "language": "English",
  "query": "My landlord has not returned my deposit."
}
```

### Response

```json
{
  "summary": "Mock summary",
  "rights": "Plain-language rights summary",
  "rightsList": ["Right 1", "Right 2"],
  "laws": ["Law 1", "Law 2"],
  "steps": ["Step 1", "Step 2"],
  "urgency": "medium",
  "authority": "Relevant authority",
  "draft": "Complaint draft text",
  "helplines": [{ "name": "NALSA", "number": "15100 / nalsa.gov.in" }]
}
```

The core fields requested for future API compatibility are `rights`, `steps`, `urgency`, `authority`, and `draft`. The extra fields support the richer UI already present in the original concept.

## Environment Variables

Frontend:

```bash
VITE_API_URL=http://localhost:5000
```

Backend:

```bash
PORT=5000
API_KEYS=
NODE_ENV=development
```

## Extension Notes

- Replace the mock logic in [backend/services/ai.service.js](C:\Users\Senhan Salavudheen\OneDrive\Desktop\Downloads\hackathon\backend\services\ai.service.js) with an AI provider client when ready.
- Shared content and validation live in [shared/siteContent.js](C:\Users\Senhan Salavudheen\OneDrive\Desktop\Downloads\hackathon\shared\siteContent.js) and [shared/legalContract.js](C:\Users\Senhan Salavudheen\OneDrive\Desktop\Downloads\hackathon\shared\legalContract.js).
- The frontend only talks to the backend through [frontend/src/services/api.js](C:\Users\Senhan Salavudheen\OneDrive\Desktop\Downloads\hackathon\frontend\src\services\api.js), making API swaps easier later.
=======
# ⚖️ NyayaSaathi

NyayaSaathi is an AI-powered legal aid platform built to help Indian citizens understand their rights without needing a lawyer.  
It simplifies complex legal information into easy, actionable guidance in multiple Indian languages.  
Users can describe their problem in plain language and receive relevant laws, rights, and step-by-step actions.  
The platform also generates ready-to-file complaint drafts and suggests the correct authority to approach.  
It supports categories like property disputes, labour issues, consumer fraud, domestic violence, FIR, and cybercrime.  
NyayaSaathi aims to bridge the justice gap for people who cannot afford legal assistance.  
The platform is completely free, private, and accessible to everyone.  
Built using HTML, CSS, JavaScript, Three.js, and AI APIs.  
Designed with a clean, user-friendly interface for first-time legal users.  
This project was developed for a social impact hackathon.  

👥 Team: Boss Coders
>>>>>>> f8e7f23ec79b14cea9ccc1cc610e221e21fbe489
