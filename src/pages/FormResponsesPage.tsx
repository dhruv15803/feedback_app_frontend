import { useParams } from 'react-router-dom'
import { useFormResponses } from '@/hooks/useFormResponses'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FormResponseType, FormType } from '@/types'
import { Loader } from '@/components/Loader'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const FormResponsesPage = () => {
  const PAGE_LIMIT = 2;
  const { formId } = useParams<{ formId: string }>()
  if (!formId) return <div className="text-center mt-8">No form ID provided</div>
  
  const [page, setPage] = useState<number>(1);
  const { formResponses,numberOfPages,isLoading: isResponsesLoading } = useFormResponses(formId, page, PAGE_LIMIT);

  if (isResponsesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" />
      </div>
    )
  }

  if (!formResponses || formResponses.length === 0) {
    return (
      <div className="text-center mt-8">
        <h1 className="text-2xl font-bold">No responses found for this form</h1>
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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Form Responses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formResponses.map((response: FormResponseType) => (
          <Card key={response._id} className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">
                Response from {formatDate(response.createdAt)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{(response.form_id as FormType).field_title1}</h3>
                    <p className="text-sm text-gray-600">{response.field1_value}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">{(response.form_id as FormType).field_title2}</h3>
                    <p className="text-sm text-gray-600">{response.field2_value}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">{(response.form_id as FormType).field_title3}</h3>
                    <p className="text-sm text-gray-600">{response.field3_value}</p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Page {page} of {numberOfPages}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page >= numberOfPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

    </div>
  )
}

export default FormResponsesPage;


