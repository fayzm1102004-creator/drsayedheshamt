namespace ShamelaScraperApi.Models;

/// <summary>
/// Wrapper response for the scraper search endpoint.
/// Provides success/failure status alongside the results array.
/// </summary>
public class SearchResponse
{
    /// <summary>
    /// Indicates whether the scraping operation completed successfully.
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// Human-readable error message in Arabic when Success is false.
    /// </summary>
    public string? ErrorMessage { get; set; }

    /// <summary>
    /// Total number of results found.
    /// </summary>
    public int TotalResults { get; set; }

    /// <summary>
    /// The list of parsed search results.
    /// </summary>
    public List<SearchResult> Results { get; set; } = new();
}
