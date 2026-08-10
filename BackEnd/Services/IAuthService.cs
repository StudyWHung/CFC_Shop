using CfcShop.Api.DTOs.Auth;

namespace CfcShop.Api.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<UserProfileDto?> GetProfileAsync(int userId);
}
