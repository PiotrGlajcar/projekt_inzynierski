import { useUser } from "../context/useUser";

function HomeStudent() {

    const { user } = useUser();
    return (
        <div>
            {user ? (
                <p>Welcome, {user.first_name} {user.last_name}!</p>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default HomeStudent