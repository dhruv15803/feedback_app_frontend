import { useContext, useState } from 'react'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Eye, EyeOff, Upload } from 'lucide-react'
import { API_URL } from '@/App'
import { AppContext } from '@/context/AppContext'
import { AppContextType } from '@/types'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    username: z.string().min(3, {
      message: "Username must be at least 3 characters long.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const RegisterForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {loggedInUser,setLoggedInUser} = useContext(AppContext) as AppContextType;

    if(loggedInUser!==null) {
        return <Navigate to="/"/>
    }

    const [isLoading, setIsLoading] = useState(false)
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        },
      })

    const handleImageUpload = async (file: File) => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset',import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
        try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
            {
            method: 'POST',
            body: formData,
            }
        );
        const data = await response.json()
        console.log(data);
        setUploadedImageUrl(data.url);
        } catch (error) {
        console.error('Error uploading image:', error)
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            const {email,username,password} = values;
            if(uploadedImageUrl==="" || uploadedImageUrl===null) {
                toast({
                    title:"please upload a profile image",
                    variant:"destructive",
                });
                return;
            }
            const response = await axios.post(`${API_URL}/auth/register`,{
                email:email,
                username:username,
                password:password,
                profileImageUrl:uploadedImageUrl,
            },{withCredentials:true});            
            console.log(response);
            setLoggedInUser(response.data.user);
            form.reset();
            const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
            navigate(from, { replace: true });
          toast({
            title: "Registration Successful",
            description: "Your account has been created.",
          })
        } catch (error:any) {
            console.log(error);
          toast({
            title: "Registration Failed",
            description: error.response.data.message,
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
    }
  
    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            name="username"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                    <Input placeholder="johndoe" {...field} />
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
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        {...field}
                    />
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
            <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                    <div className="relative">
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        {...field}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                        {showConfirmPassword ? (
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
            <FormItem>
            <FormLabel>Profile Image</FormLabel>
            <FormControl>
                <div className="flex items-center space-x-2">
                <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          setProfileImage(file);
                          await handleImageUpload(file);
                        }
                      }}
                    className="hidden"
                    id="profile-image"
                />
                <label
                    htmlFor="profile-image"
                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                </label>
                {uploadedImageUrl && (
                    <div className="relative w-10 h-10 overflow-hidden rounded-full">
                      <img
                        src={uploadedImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {profileImage && !uploadedImageUrl && (
                    <span className="text-sm text-muted-foreground">{profileImage.name}</span>
                  )}
                </div>
            </FormControl>
            </FormItem>
            <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
            </Button>
        </form>
        </Form>
    )
}

export default RegisterForm

