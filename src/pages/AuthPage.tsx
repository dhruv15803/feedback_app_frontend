import  { useContext, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '@/context/AppContext';
import { AppContextType } from '@/types';

const AuthPage = () => {
    const location = useLocation();
    const {loggedInUser} = useContext(AppContext) as AppContextType;
    const [activeTab,setActiveTab] = useState<string>("login"); 

    if (loggedInUser !== null) {
        // Redirect to the page they tried to visit when they were redirected to login,
        // or to the home page if they weren't redirected
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
        return <Navigate to={from} replace />;
    }

  return (
    <>
         <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Login or create an account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm/>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    </>
  )
}

export default AuthPage;
