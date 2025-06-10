using Core.Implementation;
using Core.Interfaces;
using ExternalApis;
using Refit;
using WebApi.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddScoped<IPlacesService, HerePlacesService>();
builder.Services.AddScoped<IDirectionService, DirectionService>();
builder.Services.AddScoped<IMapboxService, MapboxService>();

builder.Services.AddCors();

builder.Services.AddRefitClient<IHerePlacesApi>()
    .ConfigureHttpClient(c =>
    {
        c.BaseAddress = new Uri("https://discover.search.hereapi.com/v1");
    });

builder.Services.AddRefitClient<IMapboxApi>()
    .ConfigureHttpClient(client =>
    {
        client.BaseAddress = new Uri("https://api.mapbox.com");
    });

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});


var app = builder.Build();

app.MapPlaceEndpoints();
app.MapDirectionEndpoint();

app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:5173");
});


app.Run();