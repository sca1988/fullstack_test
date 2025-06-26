import { Container } from "@mui/material";
import AppRoutes from "./routing/AppRouter";
import ShellHeader from "./routing/ShellHeader";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";
import { LoadingProvider } from "./context/LoadingContext";
import { GlobalLoading } from "./components/GlobalLoading";

function App() {
  return (
    <>
      <CssBaseline />
      <LoadingProvider>
        <GlobalLoading/>
        <Router>
          <ShellHeader />
          <Container sx={{pl:1}}>
          <AppRoutes />
          </Container>
        </Router>
      </LoadingProvider>
 
    </>
  );
}

export default App;
