using Core.Implementation;
using Core.Interfaces;
using ExternalApis;
using Refit;
using WebApi.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddScoped<IPlacesService, PlacesService>();

var hereApiKey = builder.Configuration.GetValue<string>("HereApi:ApiKey")!;

builder.Services.AddRefitClient<IHerePlacesApi>()
    .ConfigureHttpClient(c =>
    {
        c.BaseAddress = new Uri("https://discover.search.hereapi.com/v1");
    });

var app = builder.Build();

app.MapPlaceEndpoints();

app.Run();