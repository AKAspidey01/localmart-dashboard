import './App.css'
import Login from './Components/Auth/Login/Login'
import Dashboard from './Components/Dashboard/Dashboard'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Businesses from './Components/Businesses/Businesses'
import SideMenuWrapper from './utils/SideMenuWrapper'
import AddBusiness from './Components/Businesses/AddBusiness';
import { AuthProvider } from './utils/AuthContext'
import ScrollToTop from './utils/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import AddUser from './Components/Businesses/AddUser'
import Users from './Components/Users/Users'
import AddBusinessMedia from './Components/Businesses/AddBusinessMedia'
import Categories from './Components/Categories/Categories'
import AddCategory from './Components/Categories/AddCategory'
import Advertisements from './Components/Advertisements/Advertisements'
import AddAdvertisement from './Components/Advertisements/AddAdvertisement'
import Profile from './Components/Profile/Profile'
import Cities from './Components/Cities/Cities'
import AddCities from './Components/Cities/AddCities'
import BusinessDetails from './Components/Businesses/BusinessDetails'


const Layout = () => {
  return (
    <AuthProvider>
      <Routes>
          <Route Component={ProtectedRoutes} >
            <Route exact={true} Component={Dashboard} path='/'/>
            <Route exact={true} Component={Businesses} path='/business' />
            <Route exact={true} Component={AddBusiness} path='/business/add-business'/>
            <Route exact={true} Component={AddBusinessMedia} path='/business/add-photos'/>
            <Route exact={true} Component={BusinessDetails} path='/business/details'/>
            <Route exact={true} Component={Categories} path='/categories'/>
            <Route exact={true} Component={AddCategory} path='/categories/add-category'/>
            <Route exact={true} Component={Users} path='/users'/>
            <Route exact={true} Component={AddUser} path='/users/add-user'/>
            <Route exact={true} Component={Advertisements} path='/advertisements'/>
            <Route exact={true} Component={AddAdvertisement} path='/advertisements/add-advertisements'/>
            <Route exact={true} Component={Cities} path='/cities'/>
            <Route exact={true} Component={AddCities} path='/cities/add-cities'/>
            <Route exact={true} Component={Profile} path='/profile'/>
          </Route>
          <Route exact={true} Component={Login} path='/login' />
        </Routes> 
        <div className="left-side-bar-section fixed left-0 top-0 w-full max-w-[240px] z-[99999] h-full ">
          <SideMenuWrapper/>
        </div>
    </AuthProvider>
  )
}


function App() {

  return (
    <>
      <Router>
        <ScrollToTop/>
        <Layout/>
        <Toaster 
          position="top-center"
          reverseOrder={false}
          gutter={12}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: '',
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
              fontFamily: 'Poppins',
              paddingRight: 15,
              paddingLeft: 15,
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        /> 
      </Router>
    </>
  )
}

export default App
