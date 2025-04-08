const express = require("express");
const router = express.Router();
const axios = require("axios");

// Semantic Scholar API endpoints
const SEMANTIC_SCHOLAR_API = "https://api.semanticscholar.org/graph/v1/paper/search";
const SEMANTIC_SCHOLAR_PAPER_API = "https://api.semanticscholar.org/graph/v1/paper";

/**
 * Search for papers using Semantic Scholar API
 * GET /api/semantic/search?query=your_search_query&limit=10&offset=0
 */
router.get("/search", async (req, res) => {
  const { 
    query, 
    limit = 10, 
    offset = 0, 
    yearMin, 
    yearMax,
    sortBy = 'relevance',
    type
  } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  try {
    // Build query parameters
    const params = {
      query,
      limit: parseInt(limit),
      offset: parseInt(offset),
      fields: "paperId,title,abstract,authors,year,url,venue,citationCount,isOpenAccess,openAccessPdf,publicationTypes"
    };

    // Add year filters if provided
    if (yearMin) params.yearMin = parseInt(yearMin);
    if (yearMax) params.yearMax = parseInt(yearMax);

    // Add sorting
    if (sortBy === 'citations') {
      params.sort = 'citationCount:desc';
    } else if (sortBy === 'year') {
      params.sort = 'year:desc';
    }

    // Make request to Semantic Scholar API
    const response = await axios.get(SEMANTIC_SCHOLAR_API, { params });

    // Filter by document type if specified
    let filteredData = response.data.data || [];
    if (type && type !== 'all') {
      filteredData = filteredData.filter(paper => 
        paper.publicationTypes?.some(pubType => 
          pubType.toLowerCase().includes(type.toLowerCase())
        )
      );
    }

    // Transform the response
    const transformedResponse = {
      total: type !== 'all' ? filteredData.length : (response.data.total || 0),
      offset: parseInt(offset),
      next: response.data.next,
      data: filteredData
    };

    return res.json(transformedResponse);
  } catch (err) {
    console.error("Semantic Scholar API error:", err.message);
    if (err.response?.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again in a few minutes.",
        details: "Semantic Scholar API allows 100 requests per 5 minutes without an API key."
      });
    }
    return res.status(500).json({ 
      error: "Failed to fetch data from Semantic Scholar",
      details: err.message
    });
  }
});

/**
 * Get paper details by ID
 * GET /api/semantic/paper/:paperId
 */
router.get("/paper/:paperId", async (req, res) => {
  const { paperId } = req.params;

  if (!paperId) {
    return res.status(400).json({ error: "Missing paper ID" });
  }

  try {
    const response = await axios.get(
      `${SEMANTIC_SCHOLAR_PAPER_API}/${paperId}`,
      {
        params: {
          fields: "paperId,title,abstract,authors,year,url,venue,citationCount,isOpenAccess,openAccessPdf,references"
        }
      }
    );

    return res.json(response.data);
  } catch (err) {
    console.error("Semantic Scholar API error:", err.message);
    if (err.response?.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again in a few minutes.",
        details: "Semantic Scholar API allows 100 requests per 5 minutes without an API key."
      });
    }
    return res.status(500).json({ 
      error: "Failed to fetch paper details",
      details: err.message
    });
  }
});

module.exports = router; 