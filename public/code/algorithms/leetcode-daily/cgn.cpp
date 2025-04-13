class Solution {
public:
    static constexpr long long MOD = 1e9 + 7;
    long long mpow(long long a, long long b, long long mod=MOD) {
        long long ans = 1;
        while (b > 0) {
            if (b & 1) {
                ans = (ans * a) % MOD;
            }
            a = (a * a) % MOD;
            b >>= 1;
        }
        return ans;
    }
    int countGoodNumbers(long long n) {
        long long even_slots = (n + 1) / 2, odd_slots = n / 2;
        return (mpow(5, even_slots) * mpow(4, odd_slots)) % MOD;
    }
};
