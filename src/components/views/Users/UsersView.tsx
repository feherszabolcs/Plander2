import { useEffect, useState } from 'react'
import UserListView from './UserListView'
import UserCardView from './UserCardView'
import { type IUser } from '@/interfaces/IUser'
import api from '@/lib/api'
import { toast } from 'sonner'
import { setTitle } from '@/lib/general'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ListIcon, SquareUserRoundIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

const UsersView = () => {

    const [toggleListView, setToggleListView] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const [users, setUsers] = useState<IUser[]>();
    setTitle("Plander | Tagok")


    const getUsers = async () => {
        try {
            const res = await api.get("/account")
            if (res.status === 200)
                setUsers(res.data)
        } catch (error: any) {
            toast.error("Nem sikerült lekérni a tagokat!", {
                description: error.message
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div className="">
            <ToggleGroup type='single' defaultValue="card" className='flex justify-start w-full mb-5 gap-2.5 items-center'>
                <ToggleGroupItem value="list" onClick={() => setToggleListView(true)} className='data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex-1 px-3 py-1.5 text-sm rounded-md'>
                    <ListIcon />
                    Lista nézet</ToggleGroupItem>
                <ToggleGroupItem value="card" onClick={() => setToggleListView(false)} className='data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex-1 px-3 py-1.5 text-sm rounded-md'>
                    <SquareUserRoundIcon />
                    Kártya nézet</ToggleGroupItem>
            </ToggleGroup>
            {isLoading &&
                <div className='w-full h-40 flex items-center justify-center'>
                    <Spinner />
                </div>
            }

            {(!isLoading && toggleListView) &&
                <UserListView data={users!} />
            }
            {(!isLoading && !toggleListView) &&
                <div className="justify-center grid md:grid-cols-2 gap-3 xl:grid-cols-3">
                    {users?.map((user) => (
                        <UserCardView user={user} key={user.token} />
                    ))}
                </div>
            }
        </div>
    )
}

export default UsersView