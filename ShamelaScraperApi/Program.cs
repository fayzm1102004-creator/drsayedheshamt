using ShamelaScraperApi.Services;

var builder = WebApplication.CreateBuilder(args);

// ───────────────────────────────────────────────
//  Services Configuration
// ───────────────────────────────────────────────

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Use camelCase for JSON property names (React convention)
        options.JsonSerializerOptions.PropertyNamingPolicy =
            System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();

// ── CORS: Allow the React frontend origin ──
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",   // Vite dev server default
                "http://localhost:3000",   // Common React dev port
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ── HttpClient for Shamela with realistic browser headers ──
builder.Services.AddHttpClient("Shamela", client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);

    // Mimic a real browser to reduce Cloudflare challenge likelihood
    client.DefaultRequestHeaders.Add("User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/126.0.0.0 Safari/537.36");

    client.DefaultRequestHeaders.Add("Accept",
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");

    client.DefaultRequestHeaders.Add("Accept-Language", "ar,en;q=0.9,en-US;q=0.8");
    client.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
    client.DefaultRequestHeaders.Add("Cache-Control", "no-cache");
    client.DefaultRequestHeaders.Add("Sec-Fetch-Dest", "document");
    client.DefaultRequestHeaders.Add("Sec-Fetch-Mode", "navigate");
    client.DefaultRequestHeaders.Add("Sec-Fetch-Site", "none");
    client.DefaultRequestHeaders.Add("Sec-Fetch-User", "?1");
    client.DefaultRequestHeaders.Add("Upgrade-Insecure-Requests", "1");
})
.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
    AutomaticDecompression =
        System.Net.DecompressionMethods.GZip |
        System.Net.DecompressionMethods.Deflate |
        System.Net.DecompressionMethods.Brotli
});

// ── Register scraper service ──
builder.Services.AddScoped<IShamelaScraperService, ShamelaScraperService>();

// ───────────────────────────────────────────────
//  App Pipeline
// ───────────────────────────────────────────────

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors("ReactFrontend");
app.MapControllers();

app.Logger.LogInformation(
    "ShamelaScraperApi is starting on {Urls}",
    string.Join(", ", app.Urls));

app.Run();
