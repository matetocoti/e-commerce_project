// Ponto de entrada da aplicação (equivalente ao main em Java)
// Aqui configuramos toda a aplicação ASP.NET antes de iniciá-la.

// Cria o builder da aplicação.
// O builder é responsável por configurar:
// - serviços (Dependency Injection)
// - middleware
// - configurações da aplicação
var builder = WebApplication.CreateBuilder(args);



// -------------------------------
// Registro de serviços
// -------------------------------
// Aqui registramos os serviços no container de Dependency Injection.
// Depois eles poderão ser injetados automaticamente em controllers,
// services, repositories, etc.

// Habilita suporte a Controllers (REST API)
builder.Services.AddControllers();

// Necessário para gerar metadados da API (usado pelo Swagger)
builder.Services.AddEndpointsApiExplorer();

// Adiciona suporte ao Swagger (documentação e teste da API)
builder.Services.AddSwaggerGen();



// -------------------------------
// Build da aplicação
// -------------------------------
// Aqui o ASP.NET cria a aplicação com todas as configurações registradas
var app = builder.Build();



// -------------------------------
// Configuração do pipeline HTTP
// -------------------------------
// Middleware define como cada requisição HTTP será processada.

// Se estiver em ambiente de desenvolvimento
// habilita Swagger para testar a API no navegador
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redireciona automaticamente requisições HTTP → HTTPS
app.UseHttpsRedirection();

// Habilita o sistema de autorização
// (usado quando adicionarmos autenticação JWT depois)
app.UseAuthorization();

// Mapeia os controllers para as rotas da API.
// O ASP.NET procura classes com:
// [ApiController]
// [Route("...")]
// e cria os endpoints automaticamente.
app.MapControllers();


// -------------------------------
// Inicializa o servidor web
// -------------------------------
// Aqui o servidor (Kestrel) começa a escutar requisições HTTP
app.Run();