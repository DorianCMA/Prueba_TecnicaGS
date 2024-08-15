import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const DataContext = createContext();

// Crear un proveedor del contexto
export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useData = () => useContext(DataContext);
