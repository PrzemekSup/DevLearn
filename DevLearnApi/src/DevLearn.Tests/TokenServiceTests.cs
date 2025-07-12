using DevLearn.Auth;
using DevLearn.Auth.Token;
using DevLearn.Infrastructure.Modules.Users.Entities;
using DevLearn.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;


namespace DevLearnApi.tests
{
    public class TokenServiceTests
    {
        [Fact]
        public async Task GenerateTokensAsync_ReturnsValidTokens()
        {
            // Arrange
            var user = new ApplicationUser { Id = "1", Email = "test@example.com", UserName = "test" };

            var configInitialData = new List<KeyValuePair<string, string>>();
            configInitialData.Add(new KeyValuePair<string, string>("JwtKey", "super_secret_jwt_key_1234567890"));
            configInitialData.Add(new KeyValuePair<string, string>("JwtIssuer", "test_issuer"));
            var config = new ConfigurationBuilder().AddInMemoryCollection(configInitialData).Build();

            var userManagerMock = new Mock<UserManager<ApplicationUser>>();
            var redisMock = new Mock<IRedisService>();
            var dbContext = new Mock<UsersDbContext>(); // Configure as needed
            var tokenService = new TokenService(config, userManagerMock.Object, redisMock.Object, dbContext.Object);

            // Act
            var tokens = await tokenService.GenerateTokensAsync(user);

            // Assert
            Assert.NotNull(tokens);
            Assert.False(string.IsNullOrEmpty(tokens.AccessToken));
            Assert.False(string.IsNullOrEmpty(tokens.RefreshToken));
        }
    }
}
