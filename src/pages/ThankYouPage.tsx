import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ThankYouPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 mb-4">
            <CheckCircle className="w-full h-full text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
          <CardDescription>Your form has been submitted successfully.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">
            We appreciate your feedback. Your input is valuable to us and helps us improve our services.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/auth">
            <Button className="mt-4">
              Create Your Own Form
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ThankYouPage

