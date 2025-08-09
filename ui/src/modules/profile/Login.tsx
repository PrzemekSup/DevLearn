import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, Loader } from "lucide-react";
import { useLogin } from "../../api/hooks/UserApiHooks";
import { TextInput } from "../../components/inputs/TextInput";
import { Error } from "../../components/common/Error";
import { useApiClient } from "../../contexts/ApiClientContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setLoggedUser } = useAuth();
  const { setApiAccessToken } = useApiClient();
  const navigate = useNavigate();

  const loginMutation = useLogin(
    (data) => {
      setLoggedUser(data);
      setApiAccessToken(data.accessToken!, data.refreshToken!);
      navigate("/dashboard");
    },
    (error) => {
      setError(error);
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Uzupełnij wszystkie pola");
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <Header />
          <Error message={error} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <TextInput
              id="email"
              label="Adres e-mail"
              placeholder="Wpisz swój adres e-mail"
              value={email}
              onChange={setEmail}
              disabled={loginMutation.isPending}
              icon={Mail}
              type="email"
            />

            <TextInput
              id="password"
              label="Hasło"
              placeholder="Wpisz swoje hasło"
              value={password}
              onChange={setPassword}
              disabled={loginMutation.isPending}
              icon={Lock}
              type="password"
            />

            <div className="flex items-center justify-between">
              <RememberMe />
              <ForgotPasswordLink />
            </div>

            <SubmitButton isPending={loginMutation.isPending} />
          </form>

          <RegisterLink />
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="text-center mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl w-fit mx-auto mb-4">
        <Lock className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Witaj ponownie!</h2>
      <p className="text-gray-600">Zaloguj się, aby kontynuować swoją naukę</p>
    </div>
  );
};

const RememberMe = () => {
  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="ml-2 text-sm text-gray-600">Zapamiętaj mnie</span>
    </label>
  );
};

const ForgotPasswordLink = () => {
  return (
    <Link
      to="/forgot-password"
      className="text-sm text-blue-600 hover:text-blue-700"
    >
      Zapomniałeś hasła?
    </Link>
  );
};

const SubmitButton = ({ isPending }: { isPending: boolean }) => {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
    >
      {isPending ? (
        <>
          <Loader className="animate-spin h-5 w-5 mr-2" />
          Logowanie...
        </>
      ) : (
        "Zaloguj się"
      )}
    </button>
  );
};

const RegisterLink = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-gray-600">
        Nie masz konta?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Zarejestruj się tutaj
        </Link>
      </p>
    </div>
  );
};
