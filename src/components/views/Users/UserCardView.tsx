import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { IUser } from '@/interfaces/IUser'
import { Separator } from 'radix-ui'
import React from 'react'

const UserCardView = ({ user }: { user: IUser }) => {
    return (
        <Card className='flex-1'>
            <CardHeader>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription className='flex gap-2'>
                    {user.roles.map((r) => (
                        <Badge>{r}</Badge>
                    ))}
                    {user.isConfirmed ?
                        <Badge className='bg-green-500-500'>Regisztrált</Badge> :
                        <Badge className='bg-amber-500'>Nem megerősített</Badge>
                    }
                </CardDescription>
            </CardHeader>
        </Card>
    )
}

export default UserCardView