import { useMyForms } from '@/hooks/useMyForms';
import { Loader } from '@/components/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar, FileText, Palette, Plus } from 'lucide-react';
import { UserType } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MyFormsPage = () => {
  const { forms, isLoading: isFormsLoading } = useMyForms();
  const navigate = useNavigate();

  if (isFormsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <Loader size="lg" color="primary" />
      </div>
    );
  }

  if (!forms.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-b from-blue-100 to-white">
        <AlertCircle className="w-20 h-20 text-blue-400" />
        <h2 className="text-3xl font-bold text-gray-800">No forms yet</h2>
        <p className="text-xl text-gray-600 mb-4">Start creating amazing forms today!</p>
        <Button 
          size="lg" 
          onClick={() => navigate('/create')}
          className="animate-pulse"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Form
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Forms</h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage and track all your forms in one place
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/create')}
            className="mb-8"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Form
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card 
              key={form._id} 
              className={`overflow-hidden transform transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                form.theme === 'blue' ? 'border-blue-200 bg-blue-50/50' : 
                form.theme === 'light' ? 'border-gray-200 bg-gray-50/50' : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
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
                      <Palette className="w-4 h-4 text-green-500" />
                      <span className="capitalize">{form.theme}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-4">
                      <img
                        src={(form.user_id as UserType).profileImageUrl}
                        alt={(form.user_id as UserType).username}
                        className="w-6 h-6 rounded-full bg-gray-200"
                      />
                      <span className="text-sm text-gray-600">
                        {(form.user_id as UserType).username}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button 
                        onClick={() => navigate(`/form-responses/${form._id}`)}
                        className="w-full transition-colors hover:bg-blue-600"
                      >
                        View responses
                      </Button>
                      <Button 
                        onClick={() => navigate(`/form/${form._id}`)}
                        variant="outline"
                        className="w-full transition-colors hover:bg-gray-100"
                      >
                        View form
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyFormsPage;