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
import { ArrowLeft, CheckCircle2, Copy, ExternalLink, FormInput, Palette, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

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
  const [copied, setCopied] = useState(false);
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

  const formUrl = createdForm ? `${window.location.origin}/form/${createdForm._id}` : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      toast({
        title: "Link copied to clipboard!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  const createNewForm = () => {
    setCreatedForm(null);
    form.reset();
  };


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
        setCreatedForm(response.data.form);
        toast({
            title:"Created form",
        });
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

  if (createdForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <div className="container mx-auto px-4 py-12">
          <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-white/80 shadow-xl border-0">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <CardTitle className="text-2xl">Form Created Successfully!</CardTitle>
              </div>
              <CardDescription>
                Share this link with others to collect their responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input 
                  value={formUrl}
                  readOnly
                  className="bg-gray-50 font-mono text-sm"
                />
                <Button 
                  onClick={copyToClipboard}
                  variant="outline"
                  className={copied ? "text-green-600 border-green-600" : ""}
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <Button 
                  onClick={createNewForm}
                  variant="outline"
                  className="flex gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Create Another Form
                </Button>
                
                <Link to={`/form/${createdForm._id}`} className="flex-1">
                  <Button className="w-full flex gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Preview Form
                  </Button>
                </Link>
                
                <Link to="/my-forms" className="flex-1">
                  <Button 
                    variant="secondary"
                    className="w-full"
                  >
                    View All Forms
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Create Your Feedback Form</h2>
          <p className="text-gray-600">Design your personalized questionnaire and gather honest feedback</p>
        </div>

        <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-white/80 shadow-xl border-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50" />
          
          <CardHeader className="relative">
            <div className="flex items-center gap-2 mb-2">
              <FormInput className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-xl font-semibold">Welcome, {loggedInUser?.username}!</CardTitle>
            </div>
            <CardDescription className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Craft your questions thoughtfully to receive meaningful feedback
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="field_title1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Question 1</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What's one positive thing about me?" 
                          {...field} 
                          className="bg-white/90 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" 
                        />
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
                      <FormLabel className="text-gray-700">Question 2</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What's one thing you don't like about me?" 
                          {...field} 
                          className="bg-white/90 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" 
                        />
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
                      <FormLabel className="text-gray-700">Question 3</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="How can I change?" 
                          {...field} 
                          className="bg-white/90 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" 
                        />
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
                      <FormLabel className="text-gray-700 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Theme Color
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/90 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all">
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
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Form'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateFormPage