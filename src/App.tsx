import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ServicesPage from "./pages/Services";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import BookingPage from "./pages/BookingPage";
import EvaluationPage from "./pages/EvaluationPage";
import ProductsPage from "./pages/ProductsPage";
import ReviewsPage from "./pages/ReviewsPage";
import AdminDashboard from "./pages/AdminDashboard";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { BookingConfirmation } from "./features/booking/BookingConfirmation";
import { EvaluationConfirmation } from "./features/evaluation/EvaluationConfirmation";

/**
 * Componente principal de la aplicación.  Define las rutas y los
 * layouts que se utilizan para cada una de ellas.  Este archivo es
 * fácilmente modificable para añadir nuevas páginas o ajustar la
 * estructura general.
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Páginas públicas envueltas por el layout */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/services"
          element={
            <PublicLayout>
              <ServicesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/services/:id"
          element={
            <PublicLayout>
              <ServiceDetailsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/booking"
          element={
            <PublicLayout>
              <BookingPage />
            </PublicLayout>
          }
        />
        <Route
          path="/booking/confirmation/:id"
          element={
            <PublicLayout>
              <BookingConfirmation />
            </PublicLayout>
          }
        />
        <Route
          path="/evaluation"
          element={
            <PublicLayout>
              <EvaluationPage />
            </PublicLayout>
          }
        />
        <Route
          path="/evaluation/confirmation/:id"
          element={
            <PublicLayout>
              <EvaluationConfirmation />
            </PublicLayout>
          }
        />
        <Route
          path="/products"
          element={
            <PublicLayout>
              <ProductsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/reviews"
          element={
            <PublicLayout>
              <ReviewsPage />
            </PublicLayout>
          }
        />
        {/* Panel de administración */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
