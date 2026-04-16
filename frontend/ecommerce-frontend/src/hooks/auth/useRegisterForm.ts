import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "./useRegister";

interface PasswordStrength {
  strength: number;
  label: "" | "Fraca" | "Média" | "Forte";
  color: string;
}

export function useRegisterForm() {
  const navigate = useNavigate();
  const { handleRegister, loading, error } = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  function getPasswordStrength(): PasswordStrength {
    if (password.length === 0) {
      return { strength: 0, label: "", color: "" };
    }

    if (password.length < 6) {
      return { strength: 1, label: "Fraca", color: "bg-red-500" };
    }

    if (password.length < 10) {
      return { strength: 2, label: "Média", color: "bg-yellow-500" };
    }

    return { strength: 3, label: "Forte", color: "bg-green-500" };
  }

  const passwordStrength = getPasswordStrength();

  async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const success = await handleRegister(
      username,
      email,
      password,
      confirmPassword
    );

    if (success) {
      navigate("/login");
    }
  }

  return {
    loading,
    error,
    showPassword,
    showConfirmPassword,
    username,
    email,
    password,
    confirmPassword,
    passwordsMatch,
    passwordStrength,
    setShowPassword,
    setShowConfirmPassword,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    onSubmit,
  };
}
