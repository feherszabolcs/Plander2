import { NavLink } from "react-router"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import AssociationsComboBox from "../ui/associations"
import { Controller, useForm } from "react-hook-form"

const RegisterView = () => {

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            associationId: ""
        }
    })

    return (
        <Card className="mx-auto w-full max-w-sm align-items-center">
            <CardHeader>
                <CardTitle>Regisztráció</CardTitle>
                <CardDescription>
                    Válassza ki egyesületét.
                </CardDescription>
                <CardAction>
                    <NavLink to="/auth/login" className='text-primary underline-offset-4 hover:underline'>Vissza a belépéshez</NavLink>
                </CardAction>
            </CardHeader>
            <CardContent>
                <Controller control={control} rules={{ required: "Az egyesület kiválasztása kötelező a regisztrációhoz!" }}
                    name="associationId" render={({ field }) => (
                        <AssociationsComboBox field={field} />
                    )} />
            </CardContent>
        </Card>
    )
}

export default RegisterView