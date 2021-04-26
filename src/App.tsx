import "./App.scss";
import "firebase/auth";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { AuthProvider } from "shared/components/Firebase/auth";
import { AppContextProvider } from "shared/context/app.context";
import Home from "components/Home/Home";

function App() {
  console.clear();
  return (
    <AuthProvider>
      <AppContextProvider>
        {/* <Loader />
          <Toaster /> */}
        <div className="App">
          <Home />
        </div>
      </AppContextProvider>
    </AuthProvider>
  );
}

export default App;
