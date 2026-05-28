import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { IUser } from '@/interfaces/IUser'
import React from 'react'

const UserCardView = ({ user }: { user: IUser }) => {
    return (
        <Card className='flex-1 hover:cursor-pointer hover:scale-101'>
            <img
                src='/src/assets/shadcn1.png'
                className='relative z-20 aspect-video w-full object-cover brightness-60 grayscale' />
            <CardHeader>
                <CardTitle>{user.name}</CardTitle>
                <Separator className='my-3' />
                <CardDescription className='flex gap-2'>
                    {user.roles.map((r) => (
                        <Badge key={r}>{r}</Badge>
                    ))}
                    {user.isConfirmed ?
                        <Badge className='bg-green-500'>Regisztrált</Badge> :
                        <Badge className='bg-amber-500'>Nem megerősített</Badge>
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <Label htmlFor="GuardNumber">Igazolványszám:</Label>
                    <Input disabled id="GuardNumber" type='text' defaultValue={user.guardNumber}></Input>
                </div>
            </CardContent>
        </Card>
    )
}

export default UserCardView