import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { UserCircle, MessageSquare, Send, Sparkles } from 'lucide-react'
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
  const navigate = useNavigate();
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
      const {answer1, answer2, answer3} = values;
      await axios.post(`${API_URL}/form-response`, {
        "form_id": form?._id,
        "field1_value": answer1,
        "field2_value": answer2,
        "field3_value": answer3,
      });
      toast({
        title: 'Success',
        description: 'Your answers have been submitted successfully.',
      })
      formMethods.reset()
      navigate("/thank-you")
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
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex justify-center items-center">
        <Loader size="lg" color='primary'/>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center">
        <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-600">Form not found</h1>
        <p className="text-gray-500 mt-2">The form you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Share Your Feedback</h2>
          <p className="text-gray-600">Your responses will be kept anonymous</p>
        </div>

        <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-white/80 shadow-xl border-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50" />
          
          <CardHeader className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserCircle className="w-6 h-6 text-blue-500" />
                <span className="text-sm text-gray-600">Created by {(form.user_id as UserType).username}</span>
              </div>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            <CardTitle className="text-xl font-semibold mb-2">Feedback Form</CardTitle>
            <CardDescription className="text-gray-600">
              Please provide honest and constructive feedback
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            <Form {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={formMethods.control}
                  name="answer1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">{form.field_title1}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-white/90 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
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
                      <FormLabel className="text-gray-700 font-medium">{form.field_title2}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-white/90 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
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
                      <FormLabel className="text-gray-700 font-medium">{form.field_title3}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-white/90 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2" 
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FormPage