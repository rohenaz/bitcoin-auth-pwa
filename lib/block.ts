// example response

// {"header":{"hash":"000000...","version":939524096,...},"state":"LONGEST_CHAIN","chainWork":4319...,"height":895061}

// Common simplified return type
type BlockHeightResult = {
  height: number | null;
};

// Unified fetch function
export const getLatestBlockHeight = async (
  provider: "woc" | "bh" = "bh"
): Promise<BlockHeightResult> => {
  try {
    if (provider === "woc") {
      const response = await fetch(
        "https://api.whatsonchain.com/v1/bsv/main/chain/info"
      );
      if (!response.ok) {
        console.warn(
          `[getLatestBlockHeight WOC] Request failed: ${response.status} ${response.statusText}`
        );
        return { height: null };
      }
      // Define type inline as it's only used here now
      type WocChainInfo = { blocks: number };
      const data = (await response.json()) as WocChainInfo;
      return { height: data.blocks };
    }
    const resp = await fetch(
      "https://block-headers-service-production.up.railway.app/api/v1/chain/tip/longest",
      {
        method: "GET",
        headers: { accept: "application/json" },
      }
    );
    if (!resp.ok) {
      console.error(
        `[getLatestBlockHeight BH] Error fetching: ${resp.statusText}`
      );
      return { height: null };
    }
    // Define type inline
    type LongestChainTip = { height: number };
    const data = (await resp.json()) as LongestChainTip;
    return { height: data.height };
  } catch (error) {
    console.error(
      `[getLatestBlockHeight ${provider.toUpperCase()}] Fetch error:`,
      error
    );
    return { height: null };
  }
};
