import { Navigate } from "react-router-dom";
import { useUser } from "../context/useUser";

const ProtectedRoute = ({ role, children }) => {
    const { user, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>; // Show a loading indicator while fetching user data
    }

    if (!user) {
        // Redirect to login if user data is not available
        return <Navigate to="/" />;
    }

    if (user.role !== role) {
        // Redirect to unauthorized if the user role doesn't match
        return <Navigate to="/unauthorized" />;
    }

    // Render the component if the role matches
    return children;
};

export default ProtectedRoute;
