using DevLearn.Auth.Dto;
using DevLearn.Auth.Dtos;
using DevLearn.Auth.IRepository;
using DevLearn.Auth.Token;
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
            return new ValidationStateDto(false, string.Empty, [.. result.Errors.Select(x => x.Description)]);
        }

        var confirmToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebUtility.UrlEncode(confirmToken);
        await emailService.SendConfirmationEmailAsync(user.Email, user.Id, encodedToken);

        return new ValidationStateDto(true, string.Empty, []);
    }

    public async Task<TokenResponse> LoginAsync(LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null || !await userManager.CheckPasswordAsync(user, request.Password))
            throw new UnauthorizedAccessException("Nieprawidłowe hasło");

        if (!await userManager.IsEmailConfirmedAsync(user))
            throw new UnauthorizedAccessException("Potwierdz adres email.");

        return await tokenService.GenerateTokensAsync(user);
    }

    public async Task<TokenResponse> RefreshTokenAsync(RefreshRequest request)
    {
        if (await tokenService.IsTokenBlacklistedAsync(request.RefreshToken))
            throw new UnauthorizedAccessException("Token został unieważniony");

        return await tokenService.RefreshTokensAsync(request);
    }

    public async Task LogoutAsync(string userId)
    {
        await tokenService.RevokeUserTokensAsync(userId);
    }
    #endregion BasicActions

    #region EmailConfirmation
    public async Task<ValidationStateDto> ConfirmEmail(string userId, string token)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return new ValidationStateDto(false, string.Empty, ["Wystąpił problem z użytkownikiem. Skontaktuj się z nami!"]);
        }

        var decodedToken = WebUtility.UrlDecode(token);
        var result = await userManager.ConfirmEmailAsync(user, decodedToken);
        if (!result.Succeeded)
        {
            return new ValidationStateDto(false, string.Empty, ["Kod jest już nieważny."]);
        }

        return new ValidationStateDto(true, "E-mail został potwierdzony", []);
    }

    public async Task<ValidationStateDto> ResendConfirmationEmail(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return new ValidationStateDto(false, string.Empty, [$"Nie odnaleziono użytkownika z adresem e-mail '{email}'."]);
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
    public async Task<ValidationStateDto> ForgotPassword(ForgotPasswordRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user != null && !(await userManager.IsEmailConfirmedAsync(user)))
        {
            return new ValidationStateDto(false, string.Empty, ["Adres e-mail nie został jeszcze potwierdzony po rejestracji"]);
        }
        if (user == null)
        {
            return new ValidationStateDto(false, string.Empty, ["Jeżeli podano zarejestrowany adres e-mail, to link do resetu hasła został wysłany."]);
        }

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = WebUtility.UrlEncode(token);

        await emailService.SendForgotPasswordLinkAsync(user.Id, user.Email!, encodedToken);
        return new ValidationStateDto(true, "Jeżeli podano zarejestrowany adres e-mail, to link do resetu hasła został wysłany.", []);
    }

    public async Task<ValidationStateDto> ResetPassword(ResetPasswordRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return new ValidationStateDto(false, "", ["Invalid request"]);
        }

        var result = await userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
        {
            return new ValidationStateDto(false, "", [.. result.Errors.Select(x => x.Description)]);
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
        var info = await signInManager.GetExternalLoginInfoAsync() ?? throw new Exception("Login failed");
        var result = await signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false);

        ApplicationUser user;

        if (result.Succeeded)
        {
            user = await userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey)
                ?? throw new Exception("User did not found by login");
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
        var (uniqueEmail, uniqueUsername) = await authRepository.VerifyUnique(request.Email, request.UserName);
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
