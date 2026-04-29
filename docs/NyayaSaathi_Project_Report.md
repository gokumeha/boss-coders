# NyayaSaathi Project Report

## Project Title
NyayaSaathi: AI-Enabled Legal Guidance and Case Support Platform

## Domain & Summary
Domain: Legal Technology, Access to Justice, and Civic Support Systems.

NyayaSaathi is a full-stack legal-tech platform designed to simplify early-stage legal help for Indian citizens. It combines a guided assistant, official legal research pathways, and a persistent case workspace so users can move from confusion to action with clearer next steps, relevant laws, authority suggestions, and organized evidence support.

## The Problem
Access to legal support is often fragmented, intimidating, and difficult to act on for first-time users. Many citizens do not know which legal category their issue belongs to, which authority they should approach first, or what documents and evidence they should preserve. Public legal information exists, but it is spread across multiple portals and often lacks plain-language guidance. As a result, users delay action, miss critical records, and struggle to convert a real-life problem into a structured legal complaint or research trail.

## Key Findings
- Citizens need guided classification before they need deep legal research; the first barrier is usually understanding what type of issue they are facing.
- Plain-language summaries, urgency signals, next-step checklists, and authority suggestions are more actionable than raw legal text alone.
- Trust improves when the platform clearly links users to official or recognizable sources such as Indian Kanoon and the eCourts portal instead of presenting unsupported claims.
- A legal assistant becomes more useful when the guidance continues into a working case space that stores notes, a timeline, evidence categories, and a downloadable draft.
- A modular full-stack architecture makes it easier to scale the product across categories, languages, and future integrations.

## How it Works
- The frontend is built with React, Vite, and React Router to create a multi-page user experience across the landing page, features, categories, assistant workspace, sign-in, and research pages.
- The legal assistant flow asks the user to choose a language, select a category, and describe the issue in plain language before generating structured legal guidance.
- The backend is built with Node.js and Express, validates the payload, produces AI-assisted legal guidance, and enriches the response with legal research support.
- The system integrates Indian Kanoon through a token-based backend adapter and provides official eCourts access pathways where a stable public API is not available.
- The assistant output includes a situation summary, rights overview, relevant laws, recommended steps, urgency level, authority to approach, and a first-person complaint draft.
- The workspace layer extends the guidance into action with a checklist, evidence locker, case notes, incident timeline, local persistence, and downloadable case artifacts.
- The resources page lets the user search supported legal sources and continue their research through direct source links or official portal guidance.

## Results snapshots
- Snapshot 1: A routed and structured product flow replaces the earlier single-page approach, giving the project clearer navigation and better separation between discovery, assistance, and research.
- Snapshot 2: The assistant workspace generates category-specific guidance with urgency tagging, legal rights, laws, practical steps, and the best authority to approach first.
- Snapshot 3: The action studio adds a persistent case workspace with evidence grouping, case notes, a dated timeline, an interactive checklist, and a downloadable draft letter.
- Snapshot 4: The research module connects users to Indian Kanoon and official eCourts pathways, helping the platform move beyond isolated AI text into verifiable legal research support.
- Snapshot 5: Firebase-backed sign-in and history support make the experience more personal by retaining user-linked activity and saved assistant interactions.

## Future Scope
- Deploy the full stack to production with managed environment variables and stable hosting.
- Expand multilingual support and improve legal guidance quality across more Indian languages and regional contexts.
- Add OCR, document extraction, and smart evidence summarization for uploaded files.
- Introduce lawyer referral flows, legal-aid escalation pathways, and district-wise authority mapping.
- Add analytics to measure completion rates, common grievance types, and guidance quality over time.
- Support admin dashboards, feedback loops, and data-backed refinement of prompts and legal categories.

## References
- README.md
- progress.md
- frontend/src/pages/AssistantPage.jsx
- frontend/src/components/AppForm.jsx
- frontend/src/components/ResultDisplay.jsx
- frontend/src/components/AssistantActionStudio.jsx
- frontend/src/lib/caseWorkspace.js
- frontend/src/pages/ResourcesPage.jsx
- backend/server.js
- backend/services/ai.service.js
- backend/services/research.service.js
- backend/services/indiankanoon.service.js
- backend/services/ecourts.service.js
- https://indiankanoon.org/
- https://services.ecourts.gov.in/
