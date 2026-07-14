using ShamelaScraperApi.Models;

namespace ShamelaScraperApi.Services;

/// <summary>
/// Defines the contract for scraping search results from the Shamela Islamic Library.
/// </summary>
public interface IShamelaScraperService
{
    /// <summary>
    /// Searches the Shamela library for the given keyword and returns parsed results.
    /// </summary>
    /// <param name="keyword">The Arabic search term.</param>
    /// <param name="page">The page number for pagination (default: 1).</param>
    /// <param name="cancellationToken">Cancellation token for the async operation.</param>
    /// <returns>A SearchResponse containing the parsed results or error information.</returns>
    Task<SearchResponse> SearchAsync(string keyword, int page = 1, CancellationToken cancellationToken = default);
}
