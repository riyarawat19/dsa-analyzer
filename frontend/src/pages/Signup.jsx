import { supabase } from "../supabaseClient";

const Signup = async (email, password) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) alert(error.message);
};

export default Signup;
