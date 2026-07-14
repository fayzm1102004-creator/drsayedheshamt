using System.Text.RegularExpressions;
using System.Net;
using System.Web;
using HtmlAgilityPack;
using ShamelaScraperApi.Models;

namespace ShamelaScraperApi.Services;

/// <summary>
/// Scrapes search results from the Shamela Islamic Library (shamela.ws).
/// Uses HtmlAgilityPack for resilient HTML parsing with multiple fallback selector strategies,
/// since shamela.ws has no public API and its HTML structure may change without notice.
/// </summary>
public class ShamelaScraperService : IShamelaScraperService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ShamelaScraperService> _logger;
    private const string BaseSearchUrl = "https://shamela.ws/ajax/search";
    private const string BaseSiteUrl = "https://shamela.ws";

    public ShamelaScraperService(
        IHttpClientFactory httpClientFactory,
        ILogger<ShamelaScraperService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<SearchResponse> SearchAsync(
        string keyword, int page = 1, CancellationToken cancellationToken = default)
    {
        var response = new SearchResponse();

        try
        {
            var client = _httpClientFactory.CreateClient("Shamela");
            var requestUrl = BaseSearchUrl;
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("term", keyword),
                new KeyValuePair<string, string>("page", page.ToString())
            });

            _logger.LogInformation("Initiating Shamela search — URL: {Url}", requestUrl);

            var httpResponse = await client.PostAsync(requestUrl, content, cancellationToken);

            if (!httpResponse.IsSuccessStatusCode)
            {
                var statusCode = (int)httpResponse.StatusCode;
                _logger.LogWarning("Shamela returned HTTP {StatusCode} for keyword '{Keyword}'", statusCode, keyword);

                response.Success = false;
                response.ErrorMessage = statusCode switch
                {
                    403 => "تم حظر الطلب من قبل الموقع. قد تحتاج لإعادة المحاولة لاحقاً.",
                    429 => "تم تجاوز الحد المسموح من الطلبات. يرجى الانتظار قليلاً.",
                    503 => "الموقع تحت الصيانة أو محمي بنظام Cloudflare.",
                    _ => $"خطأ من الخادم: HTTP {statusCode}"
                };
                return response;
            }

            var html = await httpResponse.Content.ReadAsStringAsync(cancellationToken);

            // Detect Cloudflare challenge pages (usually very short HTML with JS challenge)
            if (string.IsNullOrWhiteSpace(html) || html.Length < 500)
            {
                _logger.LogWarning(
                    "Received suspiciously short HTML response ({Length} chars). " +
                    "Possible Cloudflare challenge or empty page.",
                    html?.Length ?? 0);

                response.Success = false;
                response.ErrorMessage =
                    "تم استلام استجابة غير مكتملة. قد يكون الموقع محمياً بنظام Cloudflare.";
                return response;
            }

            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var results = ParseSearchResults(doc);

            response.Success = true;
            response.Results = results;
            response.TotalResults = results.Count;

            _logger.LogInformation(
                "Successfully parsed {Count} results from Shamela for keyword '{Keyword}'",
                results.Count, keyword);
        }
        catch (TaskCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            _logger.LogWarning("Shamela request timed out for keyword '{Keyword}'", keyword);
            response.Success = false;
            response.ErrorMessage = "انتهت مهلة الاتصال بالمكتبة الشاملة. يرجى المحاولة مرة أخرى.";
        }
        catch (TaskCanceledException)
        {
            _logger.LogInformation("Shamela request was cancelled by the caller");
            response.Success = false;
            response.ErrorMessage = "تم إلغاء الطلب.";
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Network error while contacting Shamela");
            response.Success = false;
            response.ErrorMessage = $"خطأ في الشبكة: تعذر الاتصال بالمكتبة الشاملة. تحقق من اتصال الإنترنت.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during Shamela scraping for keyword '{Keyword}'", keyword);
            response.Success = false;
            response.ErrorMessage = "حدث خطأ غير متوقع أثناء البحث.";
        }

        return response;
    }

    // ─────────────────────────────────────────────────────
    //  HTML Parsing — Multiple Strategy Approach
    // ─────────────────────────────────────────────────────

    /// <summary>
    /// Parses search results from the full HTML document using multiple
    /// selector strategies for resilience against HTML structure changes.
    /// </summary>
    private List<SearchResult> ParseSearchResults(HtmlDocument doc)
    {
        var results = new List<SearchResult>();

        // In the AJAX response, each result is a <div> containing a link, followed by a <p class="srch-snippet">
        var titleDivs = doc.DocumentNode.SelectNodes("//div[.//a[contains(@href, '/book/')]]");

        if (titleDivs == null || titleDivs.Count == 0)
        {
            _logger.LogWarning(
                "No search result title containers found. " +
                "The HTML structure of shamela.ws may have changed.");
            return results;
        }

        _logger.LogDebug("Found {Count} potential result title divs", titleDivs.Count);

        foreach (var div in titleDivs)
        {
            try
            {
                var linkNode = div.SelectSingleNode(".//a[contains(@href, '/book/')]");
                if (linkNode == null) continue;

                var titleNode = linkNode.SelectSingleNode(".//*[contains(@class, 'text-primaryy')]") ?? linkNode;
                var authorNode = linkNode.SelectSingleNode(".//*[contains(@class, 'text-gray')]");
                
                // The quote is in the next sibling <p> with class 'srch-snippet'
                var snippetNode = div.NextSibling;
                while (snippetNode != null && snippetNode.Name != "p")
                {
                    snippetNode = snippetNode.NextSibling;
                }

                var quoteText = CleanText(snippetNode?.InnerText);
                // Remove the "عرض المزيد" button text from the end if it exists
                if (!string.IsNullOrEmpty(quoteText) && quoteText.EndsWith("عرض المزيد"))
                {
                    quoteText = quoteText.Substring(0, quoteText.Length - "عرض المزيد".Length).Trim();
                }

                var href = linkNode.GetAttributeValue("href", string.Empty);
                var sourceUrl = href.StartsWith("http", StringComparison.OrdinalIgnoreCase) ? href : $"{BaseSiteUrl}{href}";

                var result = new SearchResult
                {
                    BookTitle = CleanText(titleNode.InnerText),
                    QuoteText = quoteText,
                    ReferenceInfo = CleanText(authorNode?.InnerText) ?? string.Empty,
                    SourceUrl = sourceUrl
                };

                if (!string.IsNullOrWhiteSpace(result.BookTitle) || !string.IsNullOrWhiteSpace(result.QuoteText))
                {
                    results.Add(result);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to parse individual search result node, skipping");
            }
        }

        return results;
    }



    // ─────────────────────────────────────────────────────
    //  Text Cleanup Utilities
    // ─────────────────────────────────────────────────────

    /// <summary>
    /// Cleans extracted HTML text by decoding entities, stripping tags,
    /// and normalizing whitespace for clean JSON output.
    /// </summary>
    private static string CleanText(string? rawText)
    {
        if (string.IsNullOrWhiteSpace(rawText))
            return string.Empty;

        // Decode HTML entities (e.g., &amp; → &, &#1576; → ب)
        var decoded = WebUtility.HtmlDecode(rawText);

        // Normalize all whitespace (newlines, tabs, multiple spaces) to single space
        decoded = Regex.Replace(decoded, @"\s+", " ");

        return decoded.Trim();
    }
}
