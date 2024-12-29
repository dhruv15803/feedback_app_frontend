import { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/hooks/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { AppContext } from '@/context/AppContext'
import { AppContextType, FormType } from '@/types'
import axios from 'axios'
import { API_URL } from '@/App'

const formSchema = z.object({
  field_title1: z.string().min(1, 'This field is required'),
  field_title2: z.string().min(1, 'This field is required'),
  field_title3: z.string().min(1, 'This field is required'),
  theme: z.string(),
})

const themes = [
  { value: 'default', label: 'Default', color: '#f3f4f6' },
  { value: 'red', label: 'Red', color: '#fee2e2' },
  { value: 'blue', label: 'Blue', color: '#dbeafe' },
  { value: 'green', label: 'Green', color: '#dcfce7' },
  { value: 'purple', label: 'Purple', color: '#f3e8ff' },
]

const CreateFormPage = () => {
  const {loggedInUser} = useContext(AppContext) as AppContextType;
  const [isLoading, setIsLoading] = useState(false)
  const [createdForm,setCreatedForm] = useState<FormType | null>(null);
  const { toast } = useToast()
  console.log(createdForm);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      field_title1: '',
      field_title2: '',
      field_title3: '',
      theme: 'default',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const {field_title1,field_title2,field_title3,theme} = values;
        setIsLoading(true);
        const response = await axios.post(`${API_URL}/form`,{
            field_title1,
            field_title2,
            field_title3,
            theme,
        },{
            withCredentials:true,
        });
        console.log(response);
        setCreatedForm(response.data.form);
        toast({
            title:"Created form",
        });
        form.reset();
    } catch (error:any) {
        console.log(error);
        toast({title:"Something went wrong",variant:"destructive"});
    } finally {
        setIsLoading(false);
    }
  }

  const watchTheme = form.watch('theme')

  useEffect(() => {
    const selectedTheme = themes.find(t => t.value === watchTheme)
    if (selectedTheme) {
      document.documentElement.style.setProperty('--theme-color', selectedTheme.color)
    }
  }, [watchTheme])

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <Card className="w-full max-w-2xl mx-auto mt-8 transition-colors duration-300" style={{ backgroundColor: 'var(--theme-color, #f3f4f6)' }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Your Feedback Form</CardTitle>
          <CardDescription>Welcome, {loggedInUser?.username}! Design your personalized feedback form below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="field_title1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question 1</FormLabel>
                    <FormControl>
                      <Input placeholder="What's one positive thing about me?" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="field_title2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question 2</FormLabel>
                    <FormControl>
                      <Input placeholder="What's one thing you don't like about me?" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="field_title3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question 3</FormLabel>
                    <FormControl>
                      <Input placeholder="How can I change?" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select a theme color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem key={theme.value} value={theme.value}>
                            <div className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: theme.color }}
                              />
                              {theme.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Form'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateFormPage

