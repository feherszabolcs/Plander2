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
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox"
import api from "@/lib/api"
import { useForm } from "react-hook-form"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router"
import { toast, Toaster } from "sonner"



const LoginView = () => {

  const { login } = useAuth();
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      password: "",
      association: ""
    }
  })

  const onSubmit = async (data: any) => {
    try {
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

  }



  return (
    <Card className="mx-auto w-full max-w-sm align-items-center">
      <CardHeader>
        <CardTitle>Bejelentkezés</CardTitle>
        <CardDescription>
          Jelentkezzen be felhasználónevével és jelszavával.
        </CardDescription>
        <CardAction>
          <Button variant='link'>Regisztráció</Button>
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
              <Label htmlFor="Username">Felhasználónév</Label>
              <Combobox>
                <ComboboxInput placeholder="Válassza ki egyesületét" />
                <ComboboxContent>
                  <ComboboxEmpty>Nincs találat</ComboboxEmpty>
                  <ComboboxList>

                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" form="loginForm" className="w-full">Bejelentkezés</Button>
      </CardFooter>
    </Card>
  )
}

export default LoginView