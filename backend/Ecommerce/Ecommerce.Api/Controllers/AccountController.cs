namespace Ecommerce.Api.Controllers;

using Ecommerce.Api.Application.DTOS.User;
using Ecommerce.Api.Application.Exceptions;
using Ecommerce.Api.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountController(UserService userService) : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = GetUserIdFromToken();
        var user = await userService.GetUserByIdAsync(userId);
        return Ok(user);
    }

    [HttpPut("username")]
    public async Task<IActionResult> UpdateUsername([FromBody] UpdateUsernameDto dto)
    {
        var userId = GetUserIdFromToken();
        await userService.UpdateUsernameAsync(userId, dto.Username);
        return NoContent();
    }

    [HttpPut("phone")]
    public async Task<IActionResult> UpdatePhoneNumber([FromBody] UpdatePhoneNumberDto dto)
    {
        var userId = GetUserIdFromToken();
        await userService.UpdatePhoneNumberAsync(userId, dto.PhoneNumber);
        return NoContent();
    }

    private Guid GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            throw new UnauthorizedException("Token inválido ou usuário não autenticado.");

        return userId;
    }
}