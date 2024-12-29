import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AppContextType } from '@/types';
import axios from 'axios';
import { API_URL } from '@/App';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { AppContext } from '@/context/AppContext';

  
const Navbar = () => {
    const navigate = useNavigate();
    const {loggedInUser, setLoggedInUser} = useContext(AppContext) as AppContextType;

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/logout`,{
                withCredentials:true,
            });
            console.log(response);
            setLoggedInUser(null);
            navigate("/")
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4 container mx-auto">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="font-bold text-xl">
                        QuickForm
                    </Link>
                </div>
                <div className="flex-1" />
                <div className="hidden md:flex items-center space-x-4">
                    {loggedInUser ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className='flex items-center gap-2'>
                                    <div className="relative w-10 h-10 overflow-hidden rounded-full">
                      <img
                        src={loggedInUser.profileImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                                        <span className="text-sm font-medium">{loggedInUser.username}</span>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={() => navigate("/form-responses")}>My form responses</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button onClick={handleLogout} size="sm">
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button asChild>
                            <Link to="/auth">Sign In</Link>
                        </Button>
                    )}
                </div>
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="grid gap-4 py-4">
                                {loggedInUser ? (
                                    <>
                                        <span className="text-sm font-medium">{loggedInUser.username}</span>
                                        <Button onClick={handleLogout} className="w-full justify-start">
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Button asChild className="w-full justify-start">
                                        <Link to="/auth">Sign In</Link>
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
