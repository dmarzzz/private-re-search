"""
Dense embeddings + 4-bit quantization.

We use TF-IDF -> TruncatedSVD (latent semantic analysis) because this laptop has
no neural embedder installed. LSA is a legitimate dense embedding; it is a
weaker semantic space than a sentence-transformer, but every number that matters
for the privacy/cost story (latency, communication, hint size, crypto fidelity)
is independent of which embedder produced the vectors. To use real neural
embeddings, replace `Embedder.fit/encode` with a sentence-transformers call that
returns L2-normalized float vectors of dimension `d`; nothing downstream changes.

Quantization matches Tiptoe: signed 4-bit integers. We report the recall tax of
quantization separately so it is never hidden.
"""
from __future__ import annotations
import numpy as np
from dataclasses import dataclass
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import normalize

BITS = 4
QMAX = (1 << (BITS - 1)) - 1     # +7
QMIN = -(1 << (BITS - 1))        # -8


@dataclass
class Embedder:
    d: int = 128
    scale: float = 0.0           # learned at fit time
    _vec: TfidfVectorizer = None
    _svd: TruncatedSVD = None

    def fit(self, texts: list[str]):
        self._vec = TfidfVectorizer(max_features=30000, stop_words="english",
                                    sublinear_tf=True, ngram_range=(1, 2), min_df=2)
        X = self._vec.fit_transform(texts)
        self._svd = TruncatedSVD(n_components=self.d, random_state=0)
        Z = self._svd.fit_transform(X)
        Z = normalize(Z)
        # pick a global scale so ~3 std of the component distribution maps to QMAX
        self.scale = QMAX / (3.0 * Z.std() + 1e-9)
        return self

    def encode(self, texts: list[str]) -> np.ndarray:
        X = self._vec.transform(texts)
        Z = self._svd.transform(X)
        return normalize(Z)

    def quantize(self, Z: np.ndarray) -> np.ndarray:
        return np.clip(np.rint(Z * self.scale), QMIN, QMAX).astype(np.int64)


def topk_plain(scores: np.ndarray, k: int) -> np.ndarray:
    """Indices of the k highest scores, descending."""
    if k >= len(scores):
        return np.argsort(-scores)
    idx = np.argpartition(-scores, k)[:k]
    return idx[np.argsort(-scores[idx])]
