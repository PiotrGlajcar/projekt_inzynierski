import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RoleRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/users/me', {
            credentials: 'include'  // Important to send session cookies
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const role = data.data.role;
                console.log("User role:", role);
                
                // Redirect based on role
                switch (role) {
                    case 'student':
                        navigate('/home-student');
                        break;
                    case 'staff':
                        navigate('/dashboard');
                        break;
                    default:
                        navigate('/unauthorized');
                        break;
                }
            } else {
                console.log("Failed to fetch user data.");
                navigate('/login');
            }
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
            navigate('/login');
        });
    }, [navigate]);

    return (
        <div>
            <p>Loading... Checking role...</p>
        </div>
    );
}

export default RoleRedirect;
