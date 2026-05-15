import { NavLink, useNavigate } from "react-router"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import AssociationsComboBox from "../ui/associations"
import { Controller, useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { useState } from "react"
import { setTitle } from "@/lib/general"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import api from "@/lib/api"
import { toast } from "sonner"

const RegisterView = () => {
    setTitle("Plander | Regisztráció")


    const PLANDER_ADMIN_URL = "http://localhost:4200"
    const totalsteps = 3;
    const [currentStep, setCurrentStep] = useState(1)
    const navigate = useNavigate();

    const { register, handleSubmit, control, watch, formState: { errors, isValid } } = useForm({
        defaultValues: {
            associationId: "",
            username: "",
            email: "",
            password: "",
            passswordRepeat: "",
            name: "",
            address: "",
            guardNumber: ""
        }
    })

    const handleRegister = async (data: any) => {
        try {
            const { passswordRepeat, ...apiData } = data
            console.log(apiData)
            const res = await api.post("/account/register", apiData)
            if (res.status == 200) {
                toast.success("A regisztrációs kérelem sikeresen elküldve.", {
                    description: "Kérelmét az egyesület vezetője/adminja fogja elbírálni."
                })
                navigate("/auth/login")
            }
        } catch (error: any) {
            console.log(error?.response.data)
            toast.error("Sikertelen regisztráció.", {
                description: error?.response.data[0]?.description
            })
        }

    }

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
                <form id="registerForm" onSubmit={handleSubmit(handleRegister)}>

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
                    {currentStep == 2 &&
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="Name">Teljes név</Label>
                                <Input id="Name" type="text" {...register("name", { required: "Kötelező" })} />
                                {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="Email">E-mail cím</Label>
                                <Input id="Email" type="email" {...register("email", { required: "Kötelező" })} />
                                {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="Address">Lakcím</Label>
                                <Input id="Address" type="text" {...register("address", {
                                    required: "Kötelező"
                                })} />
                                {errors.address && <span className="text-sm text-red-500">{errors.address.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="GuardNumber">Igazolványszám</Label>
                                <Input id="GuardNumber" type="text" {...register("guardNumber", { required: "Kötelező" })} />
                                {errors.guardNumber && <span className="text-sm text-red-500">{errors.guardNumber.message}</span>}
                            </div>
                        </div>
                    }
                    {
                        currentStep == 3 &&

                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="Username">Felhasználónév</Label>
                                <Input id="Username" type="text" {...register("username", { required: "Kötelező" })} />
                                {errors.username && <span className="text-sm text-red-500">{errors.username.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="Password">Jelszó</Label>
                                <Input id="Password" type="password" {...register("password", { required: "Kötelező" })} />
                                {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
                            </div>
                            {/* todo */}
                            <div className="grid gap-2">
                                <Label htmlFor="Password">Jelszó mégegyszer</Label>
                                <Input id="PasswordRepeat" type="password" {...register("passswordRepeat", {
                                    required: "Kötelező", validate: (val: string) => {
                                        if (watch('password') != val)
                                            return "Nem egyeznek a jelszavak!";
                                    },
                                })} />
                                {errors.passswordRepeat && <span className="text-sm text-red-500">{errors.passswordRepeat.message}</span>}
                            </div>

                        </div>
                    }
                </form>


            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Button disabled={currentStep == 1}
                    onClick={() => setCurrentStep(prev => prev - 1)}>← Vissza</Button>
                <Button hidden={currentStep == totalsteps} disabled={!isValid}
                    onClick={() => setCurrentStep(prev => prev + 1)}>Következő →</Button>
                <Button disabled={!isValid} form="registerForm" type="submit" hidden={currentStep != totalsteps}>✓ Regisztráció</Button>
            </CardFooter>
        </Card>
    )
}
export default RegisterView