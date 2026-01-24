import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsAuth }) {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const res = await axios.post("http://localhost:5000/auth/google", {
      token: credentialResponse.credential,
    });

    localStorage.setItem("token", res.data.token);
    setIsAuth(true);
    navigate("/dashboard"); 
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}
