using DevLearn.Auth.Dto;
using DevLearn.Auth.Dtos;
using DevLearn.Auth.IRepository;
using DevLearn.Auth.Token;
using DevLearn.Helpers;
using Microsoft.AspNetCore.Identity;
using System.Net;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace DevLearn.Auth;

public class AuthService(UserManager<ApplicationUser> userManager,
                     SignInManager<ApplicationUser> signInManager,
                     IAuthRepository authRepository,
                     ITokenService tokenService,
                     IEmailService emailService) : IAuthService
{
    #region BasicActions
    public async Task<ValidationStateDto> RegisterAsync(RegisterRequest request)
    {
        var validationState = await ValidateUser(request);
        if (!validationState.Success)
        {
            return validationState;
        }

        var user = new ApplicationUser
        {
            UserName = request.UserName,
            Email = request.Email,
            EmailConfirmed = false
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errorGuid = Guid.NewGuid();
            // TODO: Logging with errorGUid and result.Errors.Select(x => x.Description)
            return new ValidationStateDto(false, "", [$"Wystąpił problem podczas rejestracji użytkownika. Kod błędu: '{errorGuid}'"]);
        }

        var confirmToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebUtility.UrlEncode(confirmToken);
        await emailService.SendConfirmationEmailAsync(user.Email, user.Id, encodedToken);

        return new ValidationStateDto(true, $"Dziękujemy za rejestrację {user.UserName}. Wysłaliśmy wiadomość e-mail na '{user.Email}'. Proszę potwierdź swoje konto.", []);
    }

    public async Task<TokenResponse> LoginAsync(LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null || !await userManager.CheckPasswordAsync(user, request.Password))
            throw new UnauthorizedAccessException("Nieprawidłowa adres e-mail lub hasło.");

        if (!await userManager.IsEmailConfirmedAsync(user))
            throw new UnauthorizedAccessException("Potwierdz adres email.");

        return await tokenService.GenerateTokensAsync(user);
    }

    public async Task<TokenResponse> RefreshTokenAsync(RefreshRequest request)
    {
        if (await tokenService.IsTokenBlacklistedAsync(request.RefreshToken))
        {
            // TODO: Logging
            throw new UnauthorizedAccessException("Token został unieważniony. Spróbuj się wylogować i zalogować jeszcze raz.");
        }

        return await tokenService.RefreshTokensAsync(request);
    }

    public async Task LogoutAsync(string userId)
    {
        await tokenService.RevokeUserTokensAsync(userId);
    }
    #endregion BasicActions

    #region EmailConfirmation
    public async Task<ValidationStateDto> ConfirmEmailAsync(string userId, string token)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
            // TODO: Logging
            return new ValidationStateDto(false, string.Empty, ["Wystąpił problem z użytkownikiem. Spróbuj ponownie, możesz wysłać jeszcze raz e-mail potwierdzający!"]);
        }

        var decodedToken = WebUtility.UrlDecode(token);
        var result = await userManager.ConfirmEmailAsync(user, decodedToken);
        if (!result.Succeeded)
        {
            // TODO: Logging
            return new ValidationStateDto(false, string.Empty, ["Kod jest już nieważny."]);
        }

        return new ValidationStateDto(true, "E-mail został potwierdzony", []);
    }

    public async Task<ValidationStateDto> ResendConfirmationEmailAsync(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            // TODO: Logging
            return new ValidationStateDto(false, $"Jeżeli istnieje użytkownik o adresie '{email}', link zostanie wysłany ponownie. Jeżeli nie dostaniesz wiadomości w ciągu kilku minut, sprawdź SPAM oraz to, czy podano prawidłowy adres.", []);
        }

        if (await userManager.IsEmailConfirmedAsync(user))
        {
            return new ValidationStateDto(false, string.Empty, [$"Adres '{email}' został już wcześniej potwierdzony."]);
        }

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebUtility.UrlEncode(token);
        await emailService.SendConfirmationEmailAsync(user.Id, user.Email!, encodedToken);

        return new ValidationStateDto(true, "Wysłano ponownie wiadomość e-mail.", []);
    }
    #endregion EmailConfirmation

    #region ForgotPassword
    public async Task<ValidationStateDto> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user != null && !(await userManager.IsEmailConfirmedAsync(user)))
        {
            // TODO: Logging
            return new ValidationStateDto(false, string.Empty, ["Adres e-mail nie został jeszcze potwierdzony po rejestracji"]);
        }
        if (user == null)
        {
            // TODO: Logging
            return new ValidationStateDto(false, "Jeżeli podano zarejestrowany adres e-mail, link do resetu hasła został wysłany.", []);
        }

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = WebUtility.UrlEncode(token);

        await emailService.SendForgotPasswordLinkAsync(user.Id, user.Email!, encodedToken);
        return new ValidationStateDto(true, "Jeżeli podano zarejestrowany adres e-mail, link do resetu hasła został wysłany.", []);
    }

    public async Task<ValidationStateDto> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return new ValidationStateDto(false, "", [$"Wystąpił problem z użytkownikiem '{request.Email}' podczas próby zmiany hasła."]);
        }

        var result = await userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
        {
            var errorGuid = Guid.NewGuid();
            // TODO: Logging with errorGUid and result.Errors.Select(x => x.Description)
            return new ValidationStateDto(false, "", [$"Wystąpił problem ze zresetowaniem hasła. Kod błędu: '{errorGuid}'"]);
        }

        return new ValidationStateDto(true, "Hasło zostało zresetowane.", []);
    }
    #endregion ForgotPassword

    #region ExternalLogin
    public async Task<TokenResponse?> ExternalLoginAsync()
    {
        try
        {
            return await ExternalLogin();
        }
        catch
        {
            // logger log
            return null;
        }
    }

    private async Task<TokenResponse> ExternalLogin()
    {
        var info = await signInManager.GetExternalLoginInfoAsync() ?? throw new Exception("Problem z połączeniem do providera 'Name'.");
        var result = await signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false);

        ApplicationUser? user;

        if (result.Succeeded)
        {
            user = await userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
            if (user == null)
            {
                // TODO: Logging - signed in, but not found.
                throw new Exception($"Wystąpił problem z użytkownikiem .");
            }
        }
        else
        {
            var email = info.Principal.FindFirstValue(ClaimTypes.Email);
            var name = info.Principal.FindFirstValue(ClaimTypes.Name);

            var existingUser = email != null
                ? await userManager.FindByEmailAsync(email)
                : null;
            if (existingUser == null)
            {
                user = new ApplicationUser { UserName = name, Email = email, EmailConfirmed = true };
                await userManager.CreateAsync(user);
            }
            else
            {
                user = existingUser;
            }

            await userManager.AddLoginAsync(user, info);
        }

        return await tokenService.GenerateTokensAsync(user);
    }
    #endregion ExternalLogin

    private async Task<ValidationStateDto> ValidateUser(RegisterRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrEmpty(request.Email))
        {
            errors.Add("Adres e-mail jest wymagany.");
        }
        else
        {
            if (request.Email.Length > 100)
            {
                errors.Add("Adres e-mail jest zbyt długi. Dozwolone jest maksymalnie 100 znaków.");
            }

            // e-mail regex
            string emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (!Regex.IsMatch(request.Email, emailPattern, RegexOptions.IgnoreCase))
            {
                errors.Add("Adres e-mail jest nieprawiłowy");
            }
        }

        if (string.IsNullOrEmpty(request.UserName))
        {
            errors.Add("Nazwa użytkownika jest wymagana.");
        }

        // unique
        var (uniqueEmail, uniqueUsername) = await authRepository.VerifyUniqueAsync(request.Email, request.UserName);
        if (!uniqueEmail)
        {
            errors.Add($"Użytkownik z e-mailem '{request.Email}' już istnieje.");
        }
        if (!uniqueUsername)
        {
            errors.Add($"Użytkownik o nazwie '{request.UserName}' już istnieje.");
        }

        if (request.UserName.Length > 30)
        {
            errors.Add("Nazwa użytkownika jest zbyt długa. Dozwolone jest maksymalnie 30 znaków.");
        }

        // password regex
        if (string.IsNullOrEmpty(request.Password))
        {
            errors.Add("Podaj hasło.");
        }
        else
        {
            string passwordPattern = @"^(?=.*[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]).{8,}$";
            if (!Regex.IsMatch(request.Password, passwordPattern, RegexOptions.IgnoreCase))
            {
                errors.Add("Hasło musi mieć minimum osiem (8) znaków i zawierać przynajmniej jeden znak specjalny.");
            }
        }

        return new ValidationStateDto(errors.Count == 0, string.Empty, [.. errors]);
    }
}
