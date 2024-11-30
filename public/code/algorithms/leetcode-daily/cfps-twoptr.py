def countFairPairs(self, nums, lower, upper):
    nums.sort()
    ans = 0

    def pairs_leq(x: int) -> int:
        pairs = 0
        l, r = 0, len(nums) - 1
        while l < r:
            if nums[l] + nums[r] <= x:
                pairs += r - l
                l += 1
            else:
                r -= 1
        return pairs

    return pairs_leq(upper) - pairs_leq(lower - 1)
