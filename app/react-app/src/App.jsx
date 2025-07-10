import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { FullPage, PageLoader } from './components'
import { useEffect, useState } from 'react'
import { getCurrentUser, refreshAccessTokens } from './features/auth'
import { login as storeLogin } from './redux/authSlice'

function App() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const status = useSelector(state => state.auth.status)

  useEffect(() => {
    if (!status) {
      getCurrentUser()
        .then((res) => {
          dispatch(storeLogin({ user: res.data }))
          setLoading(false)
        })
        .catch((err) => {
          refreshAccessTokens()
            .then((res) => {
              dispatch(storeLogin({ user: res.data.user }))
              setLoading(false)
              navigate("/events")
            })
            .catch((err) => {
              setLoading(false)
            })
        })
    }
  }, [status])

  return loading ? (
    <FullPage>
      <PageLoader />
    </FullPage>) : (
    <FullPage>
      <Outlet />
      {/*todo : footer */}
    </FullPage>
  )
}

export default App