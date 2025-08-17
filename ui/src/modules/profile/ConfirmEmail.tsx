import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Mail,
  Loader,
  ArrowLeft,
  Send,
} from "lucide-react";
import { useConfirmEmail, useResendLink } from "../../api/hooks/UserApiHooks";
import { TextInput } from "../../components/inputs/TextInput";
import { Success } from "../../components/common/Success";
import { Error } from "../../components/common/Error";

export const ConfirmEmail = () => {
  const { userId, token } = useParams<{ userId: string; token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const confirmMutation = useConfirmEmail(
    (data) => {
      if (data.success) {
        setStatus("success");
        setMessage(
          data.successMessage || "E-mail został potwierdzony. Dziękujemy!"
        );
      } else {
        setStatus("error");
        setMessage(
          data.errors?.join(", ") || "Potwierdzenie adresu nie powiodło się."
        );
      }
      setIsLoading(false);
    },
    (error) => {
      setStatus("error");
      setMessage(error);
      setIsLoading(false);
    }
  );

  useEffect(() => {
    const confirmEmail = async () => {
      if (!userId || !token) {
        setStatus("error");
        setMessage(
          "Uszkodzony link. Sprawdź link, który wysłaliśmy na twoją skrzynkę pocztową i spróbuj jeszcze raz."
        );
        setIsLoading(false);
        return;
      }

      confirmMutation.mutate({ userId, token });
    };

    confirmEmail();
  }, [userId, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`p-3 rounded-xl w-fit mx-auto mb-4 ${
                status === "loading"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600"
                  : status === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-red-500 to-pink-500"
              }`}
            >
              {status === "loading" ? (
                <Mail className="h-8 w-8 text-white" />
              ) : status === "success" ? (
                <CheckCircle className="h-8 w-8 text-white" />
              ) : (
                <XCircle className="h-8 w-8 text-white" />
              )}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {status === "loading"
                ? "Potwierdzanie konta..."
                : status === "success"
                ? "Wszystko się udało!"
                : "Sprawdzenie nie udało się"}
            </h2>

            <p className="text-gray-600">
              {status === "loading"
                ? "Weryfikujemy twoje dane, prosimy o chwilę cierpliwości"
                : status === "success"
                ? "Witaj na platformie DevLearn!"
                : "Coś poszło nie tak, czy na pewno skopiowałeś dokładnie link z wiadomości?"}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Sprawdzanie twoich danych...</p>
            </div>
          )}

          {/* Success/Error Message */}
          {!isLoading && (
            <div
              className={`rounded-lg p-6 mb-6 ${
                status === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start">
                {status === "success" ? (
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p
                    className={`font-medium ${
                      status === "success" ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {status === "success" ? "Success!" : "Error"}
                  </p>
                  <p
                    className={`mt-1 text-sm ${
                      status === "success" ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isLoading && (
            <div className="space-y-4">
              {status === "success" ? (
                <>
                  <Link
                    to="/login"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                  >
                    Przejdź do logowania
                  </Link>
                  <Link
                    to="/"
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Powrót do strony głównej
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                  >
                    Zarejestruj się jeszcze raz
                  </Link>
                  <ResendEmail />
                  <Link
                    to="/"
                    className="w-full bg-white text-gray-600 py-3 rounded-lg font-medium hover:text-gray-800 transition-colors flex items-center justify-center border border-gray-200"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Powrót do strony głównej
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 text-center">
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

const ResendEmail = () => {
  const [showResendForm, setShowResendForm] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [status, setStatus] = useState<"none" | "success" | "error">("none");

  const resendLink = useResendLink(
    (data) => {
      if (data.success) {
        setResendMessage(
          data.successMessage ||
            "Wiadomość została wysłana. Sprawdź swoją skrzynkę."
        );
        setStatus("success");
      } else {
        setResendMessage(
          data.errors?.join(", ") || "Potwierdzenie adresu nie powiodło się."
        );
        setStatus("error");
      }
      setIsResending(false);
    },
    (error) => {
      setStatus("error");
      setResendMessage(error);
      setIsResending(false);
    }
  );

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      setStatus("error");
      setResendMessage(
        "Podaj adres e-mail swojego konta, dla którego chcesz wygenerować wiadomość."
      );
      return;
    }

    resendLink.mutate({ email: resendEmail });
  };

  return !showResendForm ? (
    <button
      onClick={() => setShowResendForm(true)}
      className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
    >
      <Mail className="mr-2 h-4 w-4" />
      Wygeneruj nowy link do potwierdzenia
    </button>
  ) : (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 className="font-semibold text-gray-900 mb-3">
        Wygeneruj nowy link do potwierdzenia
      </h4>
      <form onSubmit={handleResendEmail} className="space-y-3">
        <TextInput
          id="email"
          label=""
          placeholder="Podaj swój adres e-mail"
          type="email"
          value={resendEmail}
          onChange={setResendEmail}
          disabled={isResending}
          icon={Mail}
        />
        {resendMessage && status === "success" && (
          <Success message={resendMessage} />
        )}
        {resendMessage && status === "error" && (
          <Error message={resendMessage} />
        )}
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isResending}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isResending ? (
              <>
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Generowanie...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Wygeneruj wiadomość
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowResendForm(false);
              setResendMessage("");
              setResendEmail("");
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
};
