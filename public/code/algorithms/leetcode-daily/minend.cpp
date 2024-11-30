long long minEnd(int n, long long x) {
  int bits_to_distribute = n - 1;
  long long mask = 1;

  while (bits_to_distribute > 0) {
    if ((x & mask) == 0) {
      // if the bit should be set, set it-otherwise, leave it alone
      if ((bits_to_distribute & 1) == 1)
        x |= mask;
      bits_to_distribute >>= 1;
    }
    mask <<= 1;
  }

  return x;
}
