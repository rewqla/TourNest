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

var hereApiKey = builder.Configuration.GetValue<string>("HereApi:ApiKey")!;

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


var app = builder.Build();

app.MapPlaceEndpoints();
app.MapDirectionEndpoint();

app.Run();