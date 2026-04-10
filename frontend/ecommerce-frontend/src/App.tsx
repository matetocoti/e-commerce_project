import AppRoutes from "./routes/AppRoutes";
import { AppToaster } from "./components/ui/AppToaster";


function App() {
  return (
    <>
      <AppRoutes />
      <AppToaster />
    </>
  );
}

export default App;