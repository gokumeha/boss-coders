# NyayaSaathi

NyayaSaathi is now a routed full-stack web application instead of a single long dashboard page. The app uses:

- React + Vite for the frontend
- React Router for multi-page navigation
- Firebase Authentication + Firestore for Google sign-in and saved user activity
- Node.js + Express as the integration layer for legal guidance and external legal research providers
- Indian Kanoon integration through a backend token-based API adapter
- Official eCourts access pathways through a dedicated adapter layer

## Updated Product Flow

Instead of putting everything on one page, the app now uses dedicated routes:

- `/` Landing page
- `/features` Feature overview
- `/features/:featureId` Feature detail pages
- `/categories` Category overview
- `/categories/:categoryId` Category detail pages
- `/signin` Google sign-in
- `/assistant` Protected legal assistant workspace
- `/resources` Protected legal research and court access page

## Project Structure

```text
hackathon/
  frontend/
    index.html
    package.json
    vite.config.js
    src/
      components/
        AppForm.jsx
        Footer.jsx
        HeroScene.jsx
        Navbar.jsx
        ProtectedRoute.jsx
        ResultDisplay.jsx
        ScalesCanvas.jsx
      context/
        AuthContext.jsx
        LanguageContext.jsx
      hooks/
        useApi.js
        useAssistantHistory.js
        useForm.js
      lib/
        firebase.js
      pages/
        AssistantPage.jsx
        CategoriesPage.jsx
        CategoryDetailPage.jsx
        FeatureDetailPage.jsx
        FeaturesPage.jsx
        Home.jsx
        ResourcesPage.jsx
        SignInPage.jsx
      services/
        api.js
        firestore.js
      styles/
        global.css
      App.jsx
      main.jsx
  backend/
    server.js
    controllers/
      legal.controller.js
      research.controller.js
    routes/
      legal.routes.js
      research.routes.js
    services/
      ai.service.js
      ecourts.service.js
      indiankanoon.service.js
      research.service.js
    utils/
      formatter.js
  shared/
    legalContract.js
    siteContent.js
  README.md
```

## Frontend Setup

Create `frontend/.env` from `frontend/.env.example`:

```bash
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Note for Windows PowerShell:
If `npm` is blocked by execution policy, use `npm.cmd install` and `npm.cmd run dev`.

## Backend Setup

Create `backend/.env` from `backend/.env.example`:

```bash
PORT=5000
API_KEYS=
IK_API_TOKEN=
NODE_ENV=development
```

Run the backend:

```bash
cd backend
npm install
node server.js
```

## Firebase Usage

Firebase is used for:

- Google sign-in
- Persisting the signed-in user profile
- Saving recent assistant activity to Firestore

The relevant frontend files are:

- [AuthContext.jsx](C:\Users\Senhan%20Salavudheen\OneDrive\Desktop\Downloads\hackathon\frontend\src\context\AuthContext.jsx)
- [firebase.js](C:\Users\Senhan%20Salavudheen\OneDrive\Desktop\Downloads\hackathon\frontend\src\lib\firebase.js)
- [firestore.js](C:\Users\Senhan%20Salavudheen\OneDrive\Desktop\Downloads\hackathon\frontend\src\services\firestore.js)

## Indian Kanoon Integration

The backend exposes a provider adapter for Indian Kanoon:

- [indiankanoon.service.js](C:\Users\Senhan%20Salavudheen\OneDrive\Desktop\Downloads\hackathon\backend\services\indiankanoon.service.js)

It uses `IK_API_TOKEN` on the server and returns mapped result cards with source links.

Routes:

- `POST /api/research/search`
- `GET /api/research/status`

Payload example:

```json
{
  "source": "indiankanoon",
  "query": "consumer protection refund delay"
}
```

## eCourts Integration Reality

An official public eCourts portal is integrated through a dedicated adapter:

- [ecourts.service.js](C:\Users\Senhan%20Salavudheen\OneDrive\Desktop\Downloads\hackathon\backend\services\ecourts.service.js)

Important:

- The code does not pretend there is a stable public eCourts API when one was not found.
- Instead, it exposes official search-path guidance and portal links through the resources page and assistant result surface.
- This keeps the architecture honest and makes it easy to swap in a sanctioned API later if one becomes available.

## Assistant API

Request:

```json
{
  "category": "property",
  "language": "Hindi",
  "query": "My landlord has not returned my deposit."
}
```

Response shape:

```json
{
  "summary": "string",
  "rights": "string",
  "rightsList": ["string"],
  "laws": ["string"],
  "steps": ["string"],
  "urgency": "low|medium|high",
  "authority": "string",
  "draft": "string",
  "helplines": [{ "name": "string", "number": "string" }],
  "research": {
    "indiankanoon": {
      "status": "ok|unconfigured|error",
      "message": "string",
      "documents": []
    },
    "ecourts": {
      "status": "official-portal",
      "portalUrl": "string",
      "note": "string",
      "searchModes": ["string"]
    }
  }
}
```

## Verified

The current code was verified with:

- `npm.cmd run build` in `frontend`
- `node server.js` in `backend`

## Notes

- Language support is now connected to app state, routed pages, and assistant submission instead of being decorative.
- Google sign-in works once Firebase web credentials are added.
- Indian Kanoon search works once `IK_API_TOKEN` is configured.
- eCourts is integrated through official portal workflows until a stable public API contract is available.
