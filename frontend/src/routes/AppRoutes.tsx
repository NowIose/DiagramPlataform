import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PublicRoute } from '../components/auth/PublicRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import ProjectsPage from '../pages/dashboard/ProjectsPage';
import EntitiesPage from '../pages/dashboard/EntitiesPage';
import GeneratorPage from '../pages/dashboard/GeneratorPage';
import TemplatesPage from '../pages/dashboard/TemplatesPage';
import CollaboratorsPage from '../pages/dashboard/CollaboratorsPage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import DocsPage from '../pages/dashboard/DocsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="entities" element={<EntitiesPage />} />
          <Route path="generator" element={<GeneratorPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="collaborators" element={<CollaboratorsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="docs" element={<DocsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};
