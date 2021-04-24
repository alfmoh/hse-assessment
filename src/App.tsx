import React from "react";
import "./App.scss";
import "firebase/auth";
import Auth from "./components/Auth/Auth";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { AuthProvider } from "shared/components/Firebase/auth";
import { AppContextProvider } from "shared/context/app.context";

function App() {
  console.clear();
  return (
    <AuthProvider>
      <AppContextProvider>
        {/* <Loader />
          <Toaster /> */}
        <div className="App">
          <Auth />
        </div>
      </AppContextProvider>
    </AuthProvider>
  );
}

export default App;
