import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Loader } from "lucide-react";
import { useRegister } from "../../api/hooks/UserApiHooks";
import { Error } from "../../components/common/Error";
import { TextInput } from "../../components/inputs/TextInput";
import { SmallCheckbox } from "../../components/inputs/SmallCheckbox";
import { ValidationState } from "../../components/common/ValidationState";
import { Success } from "../../components/common/Success";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validations, setValidations] = useState({
    length: false,
    specialCharacter: false,
  });

  const registerMutation = useRegister(
    (data) => {
      if (data.success) {
        setSuccessMessage(
          data.successMessage ||
            "Rejestracja się powiodła, sprawdź swoją skrzynkę pocztową."
        );
      } else {
        setError(data.errors?.join(", ") || "Niespodziewany błąd.");
      }
    },
    (error) => {
      setError(error);
    }
  );

  const updatePassword = (password: string) => {
    setPassword(password);
    setValidations({
      length: password.length >= 8,
      specialCharacter: /[!@#$%^&*]/.test(password),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Uzupełnij wszystkie pola.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Hasła się nie zgadzają (są inne).");
      return;
    }

    const allValidationsPassed = Object.values(validations).every(Boolean);
    if (!allValidationsPassed) {
      setError(
        "Hasło musi mieć minimum osiem (8) znaków i zawierać przynajmniej jeden znak specjalny."
      );
      return;
    }

    if (!termsAccepted) {
      setError("Musisz zaakceptować regulamin serwisu.");
      return;
    }

    registerMutation.mutate({
      name,
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <Header />

          <form onSubmit={handleSubmit} className="space-y-6">
            <TextInput
              id="name"
              label="Nazwa użytkownika"
              placeholder="Wpisz nową nazwę użytkownika"
              value={name}
              onChange={setName}
              disabled={registerMutation.isPending}
              icon={User}
              type="text"
            />

            <TextInput
              id="email"
              label="Adres e-mail"
              placeholder="Podaj adres e-mail"
              value={email}
              onChange={setEmail}
              disabled={registerMutation.isPending}
              icon={Mail}
              type="email"
            />

            <TextInput
              id="password"
              label="Hasło"
              placeholder="Wpisz swoje hasło"
              value={password}
              onChange={updatePassword}
              disabled={registerMutation.isPending}
              icon={Lock}
              type="password"
              message={
                password && (
                  <div className="mt-3 space-y-2">
                    <ValidationState
                      items={[
                        { met: validations.length, text: "Minimum 8 znaków" },
                        {
                          met: validations.specialCharacter,
                          text: "Minimum jeden znak specjalny",
                        },
                      ]}
                    />
                  </div>
                )
              }
            />

            <TextInput
              id="confirmPassword"
              label="Potwierdź hasło"
              placeholder="Wpisz swoje hasło ponownie"
              value={confirmPassword}
              onChange={setConfirmPassword}
              disabled={registerMutation.isPending}
              icon={Lock}
              type="password"
              message={
                confirmPassword && (
                  <div className="mt-3 space-y-2">
                    <ValidationState
                      items={[
                        {
                          met: confirmPassword === password,
                          text: "Hasła się zgadzają",
                        },
                      ]}
                    />
                  </div>
                )
              }
            />

            <TermsOfService
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
            />

            <Error message={error} />
            <SubmitButton
              isPending={registerMutation.isPending}
              successMessage={successMessage}
            />
          </form>

          <Footer />
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="text-center mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl w-fit mx-auto mb-4">
        <User className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Stwórz konto</h2>
      <p className="text-gray-600">
        Rozpocznij swoją przygodę z programowaniem już dzisiaj
      </p>
    </div>
  );
};

const TermsOfService = ({
  termsAccepted,
  setTermsAccepted,
}: {
  termsAccepted: boolean;
  setTermsAccepted: (termsAccepted: boolean) => void;
}) => {
  return (
    <div className="flex items-center">
      <SmallCheckbox
        id="terms"
        label={
          <>
            Akceptuję{" "}
            <Link
              to="/terms"
              target="_blank"
              className="text-blue-600 hover:text-blue-700"
            >
              regulamin
            </Link>{" "}
            oraz{" "}
            <Link
              to="/privacy"
              target="_blank"
              className="text-blue-600 hover:text-blue-700"
            >
              politykę prywatności.
            </Link>
          </>
        }
        checked={termsAccepted}
        onChange={setTermsAccepted}
      />
    </div>
  );
};

const SubmitButton = ({
  isPending,
  successMessage,
}: {
  isPending: boolean;
  successMessage: string;
}) => {
  if (successMessage) {
    return <Success message={successMessage} />;
  }

  return (
    <button
      type="submit"
      disabled={isPending}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
    >
      {isPending ? (
        <>
          <Loader className="animate-spin h-5 w-5 mr-2" />
          Tworzenie konta...
        </>
      ) : (
        "Stwórz konto"
      )}
    </button>
  );
};

const Footer = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-gray-600">
        Masz już konto?{" "}
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Zaloguj się tutaj
        </Link>
      </p>
    </div>
  );
};
