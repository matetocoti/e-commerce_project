using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


// Cria o builder da aplicação.
// O builder é responsável por configurar:
// - serviços (Dependency Injection)
// - middleware
// - configurações da aplicação
var builder = WebApplication.CreateBuilder(args);



// -------------------------------
// Registro de serviços
// -------------------------------

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);



// -------------------------------
// Build da aplicação
// -------------------------------
var app = builder.Build();



// -------------------------------
// Configuração do pipeline HTTP
// -------------------------------
// Middleware define como cada requisição HTTP será processada.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();


// -------------------------------
// Inicializa o servidor web
// -------------------------------
app.Run();