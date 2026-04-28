import { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';

import Footer from './components/Footer';
import LegalChatbot from './components/LegalChatbot';
import Navbar from './components/Navbar';
import ScrollRevealController from './components/ScrollRevealController';

const Home = lazy(() => import('./pages/Home'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const FeatureDetailPage = lazy(() => import('./pages/FeatureDetailPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage'));
const AssistantPage = lazy(() => import('./pages/AssistantPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));

function AppShell() {
  return (
    <div className="app-frame">
      <Navbar />
      <ScrollRevealController />
      <main className="app-main">
        <Outlet />
      </main>
      <LegalChatbot />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="route-loading">Loading page...</div>}>
        <Routes>
          <Route element={<SignInPage />} path="/signin" />
          <Route element={<AppShell />}>
            <Route element={<Home />} path="/" />
            <Route element={<FeaturesPage />} path="/features" />
            <Route element={<FeatureDetailPage />} path="/features/:featureId" />
            <Route element={<CategoriesPage />} path="/categories" />
            <Route element={<CategoryDetailPage />} path="/categories/:categoryId" />
            <Route element={<AssistantPage />} path="/assistant" />
            <Route element={<ResourcesPage />} path="/resources" />
          </Route>
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
