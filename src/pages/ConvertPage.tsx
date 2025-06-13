import { useState, useCallback } from "react";
import {
  Search,
  Plus,
  FileImage,
  Loader2,
  ChevronDown,
  ChevronUp,
  List,
  Grid3X3,
} from "lucide-react";

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface Card {
  id: string;
  name: string;
  set: string;
  set_name: string;
  mana_cost?: string;
  type_line: string;
  image_uris?: {
    normal: string;
    small: string;
  };
  card_faces?: Array<{
    name: string;
    mana_cost?: string;
    type_line: string;
    image_uris?: {
      normal: string;
      small: string;
    };
  }>;
}

interface SelectedCard extends Card {
  quantity: number;
  selectedArt?: Card;
  artOptions?: Card[];
  showArtSelection?: boolean;
  loadingArt?: boolean;
}

export const ConvertPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [searchResults, setSearchResults] = useState<Card[]>([]);
  const [suggestions, setSuggestions] = useState<Card[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [decklistText, setDecklistText] = useState("");
  const [isDecklistLoading, setIsDecklistLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Debounced search for suggestions
  const debouncedSuggestionSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        setIsSuggestionsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(
            query
          )}`
        );

        if (response.ok) {
          const data = await response.json();
          // Get card details for the suggestions
          const suggestionDetails = await Promise.all(
            data.data.slice(0, 8).map(async (cardName: string) => {
              try {
                const cardResponse = await fetch(
                  `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
                    cardName
                  )}`
                );
                if (cardResponse.ok) {
                  return await cardResponse.json();
                }
                return null;
              } catch {
                return null;
              }
            })
          );
          setSuggestions(suggestionDetails.filter(Boolean));
        }
      } catch (error) {
        console.error("Suggestion search error:", error);
        setSuggestions([]);
      } finally {
        setIsSuggestionsLoading(false);
      }
    }, 300),
    []
  );

  // Handle input change with suggestions
  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(true);

    if (value.length >= 2) {
      setIsSuggestionsLoading(true);
      debouncedSuggestionSearch(value);
    } else {
      setSuggestions([]);
      setIsSuggestionsLoading(false);
    }
  };

  const handleSuggestionClick = (card: Card) => {
    setSearchQuery(card.name);
    setShowSuggestions(false);
    performSearch(card.name);
  };
  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setShowSuggestions(false);

    try {
      // Use Scryfall API to search for cards
      const response = await fetch(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
          query
        )}&unique=cards&order=name`
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.data || []);
      } else {
        console.error("Search failed:", response.statusText);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };
  const addToSelected = async (card: Card) => {
    // Check if card is already selected
    if (selectedCards.some((selected) => selected.id === card.id)) {
      return;
    }

    // Add card with loading state
    const newSelectedCard: SelectedCard = {
      ...card,
      quantity: 1,
      selectedArt: card,
      artOptions: [],
      showArtSelection: false,
      loadingArt: true,
    };

    setSelectedCards((prev) => [...prev, newSelectedCard]);

    // Search for all art versions of this card
    const artOptions = await searchCardArts(card.name);

    // Update the card with art options
    setSelectedCards((prev) =>
      prev.map((selectedCard) =>
        selectedCard.id === card.id
          ? { ...selectedCard, artOptions, loadingArt: false }
          : selectedCard
      )
    );
  };
  // Search for all art versions of a card
  const searchCardArts = async (cardName: string): Promise<Card[]> => {
    try {
      const response = await fetch(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
          `!"${cardName}"`
        )}&unique=prints&order=released`
      );
      if (response.ok) {
        const data = await response.json();
        return (
          data.data?.filter((card: Card) => {
            // Only include cards with valid image URIs (regular or double-faced)
            return (
              (card.image_uris && card.image_uris.normal) ||
              (card.card_faces && card.card_faces[0]?.image_uris?.normal)
            );
          }) || []
        );
      }
    } catch (error) {
      console.error("Error searching card arts:", error);
    }
    return [];
  };

  const toggleArtSelection = (cardId: string) => {
    setSelectedCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? { ...card, showArtSelection: !card.showArtSelection }
          : card
      )
    );
  };

  const selectArt = (cardId: string, selectedArt: Card) => {
    setSelectedCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? { ...card, selectedArt, showArtSelection: false }
          : card
      )
    );
  };

  const handleConvertForMPC = () => {
    // MPC conversion functionality would go here
    const totalCards = selectedCards.reduce(
      (sum, card) => sum + card.quantity,
      0
    );
    console.log(`Converting ${totalCards} cards for MPC format...`);
    alert(
      `Converting ${totalCards} cards for MPC format. This will generate MPC-ready images.`
    );
  };

  const handleClearAll = () => {
    setSelectedCards([]);
  };
  const removeFromSelected = (cardId: string) => {
    setSelectedCards(selectedCards.filter((card) => card.id !== cardId));
  };

  const updateQuantity = (cardId: string, quantity: number) => {
    setSelectedCards(
      selectedCards.map((card) =>
        card.id === cardId ? { ...card, quantity } : card
      )
    );
  };

  // Parse decklist and add cards to selected
  const processDecklistLine = (
    line: string
  ): { name: string; quantity: number } | null => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) {
      return null; // Skip empty lines and comments
    }

    // Match various decklist formats:
    // "4 Lightning Bolt"
    // "4x Lightning Bolt"
    // "4 Lightning Bolt (Set Code)"
    // "Lightning Bolt"
    const match = trimmed.match(/^(\d+)x?\s+(.+?)(?:\s+\([^)]+\))?$/);

    if (match) {
      const quantity = parseInt(match[1]);
      const cardName = match[2].trim();
      return { name: cardName, quantity };
    } else {
      // No quantity specified, assume 1
      const cardName = trimmed.replace(/\s+\([^)]+\)$/, "").trim(); // Remove set code if present
      return { name: cardName, quantity: 1 };
    }
  };

  const handleDecklistSubmit = async () => {
    if (!decklistText.trim()) return;

    setIsDecklistLoading(true);
    const lines = decklistText.split("\n");
    const cardEntries: { name: string; quantity: number }[] = [];

    // Parse all lines
    for (const line of lines) {
      const entry = processDecklistLine(line);
      if (entry) {
        cardEntries.push(entry);
      }
    }

    // Process each unique card
    for (const entry of cardEntries) {
      try {
        // Search for the card
        const response = await fetch(
          `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
            entry.name
          )}`
        );

        if (response.ok) {
          const card = await response.json();

          // Check if card is already selected
          const existingCardIndex = selectedCards.findIndex(
            (selected) => selected.id === card.id
          );

          if (existingCardIndex >= 0) {
            // Update quantity if card already exists
            setSelectedCards((prev) =>
              prev.map((selectedCard, index) =>
                index === existingCardIndex
                  ? {
                      ...selectedCard,
                      quantity: selectedCard.quantity + entry.quantity,
                    }
                  : selectedCard
              )
            );
          } else {
            // Add new card
            const artOptions = await searchCardArts(card.name);
            const newSelectedCard: SelectedCard = {
              ...card,
              quantity: entry.quantity,
              selectedArt: card,
              artOptions,
              showArtSelection: false,
              loadingArt: false,
            };

            setSelectedCards((prev) => [...prev, newSelectedCard]);
          }
        } else {
          console.warn(`Card not found: ${entry.name}`);
        }
      } catch (error) {
        console.error(`Error adding card ${entry.name}:`, error);
      }
    }

    setIsDecklistLoading(false);
    setDecklistText(""); // Clear the textarea after processing
  };
  return (
    <div className="page">
      <h1>Convert</h1>
      <p>Search for individual cards and add them to your proxy list.</p>{" "}
      <div className="create-proxies-content">
        <div className="search-section">
          <h3>Card Search</h3>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for Magic cards..."
                className="input search-input"
                autoComplete="off"
              />
              {showSuggestions && searchQuery.length >= 2 && (
                <div className="suggestions-dropdown">
                  {isSuggestionsLoading ? (
                    <div className="suggestion-loading">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Loading suggestions...</span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((card) => (
                      <div
                        key={card.id}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(card)}
                      >
                        <div className="suggestion-info">
                          <span className="suggestion-name">{card.name}</span>
                          <span className="suggestion-details">
                            {card.mana_cost || "—"} • {card.set_name}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-suggestions">
                      <span>No suggestions found</span>
                    </div>
                  )}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Search
                  </>
                )}
              </button>
            </div>
          </form>

          {hasSearched && (
            <div className="search-results">
              <h4>Search Results ({searchResults.length})</h4>
              {isSearching ? (
                <div className="loading-results">
                  <Loader2 size={24} className="animate-spin" />
                  <p>Searching cards...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="no-results">
                  <p>
                    No cards found for "{searchQuery}". Try a different search
                    term.
                  </p>
                </div>
              ) : (
                <div className="card-results">
                  {searchResults.slice(0, 20).map((card: Card) => (
                    <div key={card.id} className="card-result">
                      <div className="card-info">
                        <h5>{card.name}</h5>
                        <p>
                          {card.mana_cost || "—"} • {card.type_line} •{" "}
                          {card.set_name}
                        </p>
                      </div>
                      <button
                        className="btn btn-secondary"
                        onClick={() => addToSelected(card)}
                        disabled={selectedCards.some(
                          (selected) => selected.id === card.id
                        )}
                      >
                        <Plus size={16} />
                        {selectedCards.some(
                          (selected) => selected.id === card.id
                        )
                          ? "Added"
                          : "Add"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Decklist Import Section */}
        <div className="decklist-import-section">
          <h3>Import Decklist</h3>
          <p>Paste or type a decklist to add multiple cards at once.</p>
          <div className="decklist-input-group">
            <textarea
              value={decklistText}
              onChange={(e) => setDecklistText(e.target.value)}
              placeholder={`Example formats:
4 Lightning Bolt
3x Counterspell
2 Jace, the Mind Sculptor (WAR)
Brainstorm`}
              className="decklist-textarea"
              rows={6}
              disabled={isDecklistLoading}
            />
            <button
              onClick={handleDecklistSubmit}
              className="btn btn-primary"
              disabled={isDecklistLoading || !decklistText.trim()}
            >
              {isDecklistLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add All Cards
                </>
              )}
            </button>
          </div>
        </div>{" "}
        <div className="selected-cards-section">
          <div className="selected-cards-header">
            <h3>Selected Cards ({selectedCards.length})</h3>
            {selectedCards.length > 0 && (
              <div className="view-mode-selector">
                <button
                  className={`view-mode-btn ${
                    viewMode === "list" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <List size={16} />
                </button>
                <button
                  className={`view-mode-btn ${
                    viewMode === "grid" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <Grid3X3 size={16} />
                </button>
              </div>
            )}
          </div>
          {selectedCards.length === 0 ? (
            <div className="empty-selection">
              <p>No cards selected yet. Search and add cards above.</p>
            </div>
          ) : (
            <div
              className={`selected-cards-list ${
                viewMode === "grid" ? "grid-view" : "list-view"
              }`}
            >
              {selectedCards.map((card: SelectedCard, index) => (
                <div
                  key={`${card.id}-${index}`}
                  className={`selected-card ${viewMode}-card`}
                >
                  <div className="card-display">
                    <div className="card-image">
                      {card.selectedArt &&
                      (card.selectedArt.image_uris?.normal ||
                        card.selectedArt.card_faces?.[0]?.image_uris
                          ?.normal) ? (
                        <img
                          src={
                            card.selectedArt.image_uris?.normal ||
                            card.selectedArt.card_faces?.[0]?.image_uris?.normal
                          }
                          alt={card.name}
                          className="card-art"
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <div className="card-details">
                      <h5>{card.name}</h5>
                      {viewMode === "list" && (
                        <p>
                          {card.mana_cost || "—"} • {card.type_line} •{" "}
                          {card.selectedArt?.set_name || card.set_name}
                        </p>
                      )}
                      {card.loadingArt ? (
                        <div className="art-loading">
                          <Loader2 size={14} className="animate-spin" />
                          Loading art options...
                        </div>
                      ) : (
                        card.artOptions &&
                        card.artOptions.length > 1 && (
                          <button
                            className="btn btn-sm art-selection-toggle"
                            onClick={() => toggleArtSelection(card.id)}
                          >
                            {card.showArtSelection ? (
                              <>
                                <ChevronUp size={14} />
                                Hide Art Options
                              </>
                            ) : (
                              <>
                                <ChevronDown size={14} />
                                {card.artOptions.length} Art Options
                              </>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div
                    className={`art-selection-container ${
                      card.showArtSelection ? "expanded" : "collapsed"
                    }`}
                  >
                    {card.artOptions && (
                      <div className="art-selection-grid">
                        {card.artOptions.map((artOption) => (
                          <div
                            key={artOption.id}
                            className={`art-option ${
                              card.selectedArt?.id === artOption.id
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => selectArt(card.id, artOption)}
                          >
                            <img
                              src={
                                artOption.image_uris?.normal ||
                                artOption.card_faces?.[0]?.image_uris?.normal
                              }
                              alt={`${card.name} - ${artOption.set_name}`}
                              className="art-option-image"
                            />
                            <div className="art-option-info">
                              <span className="set-name">
                                {artOption.set_name}
                              </span>
                              <span className="set-code">
                                ({artOption.set})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="quantity-controls">
                    <label>
                      Qty:
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={card.quantity}
                        onChange={(e) =>
                          updateQuantity(card.id, parseInt(e.target.value))
                        }
                        className="quantity-input"
                      />
                    </label>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromSelected(card.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedCards.length > 0 && (
        <div className="action-buttons">
          <button className="btn btn-primary">
            Generate{" "}
            {selectedCards.reduce((sum, card) => sum + card.quantity, 0)}{" "}
            Proxies
          </button>
          <button className="btn btn-mpc" onClick={handleConvertForMPC}>
            <FileImage size={16} />
            Convert for MPC
          </button>
          <button className="btn btn-secondary" onClick={handleClearAll}>
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
