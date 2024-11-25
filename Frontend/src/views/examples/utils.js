import React, { useEffect } from "react";

export const setTokenToCookie = () => {
  // Establece una cookie llamada "access_token" con el valor del token
  // La cookie expirará en 1 hora
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 1); // Establece la expiración en 1 hora
  const token = localStorage.getItem("access_token")
  document.cookie = `access_token=${token}; expires=${expirationDate.toUTCString()}; path=/; Secure; SameSite=Strict`;
};

