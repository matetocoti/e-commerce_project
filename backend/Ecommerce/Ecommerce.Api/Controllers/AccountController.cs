namespace Ecommerce.Api.Controllers;

using Ecommerce.Api.Application.DTOS.User;
using Ecommerce.Api.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Api.Application.Common.Interfaces;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountController(UserService userService ,ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = currentUser.GetUserId();
        var user = await userService.GetUserByIdAsync(userId);
        return Ok(user);
    }

    [HttpPut("username")]
    public async Task<IActionResult> UpdateUsername([FromBody] UpdateUsernameDto dto)
    {
        var userId = currentUser.GetUserId();
        await userService.UpdateUsernameAsync(userId, dto.Username);
        return NoContent();
    }

    [HttpPut("phone")]
    public async Task<IActionResult> UpdatePhoneNumber([FromBody] UpdatePhoneNumberDto dto)
    {
        var userId = currentUser.GetUserId();
        await userService.UpdatePhoneNumberAsync(userId, dto.PhoneNumber);
        return NoContent();
    }
}