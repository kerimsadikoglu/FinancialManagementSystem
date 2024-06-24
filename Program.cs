using FinancialManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Policy ismini tanýmlayýn
string ApiCorsPolicy = "_apiCorsPolicy";

// Add services to the container.S
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS'u ekleyin ve izin vereceðiniz siteleri belirtin
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
		c.RoutePrefix = "swagger"; // Swagger UI'yi /swagger altýnda çalýþtýr
	});
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Statik dosyalarý sunma
app.UseDefaultFiles(); // index.html dosyasýný varsayýlan olarak sunma

// CORS'u kullan
app.UseCors(ApiCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
