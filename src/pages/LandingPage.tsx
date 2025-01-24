import { Loader } from '@/components/Loader';
import { AppContext } from '@/context/AppContext';
import { AppContextType } from '@/types';
import { useContext } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput,Lock, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const { loggedInUser, isLoggedInUserLoading } = useContext(AppContext) as AppContextType;

    if (isLoggedInUserLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size='lg' color='primary'/>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
            <main className="container mx-auto px-4 py-12">
                <section className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Create, share and gather Feedback Anonymously</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Feedback Tool lets you create forms and share them with friends. 
                        Get honest, anonymous feedback without any sign-up barriers.
                    </p>
                    {!loggedInUser && (
                        <Link to="/auth">
                            <Button size="lg" className="animate-pulse">
                                Get Started for only INR 99/-
                            </Button>
                        </Link>
                    )}
                </section>

                <section className="grid md:grid-cols-3 gap-8 mb-16">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FormInput className="w-6 h-6 mr-2 text-blue-500" />
                                Easy Form Creation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Design forms with our intuitive interface.choose themes, and personalize your surveys in minutes.
                            </CardDescription>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Share2 className="w-6 h-6 mr-2 text-green-500" />
                                Simple Sharing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Share your forms easily with friends via link. No need for them to create an account to participate.
                            </CardDescription>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Lock className="w-6 h-6 mr-2 text-red-500" />
                                Anonymous Responses
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Gather honest feedback with the assurance of anonymity. Respondents can share freely without revealing their identity.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </section>

                <section className="text-center">
                    <h3 className="text-2xl font-semibold mb-4">Ready to get started?</h3>
                    {loggedInUser ? (
                        <Link to="/create">
                            <Button size="lg">Create a form</Button>
                        </Link>
                    ) : (
                        <Link to="/auth">
                            <Button size="lg">Signup to create a form</Button>
                        </Link>
                    )}
                </section>
            </main>

            <footer className="bg-gray-100 mt-16 py-8">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>&copy; 2025 lifelonglearners. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage;

