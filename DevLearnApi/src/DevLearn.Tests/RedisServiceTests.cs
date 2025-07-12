using StackExchange.Redis;

namespace DevLearnApi.tests
{
    public class RedisServiceTests
    {
        [Fact]
        public async Task AddToBlacklistAsync_StoresKey()
        {
            var dbMock = new Mock<IDatabase>();
            var multiplexerMock = new Mock<IConnectionMultiplexer>();
            multiplexerMock.Setup(m => m.GetDatabase(It.IsAny<int>(), null)).Returns(dbMock.Object);

            var service = new RedisService(multiplexerMock.Object);
            await service.AddToBlacklistAsync("test-jti", DateTime.UtcNow.AddMinutes(5));

            dbMock.Verify(x => x.StringSetAsync(
                It.Is<RedisKey>(key => key.ToString().Contains("jwt_blacklist:test-jti")),
                It.Is<RedisValue>(val => val.ToString() == "1"),
                It.IsAny<TimeSpan>(),
                null, When.Always, CommandFlags.None
            ));
        }
    }
}
