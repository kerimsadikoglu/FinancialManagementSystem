using FinancialManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Policy ismini tan�mlay�n
string ApiCorsPolicy = "_apiCorsPolicy";

// Add services to the container.S
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS'u ekleyin ve izin verece�iniz siteleri belirtin
builder.Services.AddCors(options =>
{
	options.AddPolicy(ApiCorsPolicy, builder =>
	{
		builder.WithOrigins("https://localhost:7044", "http://www.example.com")
			   .AllowAnyMethod()
			   .AllowAnyHeader();
	});
});

// Add DbContext
builder.Services.AddDbContext<FinancialContext>(options =>
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI(c =>
	{
		c.SwaggerEndpoint("/swagger/v1/swagger.json", "FinancialManagementSystem v1");
		c.RoutePrefix = "swagger"; // Swagger UI'yi /swagger alt�nda �al��t�r
	});
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Statik dosyalar� sunma
app.UseDefaultFiles(); // index.html dosyas�n� varsay�lan olarak sunma

// CORS'u kullan
app.UseCors(ApiCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
