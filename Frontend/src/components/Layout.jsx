import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <h1>Gestión de Nodos</h1> {/* Cambié el título a Gestión de Nodos */}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
