import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignIn from "./Views/signIn";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/user/signIn" element={<SignIn/>}></Route>
        </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
