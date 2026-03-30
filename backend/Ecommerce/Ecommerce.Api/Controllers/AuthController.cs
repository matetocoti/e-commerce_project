using Microsoft.AspNetCore.Mvc;
using Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.Auth;
using Ecommerce.Api.Application.DTOS.User;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthService authService) : ControllerBase
{
    private readonly AuthService _authService = authService;

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterUserDto request)
    {
        try
        {
            var user = await _authService.RegisterAsync(request);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginUserDto request)
    {
        try
        {
            var user = await _authService.LoginAsync(request);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}