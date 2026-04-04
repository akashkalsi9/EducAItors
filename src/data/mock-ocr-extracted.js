/**
 * Mock extracted text per OCR confidence level.
 * Each word carries its own confidence rating for word-level highlighting.
 * Shared between OCRPreviewPage and OcrResultsModal.
 */
export const MOCK_EXTRACTED = {
  high: [
    { word: 'The',        conf: 'high'   },
    { word: 'revenue',    conf: 'high'   },
    { word: 'projection', conf: 'high'   },
    { word: 'for',        conf: 'high'   },
    { word: 'Q3',         conf: 'high'   },
    { word: 'assumes',    conf: 'high'   },
    { word: '12%',        conf: 'high'   },
    { word: 'growth',     conf: 'high'   },
    { word: 'driven',     conf: 'high'   },
    { word: 'by',         conf: 'high'   },
    { word: 'market',     conf: 'high'   },
    { word: 'expansion.', conf: 'high'   },
  ],
  medium: [
    { word: 'The',        conf: 'high'   },
    { word: 'revenue',    conf: 'high'   },
    { word: 'projection', conf: 'medium' },
    { word: 'for',        conf: 'high'   },
    { word: 'Q3',         conf: 'high'   },
    { word: 'assymes',    conf: 'medium' },
    { word: '12%',        conf: 'high'   },
    { word: 'grovvth',    conf: 'low'    },
    { word: 'drivn',      conf: 'medium' },
    { word: 'by',         conf: 'high'   },
    { word: 'markct',     conf: 'medium' },
    { word: 'expansion.', conf: 'high'   },
  ],
  low: [
    { word: 'Th3',        conf: 'low'    },
    { word: 'rev3nue',    conf: 'low'    },
    { word: 'proj3ction', conf: 'low'    },
    { word: 'f0r',        conf: 'high'   },
    { word: 'Q3',         conf: 'high'   },
    { word: '???',        conf: 'low'    },
    { word: '12%',        conf: 'medium' },
    { word: 'gr0wth',     conf: 'low'    },
    { word: 'dr1vn',      conf: 'low'    },
    { word: 'by',         conf: 'high'   },
    { word: 'm@rk3t',     conf: 'low'    },
    { word: '???',        conf: 'low'    },
  ],
}
