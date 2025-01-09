import { useParams } from 'react-router-dom'
import { useFormResponses } from '@/hooks/useFormResponses'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FormResponseType, FormType } from '@/types'
import { Loader } from '@/components/Loader'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'
import { WordCloud } from '@/components/WordCloud'

const FormResponsesPage = () => {
  const PAGE_LIMIT = 2;
  const { formId } = useParams<{ formId: string }>()
  if (!formId) return <div className="text-center mt-8">No form ID provided</div>
  
  const [page, setPage] = useState<number>(1);
  const { formResponses, numberOfPages, isLoading: isResponsesLoading } = useFormResponses(formId, page, PAGE_LIMIT);

  if (isResponsesLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-100 to-white">
        <Loader size="lg" color="primary" />
      </div>
    )
  }

  if (!formResponses || formResponses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-100 to-white">
        <MessageSquare className="w-16 h-16 text-blue-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">No responses found for this form</h1>
        <p className="text-gray-600 mt-2">Start sharing your form to collect responses!</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < numberOfPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Form Responses</h1>
        
        {/* Word Cloud Section */}
        <WordCloud formResponses={formResponses} />

        {/* Response Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formResponses.map((response: FormResponseType) => (
            <Card key={response._id} className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-blue-700">
                  Response from {formatDate(response.createdAt)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-blue-600">{(response.form_id as FormType).field_title1}</h3>
                      <p className="text-sm text-gray-700 mt-1">{response.field1_value}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-600">{(response.form_id as FormType).field_title2}</h3>
                      <p className="text-sm text-gray-700 mt-1">{response.field2_value}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-600">{(response.form_id as FormType).field_title3}</h3>
                      <p className="text-sm text-gray-700 mt-1">{response.field3_value}</p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8 px-2">
          <div className="text-sm text-gray-600">
            Page {page} of {numberOfPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page <= 1}
              className="bg-white hover:bg-blue-50 text-blue-600 border-blue-300"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page >= numberOfPages}
              className="bg-white hover:bg-blue-50 text-blue-600 border-blue-300"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormResponsesPage

