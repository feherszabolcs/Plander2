import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import api from "@/lib/api"
import { useForm, Controller } from "react-hook-form"
import { useAuth } from "@/context/AuthContext"
import { NavLink, useNavigate } from "react-router"
import { toast } from "sonner"
import { useState } from "react"
import AssociationsComboBox from "../ui/associations"
import { setTitle } from "@/lib/general"



const LoginView = () => {
  setTitle("Plander | Bejelentkezés")


  const { login } = useAuth();
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      password: "",
      associationId: ""
    }
  })

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      const res = await api.post("/account/login", data)
      if (res.status === 200) {
        login(res.data)
        toast.success("Sikeres bejelentkezés.")
        navigate("/")
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Sikertelen bejelentkezés.", {
          description: "Hibás felhasználónév vagy jelszó."
        })
      } else {
        toast.error("Sikertelen bejelentkezés.", {
          description: error instanceof Error ? error.message : "Ismeretlen hiba történt."
        })
      }
    }
    finally {
      setIsLoading(false)
    }

  }

  return (
    <Card className="mx-auto w-full max-w-sm align-items-center">
      <CardHeader>
        <CardTitle>Bejelentkezés</CardTitle>
        <CardDescription>
          Jelentkezzen be felhasználónevével és jelszavával.
        </CardDescription>
        <CardAction>
          <NavLink to="/auth/register" className='text-primary underline-offset-4 hover:underline'>Regisztráció</NavLink>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="loginForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="Username">Felhasználónév</Label>
              <Input id="Username" type="text" {...register("username", { required: "Kötelező" })} />
              {errors.username && <span className="text-sm text-red-500">{errors.username.message}</span>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Jelszó</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Elfelejtett jelszó?
                </a>
              </div>
              <Input id="password" type="password" required {...register("password", { required: "Kötelező" })} />
              {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Username">Egyesület</Label>
              <Controller
                name="associationId"
                control={control}
                rules={{ required: "Válasszon egy egyesületet!" }}
                render={({ field }) => (
                  <AssociationsComboBox field={field} />
                )}
              />
              {errors.associationId && (
                <span className="text-sm text-red-500">{errors.associationId.message}</span>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button disabled={isLoading} type="submit" form="loginForm" className="w-full">Bejelentkezés</Button>
      </CardFooter>
    </Card>
  )
}

export default LoginView