import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLogin } from "./../auth/useLogin";

export function useLoginForm() {
  const navigate = useNavigate();
  const { handleLogin, loading, error } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const success = await handleLogin(loginInput, password);

    if (success) {
      navigate("/");
    }
  }

  return {
    loading,
    error,
    showPassword,
    loginInput,
    password,
    setShowPassword,
    setLoginInput,
    setPassword,
    onSubmit,
  };
}
