import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserLoggedInContext } from './src/contexts/Contexts';


export default function ProtectedRoute({ children }) {
    const { currentWebUserUID } = useContext(UserLoggedInContext);

    if (!currentWebUserUID) {
        return <Navigate to="/" />;
    }

    return children; 
}
