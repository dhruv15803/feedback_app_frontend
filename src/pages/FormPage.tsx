import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetForm } from '@/hooks/useGetForm'
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Loader } from '@/components/Loader'
import axios from 'axios'
import { API_URL } from '@/App'
import { UserCircle } from 'lucide-react'
import { UserType } from '@/types'


const themes = [
    { value: 'default', label: 'Default', color: '#f3f4f6' },
    { value: 'red', label: 'Red', color: '#fee2e2' },
    { value: 'blue', label: 'Blue', color: '#dbeafe' },
    { value: 'green', label: 'Green', color: '#dcfce7' },
    { value: 'purple', label: 'Purple', color: '#f3e8ff' },
  ]
  

const formSchema = z.object({
  answer1: z.string().min(1, 'This field is required'),
  answer2: z.string().min(1, 'This field is required'),
  answer3: z.string().min(1, 'This field is required'),
})

const FormPage = () => {

  const { formId } = useParams<{ formId: string }>()
  const { form, isLoading: isFormLoading } = useGetForm(formId || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer1: '',
      answer2: '',
      answer3: '',
    },
  })


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        setIsSubmitting(true)
        const {answer1,answer2,answer3} = values;
        const response = await axios.post(`${API_URL}/form-response`,{
            "form_id":form?._id,
            "field1_value":answer1,
            "field2_value":answer2,
            "field3_value":answer3,
        });
        console.log(response);
      toast({
        title: 'Success',
        description: 'Your answers have been submitted successfully.',
      })
      formMethods.reset()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit your answers. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (form?.theme) {
      const selectedTheme = themes.find(t => t.value === form.theme)
      if (selectedTheme) {
        document.documentElement.style.setProperty('--theme-color', selectedTheme.color)
      }
    }
  }, [form])

  if (isFormLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" color='primary'/>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="text-center mt-8">
        <h1 className="text-2xl font-bold">Form not found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <Card className="w-full max-w-2xl mx-auto mt-8 transition-colors duration-300" style={{ backgroundColor: `var(--theme-color, ${form.theme === 'light' ? '#f3f4f6' : '#1f2937'})` }}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <UserCircle className="w-6 h-6 text-gray-600" />
            <span className="text-sm text-gray-600">Created by {(form.user_id as UserType).username}</span>
          </div>
          <CardTitle className="text-2xl font-bold">Feedback Form</CardTitle>
          <CardDescription>Please answer the following questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={formMethods.control}
                name="answer1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{form.field_title1}</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name="answer2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{form.field_title2}</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name="answer3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{form.field_title3}</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default FormPage

