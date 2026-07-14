using Microsoft.AspNetCore.Mvc;
using ShamelaScraperApi.Services;

namespace ShamelaScraperApi.Controllers;

/// <summary>
/// API controller for the Shamela library web scraping endpoint.
/// Provides search functionality that scrapes and parses results from shamela.ws.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ScraperController : ControllerBase
{
    private readonly IShamelaScraperService _scraperService;
    private readonly ILogger<ScraperController> _logger;

    public ScraperController(
        IShamelaScraperService scraperService,
        ILogger<ScraperController> logger)
    {
        _scraperService = scraperService;
        _logger = logger;
    }

    /// <summary>
    /// Searches the Shamela Islamic Library for the given keyword.
    /// </summary>
    /// <param name="keyword">The Arabic search term (required).</param>
    /// <param name="page">Page number for pagination (default: 1).</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>
    /// 200 OK with SearchResponse on success.
    /// 400 Bad Request if keyword is missing.
    /// 502 Bad Gateway if the upstream scraping operation fails.
    /// </returns>
    /// <example>
    /// GET /api/scraper/search?keyword=بسم الله&amp;page=1
    /// </example>
    [HttpGet("search")]
    [ProducesResponseType(typeof(Models.SearchResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(Models.SearchResponse), StatusCodes.Status502BadGateway)]
    public async Task<IActionResult> Search(
        [FromQuery] string? keyword,
        [FromQuery] int page = 1,
        CancellationToken cancellationToken = default)
    {
        // ── Validate input ──
        if (string.IsNullOrWhiteSpace(keyword))
        {
            _logger.LogWarning("Search request received with empty keyword");
            return BadRequest(new Models.SearchResponse
            {
                Success = false,
                ErrorMessage = "يرجى إدخال كلمة البحث. حقل الكلمة المفتاحية مطلوب."
            });
        }

        if (page < 1) page = 1;

        // ── Execute search ──
        _logger.LogInformation(
            "Processing search request — Keyword: '{Keyword}', Page: {Page}",
            keyword, page);

        var result = await _scraperService.SearchAsync(keyword, page, cancellationToken);

        // ── Return appropriate HTTP status ──
        if (!result.Success)
        {
            _logger.LogWarning(
                "Search failed for keyword '{Keyword}': {Error}",
                keyword, result.ErrorMessage);

            return StatusCode(StatusCodes.Status502BadGateway, result);
        }

        return Ok(result);
    }
}
