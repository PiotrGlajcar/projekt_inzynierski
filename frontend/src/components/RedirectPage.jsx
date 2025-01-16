import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";

function RedirectPage() {
    const navigate = useNavigate();
    const { user, loading, setUser } = useUser();

    useEffect(() => {
        const ensureUserData = async () => {
            if (loading) {
                return; // Wait until loading is complete
            }

            if (!user) {
                console.error("User data not found. Redirecting to login.");
                navigate("/");
            } else {
                switch (user.role) {
                    case "student":
                        navigate("/home-student");
                        break;
                    case "staff":
                        navigate("/dashboard");
                        break;
                    default:
                        navigate("/unauthorized");
                        break;
                }
            }
        };

        ensureUserData();
    }, [user, loading, navigate, setUser]);

    return (
        <div>
            <p>Loading... Checking user role...</p>
        </div>
    );
}

export default RedirectPage;
