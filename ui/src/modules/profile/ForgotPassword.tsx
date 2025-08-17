import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle, Loader } from "lucide-react";
import { useForgotPassword } from "../../api/hooks/UserApiHooks";
import { Success } from "../../components/common/Success";
import { Error } from "../../components/common/Error";
import { TextInput } from "../../components/inputs/TextInput";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const forgotPasswordMutation = useForgotPassword(
    (data) => {
      if (data.success) {
        setMessage(
          data.successMessage ||
            "Wiadomość została wysłana. Sprawdź swoją skrzynkę."
        );
        setStatus("success");
      } else {
        setMessage(
          data.errors?.join(", ") ||
            "Wystąpił problem z wysłaniem wiadomości e-mail."
        );
        setStatus("error");
      }
      setIsLoading(false);
    },
    (error) => {
      setStatus("error");
      setMessage(error);
      setIsLoading(false);
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("Podaj swój adres e-mail.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Adres e-mail jest nieprawdiłowy.");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    forgotPasswordMutation.mutate({ email });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`p-3 rounded-xl w-fit mx-auto mb-4 ${
                status === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-blue-600 to-purple-600"
              }`}
            >
              {status === "success" ? (
                <CheckCircle className="h-8 w-8 text-white" />
              ) : (
                <Mail className="h-8 w-8 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {status === "success"
                ? "Sprawdź swoją skrzynkę mailową"
                : "Zgubione hasło?"}
            </h2>
            <p className="text-gray-600">
              {status === "success"
                ? "Wysłaliśmy do ciebie wiadomość e-mail."
                : "Nie martw się, pomożemy ci ustalić nowe."}
            </p>
          </div>

          {/* Success/Error Message */}
          {message && status === "idle" && (
            <div className="rounded-lg p-4 mb-6 bg-blue-50 border border-blue-200">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-700">{message}</span>
              </div>
            </div>
          )}
          {message && status === "success" && <Success message={message} />}
          {message && status === "error" && <Error message={message} />}

          {/* Form or Success Actions */}
          {status === "success" ? (
            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Przejdź do logowania
              </Link>
            </div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <TextInput
                  id="email"
                  type="email"
                  label="Adres e-mail"
                  placeholder="Podaj swój adres e-mail"
                  value={email}
                  onChange={setEmail}
                  disabled={isLoading}
                  icon={Mail}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Wysyłanie wiadomości e-mail...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Wygeneruj link do resetu hasła
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Powrót do logowania
                </Link>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Nie masz konta?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Zarejestruj się
              </Link>
            </p>
          </div>

          {/* Help Text */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Potrzebujesz pomocy?{" "}
              <a
                href="mailto:contact.footrank@gmail.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Skontaktuj się z nami
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
