import React, { useEffect, useState } from 'react'
import UserListView from './UserListView'
import UserCardView from './UserCardView'
import { Button } from '@/components/ui/button'
import { type IUser } from '@/interfaces/IUser'
import api from '@/lib/api'
import { toast } from 'sonner'

const UsersView = () => {

    const [toggleListView, setToggleListView] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const [users, setUsers] = useState<IUser[]>();

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
            <div className='flex justify-start gap-2 items-center mb-3'>
                <Button onClick={() => setToggleListView(true)}>lista</Button>
                <Button onClick={() => setToggleListView(false)}>kartyak</Button>
            </div>
            {isLoading &&
                <>
                    <p>Töltés</p>
                </>}

            {(!isLoading && toggleListView) &&
                <UserListView />
            }
            {(!isLoading && !toggleListView) &&
                <div className="flex justify-center flex-row gap-2">
                    {users?.map((user) => (
                        <UserCardView user={user} />
                    ))}
                </div>
            }
        </div>
    )
}

export default UsersView