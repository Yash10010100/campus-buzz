import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.js'

import {
  AuthContainer,
} from './components'

import {
  Dashboard,
  Events,
  History,
  Home,
  Login,
  Participants,
  Preferences,
  Signup,
  EventPage,
} from './pages'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: (
          <AuthContainer authentication={false}>
            <Home />
          </AuthContainer>
        )
      },
      {
        path: "auth",
        children: [
          {
            path: "",
            element: (
              <AuthContainer authentication={false}>
                <Signup />
              </AuthContainer>
            )
          },
          {
            path: "login",
            element: (
              <AuthContainer authentication={false}>
                <Login />
              </AuthContainer>
            )
          }
        ]
      },
      {
        path: "/user",
        children: [
          {
            path: "",
            element: (
              <AuthContainer authentication>
                <Dashboard />
              </AuthContainer>
            )
          },
          {
            path: "preferences",
            element: (
              <AuthContainer authentication usertype='student'>
                <Preferences />
              </AuthContainer>
            )
          },
          {
            path: "participants",
            element: (
              <AuthContainer authentication usertype='organizer'>
                <Participants />
              </AuthContainer>
            )
          },
          {
            path: "history",
            element: (
              <AuthContainer authentication>
                <History />
              </AuthContainer>
            )
          },
        ],
      },
      {
        path: "/events",
        children: [
          {
            path: "",
            element: (
              <AuthContainer authentication>
                <Events />
              </AuthContainer>
            )
          },
          {
            path: ":eventId",
            element: (
              <AuthContainer authentication>
                <EventPage />
              </AuthContainer>
            )
          }
        ],
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)