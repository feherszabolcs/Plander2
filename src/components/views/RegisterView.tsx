import { NavLink } from "react-router"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import AssociationsComboBox from "../ui/associations"
import { Controller, useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { useState } from "react"
import { setTitle } from "@/lib/general"

const RegisterView = () => {
    setTitle("Plander | Regisztráció")


    const PLANDER_ADMIN_URL = "http://localhost:4200"
    const totalsteps = 2;
    const [currentStep, setCurrentStep] = useState(1)

    const { register, handleSubmit, control, formState: { errors, isValid } } = useForm({
        defaultValues: {
            associationId: ""
        }
    })

    return (
        <Card className="mx-auto w-full max-w-sm align-items-center">
            <CardHeader>
                <CardTitle>Regisztráció</CardTitle>
                <CardDescription>
                    <p>Válassza ki egyesületét.</p> <br />
                </CardDescription>
                <CardAction>
                    <NavLink to="/auth/login" className='text-primary underline-offset-4 hover:underline'>Vissza a belépéshez</NavLink>
                </CardAction>
            </CardHeader>
            <CardContent>
                {currentStep == 1 &&
                    <>
                        <Controller control={control} rules={{ required: "Az egyesület kiválasztása kötelező a regisztrációhoz!" }}
                            name="associationId" render={({ field }) => (
                                <AssociationsComboBox field={field} />
                            )} />
                        <p className="my-4 mx-auto">Nem találja egyesületét? Indítsa el a regisztrációs folyamatot
                            <a href={PLANDER_ADMIN_URL} target="_blank" className='text-primary underline-offset-4 hover:underline'> ezen az oldalon.</a></p>
                    </>
                }

            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Button disabled={currentStep == 1}
                    onClick={() => setCurrentStep(prev => prev - 1)}>← Vissza</Button>
                <Button hidden={currentStep == totalsteps} disabled={!isValid}
                    onClick={() => setCurrentStep(prev => prev + 1)}>Következő →</Button>
                <Button hidden={currentStep != totalsteps}>✓ Regisztráció</Button>
            </CardFooter>
        </Card>
    )
}
export default RegisterView