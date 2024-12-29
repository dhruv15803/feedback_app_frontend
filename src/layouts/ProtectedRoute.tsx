import { Loader } from '@/components/Loader';
import { AppContext } from '@/context/AppContext'
import { AppContextType } from '@/types'
import { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
    const { loggedInUser, isLoggedInUserLoading } = useContext(AppContext) as AppContextType;
    const location = useLocation();
    
    if (isLoggedInUserLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size='lg' color='primary'/>
            </div>
        );
    }

    if (loggedInUser === null) {
        // Redirect to the login page, but save the current location
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;

