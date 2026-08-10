using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CfcShop.Api.Data;
using CfcShop.Api.DTOs.Auth;
using CfcShop.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CfcShop.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _context.Users
            .AnyAsync(u => u.Email.ToLower() == dto.Email.Trim().ToLower());

        if (existingUser)
        {
            throw new InvalidOperationException("Email đã được sử dụng trên hệ thống.");
        }

        // Mặc định gán Role "User" (RoleId = 2)
        var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "User")
            ?? await _context.Roles.FirstOrDefaultAsync()
            ?? throw new InvalidOperationException("Không tìm thấy vai trò (Role) trong hệ thống.");

        var user = new User
        {
            Email = dto.Email.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FullName = dto.FullName.Trim(),
            RoleId = defaultRole.RoleId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Load navigation property Role cho token generation
        user.Role = defaultRole;

        var (token, expiresAt) = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.UserId,
            Email = user.Email,
            FullName = user.FullName,
            RoleName = defaultRole.RoleName,
            ExpiresAt = expiresAt
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.Trim().ToLower());

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new InvalidOperationException("Email hoặc mật khẩu không chính xác.");
        }

        var (token, expiresAt) = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.UserId,
            Email = user.Email,
            FullName = user.FullName,
            RoleName = user.Role?.RoleName ?? "User",
            ExpiresAt = expiresAt
        };
    }

    public async Task<UserProfileDto?> GetProfileAsync(int userId)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null) return null;

        return new UserProfileDto
        {
            UserId = user.UserId,
            Email = user.Email,
            FullName = user.FullName,
            RoleName = user.Role?.RoleName ?? "User",
            CreatedAt = user.CreatedAt
        };
    }

    private (string token, DateTime expiresAt) GenerateJwtToken(User user)
    {
        var secretKey = _config["Jwt:Key"] 
            ?? throw new InvalidOperationException("Chưa cấu hình Jwt:Key trong appsettings.json.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role?.RoleName ?? "User")
        };

        var expireMinutes = double.Parse(_config["Jwt:ExpireMinutes"] ?? "120");
        var expiresAt = DateTime.UtcNow.AddMinutes(expireMinutes);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds
        );

        var token = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        return (token, expiresAt);
    }
}
