namespace ShamelaScraperApi.Models;

/// <summary>
/// Represents a single search result scraped from the Shamela Islamic Library.
/// </summary>
public class SearchResult
{
    /// <summary>
    /// The title of the book (عنوان الكتاب).
    /// </summary>
    public string BookTitle { get; set; } = string.Empty;

    /// <summary>
    /// The quote or text snippet matching the search query (نص الشاهد).
    /// </summary>
    public string QuoteText { get; set; } = string.Empty;

    /// <summary>
    /// Reference information including volume, page number, and author (الجزء/الصفحة/المؤلف).
    /// </summary>
    public string ReferenceInfo { get; set; } = string.Empty;

    /// <summary>
    /// Direct URL to the source page on shamela.ws.
    /// </summary>
    public string SourceUrl { get; set; } = string.Empty;
}
