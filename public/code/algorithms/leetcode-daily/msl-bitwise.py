def minimumSubarrayLength(self, nums, k):
    ans = sys.maxsize

    largest = max(*nums, k)
    num_digits = floor((log(max(largest, 1))) / log(2)) + 1

    counts = [0] * num_digits
    l = 0

    def update(x, delta):
        for i in range(len(counts)):
            if x & 1:
                counts[i] += delta
            x >>= 1

    def bitwise_or():
        return reduce(
            operator.or_,
            (1 << i if count else 0 for i, count in enumerate(counts)),
            0
        )

    for r, num in enumerate(nums):
        update(num, 1)
        while l <= r and bitwise_or() >= k:
            ans = min(ans, r - l + 1)
            update(nums[l], -1)
            l += 1

    return -1 if ans == sys.maxsize else ans
