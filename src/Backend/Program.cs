using Microsoft.AspNetCore.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddOpenApi(options =>
{
    // Optional: pin spec to 3.0 if your tooling requires it
    // options.OpenApiVersion = Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_0;
});


builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());

// Setup Database
var connectionString = builder.Configuration.GetConnectionString("Backend") ?? throw new ArgumentNullException("Backend Connectionsting not set");
builder.Services.AddDbContext<BackendContext>(x => x.UseSqlite(connectionString));

// Build app
var app = builder.Build();

app.InitAndSeedBackendContest();



app.MapOpenApi(); // exposes /openapi/v1.json

// Add a UI and point it to the built-in document
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/openapi/v1.json", "My API v1");
    c.RoutePrefix = "docs"; // UI at /docs
});



// Register all the routes for the api
app.UseApiRoutes();

// Run the application
app.Run();
