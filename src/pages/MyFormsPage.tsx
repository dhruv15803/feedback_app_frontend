import { useMyForms } from '@/hooks/useMyForms';
import { Loader } from '@/components/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar, FileText, Palette } from 'lucide-react';
import { UserType } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MyFormsPage = () => {
  const { forms, isLoading: isFormsLoading } = useMyForms();
  const navigate = useNavigate();

  if (isFormsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" color="primary" />
      </div>
    );
  }

  if (!forms.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="w-16 h-16 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-600">No forms found</h2>
        <p className="text-gray-500">Create your first form to get started!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Forms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <Card key={form._id} className={`overflow-hidden ${
            form.theme === 'blue' ? 'border-blue-200 bg-blue-50' : 
            form.theme === 'light' ? 'border-gray-200 bg-gray-50' : ''
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="truncate">Form #{form._id.slice(-4)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Questions:</h3>
                  <ul className="space-y-2">
                    <li className="text-sm">1. {form.field_title1}</li>
                    <li className="text-sm">2. {form.field_title2}</li>
                    <li className="text-sm">3. {form.field_title3}</li>
                  </ul>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Palette className="w-4 h-4" />
                    <span className="capitalize">{form.theme}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={(form.user_id as UserType).profileImageUrl}
                      alt={(form.user_id as UserType).username}
                      className="w-6 h-6 rounded-full bg-gray-200"
                    />
                    <span className="text-sm text-gray-600">
                      {(form.user_id as UserType).username}
                    </span>
                  </div>
                  <div className='flex items-center gap-4 mt-4'>
                    <Button onClick={() => navigate(`/form-responses/${form._id}`)}>View responses</Button>
                    <Button onClick={() => navigate(`/form/${form._id}`)}>View form</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyFormsPage;