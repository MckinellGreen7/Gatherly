import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminProfile from "./pages/AdminProfile";
import UserEvents from "./pages/UserEvents";
import { Navigate } from "react-router-dom";
import EventPage from "./pages/EventPage";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/signin" element={<Signin/>}></Route>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}></Route>
          <Route path="/admin/events" element={<AdminEvents/>}></Route>
          <Route path="/admin/profile" element={<AdminProfile/>}></Route>
          <Route path="/user/events" element={<UserEvents/>}></Route>
          <Route path="/user/event/:eventId" element={<EventPage/>}></Route>
          <Route path="/user/profile" element={ <UserProfile/> }></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;