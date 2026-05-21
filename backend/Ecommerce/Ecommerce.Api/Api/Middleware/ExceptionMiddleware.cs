namespace Ecommerce.Api.Api.Middleware;

using Ecommerce.Api.Application.Exceptions;


public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    
    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred.");
            await HandleExceptionAsync(httpContext, ex);
        }
    }
    
    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var response = new { Message = exception.Message };
        
        switch (exception)
        {
            case UnauthorizedException:
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                break;
            case BadRequestException:
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                break;
            case NotFoundException:
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                break;
            default:
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                response = new { Message = "An unexpected error occurred. Please try again later." };
                break;
        }
        
        return context.Response.WriteAsJsonAsync(response);
    }
}