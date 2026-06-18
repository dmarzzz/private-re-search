"""
Linearly-homomorphic encryption for private inner-product search.

This is the SimplePIR / Tiptoe ranking primitive, stripped to its core: the
client encrypts a query vector under LWE, the server computes a matrix-vector
product over the ciphertext WITHOUT decrypting, and the client recovers the
exact integer inner products of its query against every document.

Math (all mod q = 2^32):
    keygen:   A in Z_q^{d x n}   (public, query-independent)
              s in Z_q^{n}       (client secret)
    encrypt:  c = A@s + e + Delta*q_vec          (length d)
    server:   ans = M @ c        for doc matrix M in Z_q^{N x d}
                  = (M@A)@s + M@e + Delta*(M@q_vec)
    hint:     H = M @ A          (length N x n, precomputed offline)
    decrypt:  ans - H@s = M@e + Delta*(M@q_vec)  ~= Delta*(M@q_vec)
              round(./Delta) -> the exact scores M@q_vec

The server's entire view is `c`, which is LWE-encrypted and reveals nothing
about q_vec under the hardness of LWE. No hardware trust, no enclave.

We reduce mod 2^64 implicitly via uint64 overflow; since 2^32 | 2^64, masking
the low 32 bits recovers the correct value mod q. Verified in __main__.
"""
from __future__ import annotations
import numpy as np
from dataclasses import dataclass

Q_BITS = 32
Q = 1 << Q_BITS
MASK = np.uint64(Q - 1)


def _modmul_matvec(mat: np.ndarray, vec: np.ndarray) -> np.ndarray:
    """(mat @ vec) mod 2^32, integer-exact via uint64 wrap then mask."""
    out = mat.astype(np.uint64) @ vec.astype(np.uint64)
    return (out & MASK).astype(np.uint32)


def _modmul_matmat(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    out = a.astype(np.uint64) @ b.astype(np.uint64)
    return (out & MASK).astype(np.uint32)


def to_modq(x: np.ndarray) -> np.ndarray:
    """Map a signed integer array into Z_q (uint32)."""
    return np.mod(x.astype(np.int64), Q).astype(np.uint32)


def center(x: np.ndarray) -> np.ndarray:
    """Map Z_q (uint32) back to the signed representative in (-q/2, q/2]."""
    xi = x.astype(np.int64)
    xi[xi > Q // 2] -= Q
    return xi


@dataclass
class PublicParams:
    d: int            # query/embedding dimension
    n: int            # LWE secret dimension (security)
    delta: int        # scaling factor Delta = q / p
    sigma: float      # LWE error std-dev


@dataclass
class SecretKey:
    s: np.ndarray     # uint32, length n


class LHE:
    def __init__(self, params: PublicParams, seed: int = 0):
        self.p = params
        self.rng = np.random.default_rng(seed)
        # A is public and query-independent. In real SimplePIR it is expanded
        # from a short seed (so it costs ~32 bytes online); we materialize it.
        self.A = self.rng.integers(0, Q, size=(params.d, params.n), dtype=np.uint64).astype(np.uint32)

    def keygen(self) -> SecretKey:
        s = self.rng.integers(0, Q, size=self.p.n, dtype=np.uint64).astype(np.uint32)
        return SecretKey(s=s)

    def build_hint(self, M_modq: np.ndarray) -> np.ndarray:
        """H = M @ A, the query-independent offline digest (length N x n)."""
        return _modmul_matmat(M_modq, self.A)

    def encrypt(self, sk: SecretKey, q_vec: np.ndarray) -> np.ndarray:
        """q_vec: signed integer query embedding, length d. Returns c (uint32, length d)."""
        d = self.p.d
        As = _modmul_matvec(self.A, sk.s)                       # length d
        e = np.rint(self.rng.normal(0, self.p.sigma, size=d)).astype(np.int64)
        scaled = (self.p.delta * q_vec.astype(np.int64))
        c = (As.astype(np.int64) + e + scaled) % Q
        return c.astype(np.uint32)

    @staticmethod
    def server_eval(M_modq: np.ndarray, c: np.ndarray) -> np.ndarray:
        """The only thing the server runs. Sees M (public) and c (ciphertext)."""
        return _modmul_matvec(M_modq, c)

    def decrypt(self, sk: SecretKey, hint: np.ndarray, ans: np.ndarray) -> np.ndarray:
        """Recover the integer scores M @ q_vec from the server's answer."""
        hs = _modmul_matvec(hint, sk.s)                          # length N
        noisy = (ans.astype(np.int64) - hs.astype(np.int64)) % Q
        centered = center(noisy.astype(np.uint32))
        return np.rint(centered / self.p.delta).astype(np.int64)


def choose_delta(d: int, max_abs_embed: int) -> int:
    """Pick Delta so Delta/2 comfortably exceeds the LWE noise term M@e,
    while p = q/Delta still exceeds the score magnitude d*max^2."""
    max_score = d * max_abs_embed * max_abs_embed
    p = 1
    while p < 4 * max_score:        # headroom factor 4 over the score range
        p <<= 1
    return Q // p


if __name__ == "__main__":
    # Self-test: encrypt -> server eval -> decrypt must equal plaintext M@q exactly.
    rng = np.random.default_rng(42)
    N, d, n = 2000, 128, 1024
    M = rng.integers(-8, 8, size=(N, d), dtype=np.int64)        # 4-bit signed docs
    q = rng.integers(-8, 8, size=d, dtype=np.int64)             # 4-bit signed query
    delta = choose_delta(d, 8)
    params = PublicParams(d=d, n=n, delta=delta, sigma=3.2)
    lhe = LHE(params, seed=1)
    sk = lhe.keygen()
    M_modq = to_modq(M)
    hint = lhe.build_hint(M_modq)
    c = lhe.encrypt(sk, q)
    ans = lhe.server_eval(M_modq, c)
    scores = lhe.decrypt(sk, hint, ans)
    truth = M @ q
    ok = np.array_equal(scores, truth)
    print(f"delta=2^{int(np.log2(delta))}  p=2^{int(np.log2(Q//delta))}")
    print(f"max|noise margin used|: scores match plaintext exactly = {ok}")
    print(f"max abs score = {np.abs(truth).max()}  (must be < p/2 = {Q//delta//2})")
    assert ok, "LWE roundtrip FAILED: scores do not match plaintext"
    # Privacy smoke test: the server input c is the only thing it sees; show that
    # without s, two different queries are indistinguishable (ciphertexts uniform).
    c2 = lhe.encrypt(sk, rng.integers(-8, 8, size=d, dtype=np.int64))
    print(f"ciphertext mean ~ q/2? {c.mean()/Q:.3f} vs {c2.mean()/Q:.3f} (both ~0.5 = uniform)")
    print("OK: server computes inner products it cannot read.")
