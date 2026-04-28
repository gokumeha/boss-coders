import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const FeatureDetailPage = lazy(() => import('./pages/FeatureDetailPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage'));
const AssistantPage = lazy(() => import('./pages/AssistantPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));

function AppShell({ children }) {
  return (
    <div className="app-frame">
      <Navbar />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<div className="route-loading">Loading page...</div>}>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<FeaturesPage />} path="/features" />
            <Route element={<FeatureDetailPage />} path="/features/:featureId" />
            <Route element={<CategoriesPage />} path="/categories" />
            <Route element={<CategoryDetailPage />} path="/categories/:categoryId" />
            <Route
              element={
                <ProtectedRoute>
                  <AssistantPage />
                </ProtectedRoute>
              }
              path="/assistant"
            />
            <Route
              element={
                <ProtectedRoute>
                  <ResourcesPage />
                </ProtectedRoute>
              }
              path="/resources"
            />
            <Route element={<SignInPage />} path="/signin" />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}
