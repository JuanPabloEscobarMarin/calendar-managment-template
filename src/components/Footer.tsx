import React from "react";
import { Link } from 'react-router-dom';
import { useConfig } from "../contexts/ConfigContext";

/**
 * Pie de página con información básica del negocio.  Utiliza la
 * configuración para mostrar el nombre, el teléfono y el correo.  Se
 * pueden añadir enlaces a redes sociales u otros datos a medida.
 */
export const Footer: React.FC = () => {
  const config = useConfig();
  const currentYear = new Date().getFullYear();
  return (
    <>
    <footer className="footer bg-[#1a1a1a] text-white grid">
      <div className="footer-content grid grid-cols-4 gap-4 mt-8 pl-4 ml-4">
        <div className="footer-section mb-4">
          <h3 className="text-[#f5c518] mb-3 text-lg font-semibold">{config.businessName}</h3>
          <p>{config.tagline}</p>
        </div>
        
        <div className="footer-section">
          <h3 className="text-[#f5c518] mb-1 text-lg font-semibold">Quick Links</h3>
          <ul>
            <li className="mb-2"><Link to="/">Home</Link></li>
            <li className="mb-2"><Link to="/services">Services</Link></li>
            <li className="mb-2"><Link to="/gallery">Gallery</Link></li>
            <li className="mb-2"><Link to="/about">About Us</Link></li>
            <li className="mb-2"><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="text-[#f5c518] mb-1 text-lg font-semibold">Hours</h3>
          <ul className="hours-list">
            <li><span>Monday - Friday:</span> 9:00 AM - 8:00 PM</li>
            <li><span>Saturday:</span> 10:00 AM - 6:00 PM</li>
            <li><span>Sunday:</span> Closed</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="text-[#f5c518] mb-1 text-lg font-semibold">Contact</h3>
          <ul className="contact-list">
            <li><i className="icon-location"></i> 123 Barber Street, City</li>
            <li><i className="icon-phone"></i> {config.contactPhone}</li>
            <li><i className="icon-email"></i> {config.contactEmail}</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom flex place-content-center">
        <p>&copy; {currentYear} Barbershop. All rights reserved.</p>
      </div>
    </footer>
    </>
  );
};
