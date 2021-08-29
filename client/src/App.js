import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import SubscriptionPage from "./components/views/SubscriptionPage/SubscriptionPage";
import VideoDetailPage from "./components/views/VideoDetailPage/VideoDetailPage";
import VideoUploadPage from "./components/views/VideoUploadPage/VideoUploadPage";
import Auth from "./hoc/auth";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Auth(LandingPage, null)} />
        <Route exact path="/login" component={Auth(LoginPage, false)} />
        <Route exact path="/register" component={Auth(RegisterPage, false)} />
        <Route exact path="/video/upload" component={Auth(VideoUploadPage, true)} />
        <Route exact path="/video/:videoId" component={Auth(VideoDetailPage, null)} />
        <Route exact path="/subscription" component={Auth(SubscriptionPage, true)} />
      </Switch>
    </Router>
  );
}

export default App;
