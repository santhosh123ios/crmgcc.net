import { RouterProvider } from 'react-router-dom';
import './App.css'
import LoginLayoutAdmin from './layout/admin/LoginLayoutAdmin';
import router from './routes/Routes';


function App() {

  return (
   
      <>
        <RouterProvider router={router}/>
      </>
  )
}

export default App
