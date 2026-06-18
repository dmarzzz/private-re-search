"""
The private index: build artifacts and answer queries three ways.

  mode = "plain"    server sees the plaintext query (baseline, no privacy)
  mode = "pir"      full-scan LWE: server computes over ALL docs, learns nothing
  mode = "pir_cluster"  client picks nearest cluster locally, PIR over just that
                        cluster. FASTER, but LEAKS the cluster id (a coarse topic)
                        to the server. Included to measure the privacy/speed knob.

Tiptoe's own trick (pad the query across all clusters so the server still touches
every doc but the client only reads one cluster's scores) gives cluster-grade
recall at full-scan privacy and full-scan compute. We do not implement that here;
"pir" is our full-privacy point and "pir_cluster" is the leaky-but-fast point.
"""
from __future__ import annotations
import numpy as np
from dataclasses import dataclass, field
from sklearn.cluster import KMeans
from . import lwe
from .embed import Embedder, QMAX, topk_plain


@dataclass
class Index:
    M: np.ndarray                 # int64 [N, d] quantized doc embeddings (signed)
    embedder: Embedder
    n_lwe: int = 1024
    sigma: float = 3.2
    n_clusters: int = 0
    # built artifacts:
    M_modq: np.ndarray = None
    hint: np.ndarray = None
    lhe: "lwe.LHE" = None
    params: "lwe.PublicParams" = None
    centroids: np.ndarray = None          # float, for local cluster pick
    cluster_of: np.ndarray = None         # [N] cluster id per doc
    members: list = field(default_factory=list)

    def build(self):
        N, d = self.M.shape
        delta = lwe.choose_delta(d, QMAX)
        self.params = lwe.PublicParams(d=d, n=self.n_lwe, delta=delta, sigma=self.sigma)
        self.lhe = lwe.LHE(self.params, seed=7)
        self.M_modq = lwe.to_modq(self.M)
        self.hint = self.lhe.build_hint(self.M_modq)
        if self.n_clusters > 1:
            km = KMeans(n_clusters=self.n_clusters, n_init=3, random_state=0)
            self.cluster_of = km.fit_predict(self.M.astype(np.float64))
            self.centroids = km.cluster_centers_
            self.members = [np.where(self.cluster_of == c)[0] for c in range(self.n_clusters)]
        return self

    # ---- size accounting (bytes) ----
    def hint_bytes(self) -> int:
        return self.hint.size * 4

    def query_up_bytes(self) -> int:
        return self.params.d * 4          # ciphertext c (A is offline/seed-expandable)

    def response_down_bytes(self, mode: str, cluster_size: int = 0) -> int:
        if mode == "pir":
            return self.M.shape[0] * 4
        if mode == "pir_cluster":
            return cluster_size * 4
        return 8 * 10                     # plaintext: just the top-k ids

    # ---- queries ----
    def query_plain(self, q_vec: np.ndarray, k: int):
        scores = self.M @ q_vec
        return topk_plain(scores, k), scores

    def query_pir(self, q_vec: np.ndarray, k: int):
        """Full privacy: server only ever sees ciphertext c."""
        sk = self.lhe.keygen()
        c = self.lhe.encrypt(sk, q_vec)               # client side
        ans = self.lhe.server_eval(self.M_modq, c)    # SERVER side: sees only c
        scores = self.lhe.decrypt(sk, self.hint, ans) # client side
        return topk_plain(scores, k), scores

    def pick_clusters(self, q_vec: np.ndarray, n_probe: int = 1) -> np.ndarray:
        # centroids live in quantized space; select with the quantized query.
        d2 = ((self.centroids - q_vec) ** 2).sum(1)
        return np.argsort(d2)[:n_probe]

    def query_pir_cluster(self, q_vec: np.ndarray, k: int, n_probe: int = 1):
        """Leaky-but-fast: reveal which cluster(s), PIR within them."""
        cids = self.pick_clusters(q_vec, n_probe)     # local, then SENT to server
        rows = np.concatenate([self.members[c] for c in cids])
        subM = self.M_modq[rows]
        subhint = self.hint[rows]
        sk = self.lhe.keygen()
        c = self.lhe.encrypt(sk, q_vec)
        ans = self.lhe.server_eval(subM, c)           # server computes over cluster only
        hs = lwe._modmul_matvec(subhint, sk.s)
        noisy = (ans.astype(np.int64) - hs.astype(np.int64)) % lwe.Q
        scores = np.rint(lwe.center(noisy.astype(np.uint32)) / self.params.delta).astype(np.int64)
        local = topk_plain(scores, k)
        return rows[local], cids, len(rows)
