﻿namespace DevLearn.Auth.Dtos;

public record ResetPasswordRequest(string Email, string Token, string NewPassword);
