import {  useNavigate } from 'react-router'
import { Button } from '../ui/button'

const HomeView = () => {

  const navigate = useNavigate();

  return (
    <div>
      <Button variant='secondary' onClick={() => {
        localStorage.removeItem('userData')
        navigate("/auth/login")
      }}>Kilépés</Button>
    </div>
  )
}

export default HomeView