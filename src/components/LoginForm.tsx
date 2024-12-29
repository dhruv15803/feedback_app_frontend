import { useContext, useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { API_URL } from '@/App';
import { useToast } from '@/hooks/use-toast'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { Eye, EyeOff } from 'lucide-react'
import { AppContext } from '@/context/AppContext'
import { AppContextType } from '@/types'
import axios from 'axios'

const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
      message: "Password is required.",
    }),
  })

const LoginForm = () => {
    const navigate = useNavigate();
    const {loggedInUser,setLoggedInUser} = useContext(AppContext) as AppContextType;
    const {toast} = useToast();
    const location = useLocation();


    if(loggedInUser!==null) {
        return <Navigate to="/"/>
    }

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword,setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: "",
        },
    })

    const  onSubmit = async (values: z.infer<typeof formSchema>) =>  {
        // api call
        try {
            const {email,password} = values;
            setIsLoading(true);
            const response = await axios.post(`${API_URL}/auth/login`,{
                email,
                password,
            } ,{
                withCredentials:true,
            });
            console.log(response);
            setLoggedInUser(response.data.user);
            form.reset();
            toast({title: "Login successfull"});
            const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
            navigate(from, { replace: true });
        } catch (error:any) {
            console.log(error);
            toast({title:"Login failed",description:error.response.data.message,variant:"destructive"});
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <>
<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} />
                <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                        ) : (
                        <Eye className="h-4 w-4" />
                        )}
                </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
    </>
  );
}

export default LoginForm;
