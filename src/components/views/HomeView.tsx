import { useNavigate } from 'react-router'
import { Button } from '../ui/button'
import { setTitle } from '@/lib/general';

const HomeView = () => {
  setTitle("Plander | Kezdőlap")

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