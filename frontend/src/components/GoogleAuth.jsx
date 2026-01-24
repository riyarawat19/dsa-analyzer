import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function GoogleAuth({ setUser }) {
  const handleSuccess = async (credentialResponse) => {
    const res = await axios.post("http://localhost:5000/auth/google", {
      token: credentialResponse.credential,
    });

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
}
